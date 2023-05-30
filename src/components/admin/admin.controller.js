const httpStatus = require('http-status');
const db = require('../../db/models');
const Imap = require('../../../lib/Connection');
const { simpleParser } = require('mailparser');


class Admin {
  register = async (req, res) => {
    try {
      const { email, password, smtpPort, domain } = req.body
      const alreadyExist = await db.Users.findOne({ where: { email } })
      if (alreadyExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "User with same email already exist" })
      const account = await db.Users.create({ email, password, smtpPort, domain })
      if (!account) return res.status(httpStatus.CONFLICT).send({ success: true, message: "Cannot create a user account.Try again later" })
      return res.send({ message: "Account successfully created" })

    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: 'Something went wrong on server side!',
      });
    }
  }


  displayAccounts=async(req,res)=>{
    try{
      let accounts = await db.Users.findAll({})
accounts.map((o)=>{
  delete o.dataValues.password
  delete o.dataValues.smtpPort
  delete o.dataValues.domain
})

return res.send({success:"accounts successfully fetched",data:accounts})

    }catch(ex){
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: 'Something went wrong on server side!',
      });
    }
  }


  checkInbox = async (req , res , details)=>{
    try{
    const {id}=req.params
    const accountExist=await db.Users.findOne({where:{accountId:id}})
    if(!accountExist)return res.status(httpStatus.NOT_FOUND).send({message:"Specified account does not exist",success:false})
    console.log("ACCOUNT ID: ",id)
    console.log("we are in checkInboxEmails Controler");
    let responseStatus = false
    let timeOutStatus = false;
      
      let savedEmails = await db.Inbox.findAll({where : {accountId:id}});
      let savedEmailUids = savedEmails.map(el => parseInt(el.uid));
      let imapConfig = {
        user: accountExist.email,
        password: accountExist.password,
        host: accountExist.domain,
        port: accountExist.smtpPort,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      };
      console.log(imapConfig)
      const imap = new Imap(imapConfig);
      let Result = 0;
      let availableUids = [];
      let uidIndex = 0;
      let mails = [];
      imap.once('ready', (err) => {
        imap.openBox("Inbox", false, async(err) => {
          if (err) {
            res.send({ success: false, error: err, status: 400 })
          }
          const searchCriteria = ['UNDELETED'];
          imap.search(searchCriteria, async(err, results) => {
            // console.log("results here by us:", results);
            // console.log("results here by us:", results.length);
            Result = results.length;
            console.log("results uid by us:", results);
            if(Result == savedEmails.length){
              const totalMails=await db.Inbox.findAll({where:{accountId:id}})

              res.send({ success: false, message: "No New Emails",data:totalMails })
              responseStatus = true
              return
            }
             let diffResults = savedEmailUids.filter(x => !results.includes(x)).concat(results.filter(x => !savedEmailUids.includes(x)));
            console.log("diffResults" , diffResults);
            if (diffResults.length > 0) {
            // if (results.length > 0) {
              // console.log("result have more length then 0" , Result);
              let limitedResult = results;
              limitedResult.reverse();
              // console.log("limited Result set:", limitedResult)
              if (limitedResult.length == 0) {
                if (!responseStatus) {
                  res.send({ success: false, message: "No mail found" })
                  responseStatus = true
                  return
                }
              }
              const fetchOptions = {
                // bodies:['TEXT','HEADER']
                bodies: ['TEXT','HEADER.FIELDS (FROM TO SUBJECT TEXT DATE MESSAGE-ID X-CUSTOM-HEADER X-MY-CUSTOM-HEADER)'],
              };
              limitedResult.forEach((uid) => {
                const mailInstance = imap.fetch(uid, fetchOptions);
                mailInstance.on('message', msg => {
                  msg.on('body', stream => {
                    simpleParser(stream, async (err, parsed) => {
                      const { from, subject, textAsHtml, text, to, headerLines } = parsed;
                      // parsed.to.value = to.value.filter((el) => el.addres != details.useremail)
                      console.log("parsed.............................." , parsed);
                      parsed["uid"] = uid
                      // console.log(limitedResult[uidIndex], "------------uidINDEX HERE");
                      mails.push(parsed)
                      uidIndex++
                      if (uidIndex == limitedResult.length) {
                        // console.log('Connection ended');

                        // console.log(availableUids)
                        // for (const el of mails) {
                        //   el["flags"] = availableUids.find((o) => o.uid == el.uid).flags
                        // }

                        if (!timeOutStatus && !responseStatus) {

                          let savedMailsArray = []

                          for(const sMail of mails){
                            // console.log("........////////////" , sMail.uid);
                            // console.log("........////////////" , sMail.text);
                            let obj = {
                              accountId:id,
                              messageId:sMail.messageId,
                              uid: sMail.uid,
                              text: sMail.text,
                              subject:sMail.subject,
                              to:JSON.stringify(sMail.to),
                              from:JSON.stringify(sMail.from),
                              isRead:false,
                            }
                            savedMailsArray.push(obj);
                          }
                          const isSaved = await db.Inbox.bulkCreate(savedMailsArray);
                          const totalMails=await db.Inbox.findAll({where:{accountId:id}})
                          if(isSaved){
                            if(!responseStatus){
                              responseStatus=true
                              return res.send({
                                status: true,
                                message: 'mails successfully fetched and saved',
                                data:totalMails
                              });
                            }
                          }
                          else{
                            if(!responseStatus){
                            responseStatus=true
                           return res.status(httpStatus.CONFLICT).send({
                              status: false,
                              message: 'Failed To Save and fetch mailss'
                            });
                          }
                          }
                          mails.reverse()
                          res.send({ success: true, data: savedMailsArray, emailCount: Result, status: 200 })
                          imap.end()
                          responseStatus = true
                        }
                      }
                    });
                  })

                  msg.once('attributes', async attrs => {
                    // console.log(attrs, "ATTRIBUTES HERE")
                    const { uid, flags, } = attrs;
                    attrs["flags"]= availableUids.push({ uid, flags })
                    // console.log(uid, "UID HERE--------------");
                  })

                });

                mailInstance.once('error', ex => {
                  return Promise.reject(ex);
                });

                mailInstance.once('end', () => {
                  console.log('Done fetching all messages!');
                  imap.end();
                });

              });
              if (err) {
                console.log(err)
                if(!responseStatus){
                  responseStatus=true
                  return res.send({status:409,success:false,message:"An error occured while connecting.Please try again later"})
                }
              }
            }
            else {
              if(!responseStatus){
                responseStatus=true
                imap.destroy();
                return res.send({ success: true, status: 200, data: [], message: "No email found" })
              }
            }
          })
        })
      })
      imap.once('error', err => {
        if (!responseStatus) {
          responseStatus = true
          imap.destroy()
          return res.send({ success: false, error: err, message: "An error occured while connecting" })
        }
        return;
      });
      imap.once('end', async () => {
        console.log('Connection ended');
      });

      setTimeout(() => {
        if (!responseStatus) {
          res.send({ success: false, message: "server timeout", status: 404 })
          console.log("server time ouut")
          timeOutStatus = true
          responseStatus=true
          // imap.end()
          imap.destroy()
          return;
        }
      }, 80000);

      imap.connect();

    }
    catch (ex) {
      console.log('an error occurred',ex);
        return res.send({status:409,success:false,message:"An error occured on server side"})
 
    }
  }



}

module.exports = new Admin();
