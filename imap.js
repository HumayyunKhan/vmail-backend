const schedule = require("node-schedule")
const { simpleParser } = require('mailparser');
const db = require('./src/db/models')
const { Op } = require("sequelize");
const Imap = require('./lib/Connection');
const {setValidStatus}=require("./src/components/Validator/validation");
const { parse } = require("dotenv");
// const account_records = require("./src/db/models/account_records");
function extractEmailAddress(message) {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = message.match(regex);

    if (matches && matches.length > 0) {
        return matches[0];
    }

    return null; // No email address found
}
function dailyStatsHandler() {

    const job = schedule.scheduleJob('0 0 0 * * *', async () => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const recordCreated = await db.AccountRecords.findOne({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                }
            }
        })
        if (recordCreated) return
        const TestAccounts = await db.TestAccounts.findAll()
        TestAccounts.forEach(async (account) => {
            await db.AccountRecords.create({ accountId: account.id, creditsUsed: 0, active: true })

        });

    })
}
async function statsHandler() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const recordCreated = await db.AccountRecords.findOne({
        where: {  
            createdAt: {
                [Op.between]: [startOfDay, endOfDay],
            }
        }
    })
    if (recordCreated) return
    const TestAccounts = await db.TestAccounts.findAll()
    TestAccounts.forEach(async (account) => {
        await db.AccountRecords.create({ accountId: account.id, creditsUsed: 0, active: true })

    });


}
async function hourlyMailBoxReader() {   
    try { 
        let responseStatus = false;       
        //   const job=schedule.scheduleJob('*/20 * * * * *',async()=>{ 
            const job=schedule.scheduleJob('0 */2 * * * *',async()=>{
              const testAccounts = await db.TestAccounts.findAll({where:{deletedAt:null}}) 
            //   let testAccounts=[];
            //   testAccounts.push(testAccounts1[0])

            for (const account of testAccounts) {
                // console.log(account)
                let imapConfig = {
                    user: account.email,
                    password: account.password,
                    host: "smtp.gmail.com",
                    port: 993,  
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },

                };
                let uidIndex = 0; 
                // console.log(imapConfig)
                const imap = new Imap(imapConfig);
                let limitedResult = [];
                let Result = 0;
                imap.once('ready', (err) => {
                    console.log(err)
                    imap.openBox('Inbox', false, (err) => {
                        if (err) {
                            console.log("ERROR OCCURED AT OPENING BOX",imapConfig)
                        }
                        // imap.search([['ALL']], (err, results) => {
                        imap.search([['UNDELETED'], ['TEXT', 'delivered']], (err, results) => {
                        // imap.search([['UNDELETED'], ['SUBJECT', 'Greetings']], (err, results) => {
                            console.log('results here: ', results, 'no of mails: ', results.length);
                            // console.log('results here: ', results, 'no of mails: ', results.length,imapConfig);
                            Result = results.lengths;
                            if (results.length > 0) {
                                limitedResult = results;
                                limitedResult.reverse();

                                const fetchOptions = {
                                    bodies:'',
                                };
                                limitedResult.forEach((uid) => {

                                    const mailInstance = imap.fetch(uid, fetchOptions);

                                    mailInstance.on('message', (msg) => {
                                        console.log(msg, 'msg here---------------');
                                        msg.on('body', (stream) => {
                                            simpleParser(stream, async (err, parsed) => {
                                                console.log(err,"---------")
                                                const {
                                                    from, subject, textAsHtml, text, to, headerLines,
                                                } = parsed;
                                                console.log('parsed..............................', parsed);
                                                if(subject){
                                                    const email = extractEmailAddress(subject);
                                                    const email1 = extractEmailAddress(text);
                                                    console.log(email);
                                                    console.log(email1);
                                                    await db.EmailAddresses.destroy({ where: { email: email } })
                                                    await db.EmailAddresses.destroy({ where: { email: email1 } })

                                                }

                                                await imap.setFlags(uid, '\\Deleted', () => {
                                                    console.log('successfully deleted');
                                                    // imap.end(); 
                                                });


                                                console.log(limitedResult[uidIndex], '------------uidINDEX HERE');
                                                uidIndex++;
                                                if (uidIndex == limitedResult.length) {
                                                    console.log('Connection ended');

                                                    // imap.destroy();
                                                    responseStatus = true;

                                                }
                                            });
                                        });

                                    });

                                    mailInstance.once('error', (ex) =>{
                                        console.log(ex)
                                    });

                                    mailInstance.once('end', () => {
                                        console.log('Done fetching all messages!');
                                        //   imap.end();
                                    });
                                });

                                if (err) {
                                    console.log(err);
                                }
                            } else {
                                console.log("NO MAIL FOUND")
                                responseStatus = true;
                                imap.destroy();
                            }
                        });
                    });
                });
                
                imap.connect()
                imap.once('error', (err) => {
                    console.log(err)
                    if (!responseStatus) {
                        //   res.send({ success: false, error: err, message: 'An error occured' });
                        console.log("ERROR OCCURED AT OPENING BOX")

                        responseStatus = true;
                    }
                    imap.destroy();
                });
                imap.once('end', async () => {
                    console.log('Connection ended');

                });

                // imap.connect();
            }
        })

    } catch (ex) {
        console.log('an error occurred', ex);
        //   res.send({ success: false, message: 'Error Ocuured', status: 400 });
    }
};
async function hourlyMailBoxReaderSpam() {   
    try { 
        let responseStatus = false;       
        //   const job=schedule.scheduleJob('0/10 * * * * *',async()=>{ 
            const job=schedule.scheduleJob('0 */2 * * * *',async()=>{
              const testAccounts = await db.TestAccounts.findAll({where:{deletedAt:null}}) 
            //   let testAccounts=[];
            //   testAccounts.push(testAccounts1[0])

            for (const account of testAccounts) {
                // console.log(account)
                let imapConfig = {
                    user: account.email,
                    password: account.password,
                    host: "smtp.gmail.com",
                    port: 993,  
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },

                };
                let uidIndex = 0; 
                // console.log(imapConfig)
                const imap = new Imap(imapConfig);
                let limitedResult = [];
                let Result = 0;
                imap.once('ready', (err) => {
                    console.log(err)
                    imap.openBox('[Gmail]/Spam', false, (err) => {
                        if (err) {
                            console.log("ERROR OCCURED AT OPENING BOX",imapConfig)
                        }
                        // imap.search([['ALL']], (err, results) => {
                        imap.search([['UNDELETED'], ['TEXT', 'delivered']], (err, results) => {
                        // imap.search([['UNDELETED'], ['SUBJECT', 'Greetings']], (err, results) => {
                            console.log('results here: ', results, 'no of mails: ', results.length);
                            // console.log('results here: ', results, 'no of mails: ', results.length,imapConfig);
                            Result = results.lengths;
                            if (results.length > 0) {
                                limitedResult = results;
                                limitedResult.reverse();

                                const fetchOptions = {
                                    bodies:'',
                                };
                                limitedResult.forEach((uid) => {

                                    const mailInstance = imap.fetch(uid, fetchOptions);

                                    mailInstance.on('message', (msg) => {
                                        console.log(msg, 'msg here---------------');
                                        msg.on('body', (stream) => {
                                            simpleParser(stream, async (err, parsed) => {
                                                console.log(err,"---------")
                                                const {
                                                    from, subject, textAsHtml, text, to, headerLines,
                                                } = parsed;
                                                console.log('parsed..............................', parsed);
                                                if(subject){
                                                    const email = extractEmailAddress(subject);
                                                    const email1 = extractEmailAddress(text);
                                                    console.log(email);
                                                    console.log(email1);
                                                    await db.EmailAddresses.destroy({ where: { email: email } })
                                                    await db.EmailAddresses.destroy({ where: { email: email1 } })

                                                }

                                                await imap.setFlags(uid, '\\Deleted', () => {
                                                    console.log('successfully deleted');
                                                    // imap.end(); 
                                                });


                                                console.log(limitedResult[uidIndex], '------------uidINDEX HERE');
                                                uidIndex++;
                                                if (uidIndex == limitedResult.length) {
                                                    console.log('Connection ended');

                                                    // imap.destroy();
                                                    responseStatus = true;

                                                }
                                            });
                                        });

                                    });

                                    mailInstance.once('error', (ex) =>{
                                        console.log(ex)
                                    });

                                    mailInstance.once('end', () => {
                                        console.log('Done fetching all messages!');
                                        //   imap.end();
                                    });
                                });

                                if (err) {
                                    console.log(err);
                                }
                            } else {
                                console.log("NO MAIL FOUND")
                                responseStatus = true;
                                imap.destroy();
                            }
                        });
                    });
                });
                
                imap.connect()
                imap.once('error', (err) => {
                    console.log(err)
                    if (!responseStatus) {
                        //   res.send({ success: false, error: err, message: 'An error occured' });
                        console.log("ERROR OCCURED AT OPENING BOX")

                        responseStatus = true;
                    }
                    imap.destroy();
                });
                imap.once('end', async () => {
                    console.log('Connection ended');

                });

                // imap.connect();
            }
        })

    } catch (ex) {
        console.log('an error occurred', ex);
        //   res.send({ success: false, message: 'Error Ocuured', status: 400 });
    }
};
async function fileModifier(){
    const batch=await db.Batches.findOne({where:{batchId:"ea955942-aaa5-40b8-822d-dcd6d48a860a"}})
    const discardedMails = await db.EmailAddresses.findAll({ where: { deletedAt: { [Op.ne]: null}, batchId: "ea955942-aaa5-40b8-822d-dcd6d48a860a"} , paranoid: false })
    console.log(discardedMails)
    let inValidEmails = discardedMails.map(mail=>mail.email)

if(batch){    setValidStatus(batch.filePath, inValidEmails, () => {
      console.log("FILE SUCCESSFULLY MODIFIED")
    })}
}


module.exports = { dailyStatsHandler, hourlyMailBoxReader, statsHandler,fileModifier,hourlyMailBoxReaderSpam }
