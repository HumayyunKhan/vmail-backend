const httpStatus = require('http-status');
const db = require('../../db/models');
const Imap = require('../../../lib/Connection');
const { simpleParser } = require('mailparser');


class Admin {

  delete = async (req, res) => {
    try {
      const { id } = req.params
      const Exist = await db.TestAccounts.findOne({ where: { id } })
      if (!Exist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "Account doesnot exist" })
      await db.TestAccounts.destroy({ where: { id } })  
      await db.AccountRecords.destroy({ where: { accountId:id } })

      return res.send({ message: "Account successfully deleted" })

    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: 'Something went wrong on server side!',
      });
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      const { email, password, domain, port } = req.body
      let newProps = { email, password, domain, port }
      const Exist = await db.TestAccounts.findOne({ where: { id } })
      if (!Exist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "Account doesnot exist" })
      await db.TestAccounts.update( newProps , { where: { id } })
      return res.send({ message: "Account successfully updated" })

    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: 'Something went wrong on server side!',
      });
    }
  }

  register = async (req, res) => {
    try {
      const { email, password, port, domain } = req.body

      console.log(req.body,"-----------------------")
      const alreadyExist = await db.TestAccounts.findOne({ where: { email:email } })
      if (alreadyExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "User with same email already exist" })

      let imapConfig = {
        user: email,
        password:password,
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
            imap.search([['UNDELETED']], async(err, results) => {
         if(results){
          const account = await db.TestAccounts.create({ email, password, port, domain })
          if (!account) return res.status(httpStatus.CONFLICT).send({ success: true, message: "Cannot create a user account. Try again later" })
          return res.send({ message: "Account successfully created" })
    
         }
         
            });
        });
    });
    
    imap.connect()
    imap.once('error', async(err) => {
        if(err.source=="authentication"){
            if(imap._config.user)return res.status(409).send({success:false,message:"Invalid Credentials"})
        }
        console.log(imap._config.user)
        // console.log(err.source=="","imap.once---------------")

        imap.destroy();
    });
    imap.once('end', async () => {
        console.log('Connection ended');
        imap.destroy()  

    });

    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: 'Something went wrong on server side!',
      });
    }
  }
  // register = async (req, res) => {
  //   try {
  //     const { email, password, port, domain } = req.body

  //     console.log(req.body,"-----------------------")
  //     const alreadyExist = await db.TestAccounts.findOne({ where: { email:email } })
  //     if (alreadyExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "User with same email already exist" })



  //     const account = await db.TestAccounts.create({ email, password, port, domain })
  //     if (!account) return res.status(httpStatus.CONFLICT).send({ success: true, message: "Cannot create a user account. Try again later" })
  //     return res.send({ message: "Account successfully created" })

  //   } catch (ex) {
  //     console.log(ex)
  //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
  //       status: false,
  //       message: 'Something went wrong on server side!',
  //     });
  //   }
  // }

  displayAccounts = async (req, res) => {
    try {
      let accounts = await db.TestAccounts.findAll({})
      accounts.map((o) => {
        delete o.dataValues.password
        delete o.dataValues.smtpPort
        delete o.dataValues.domain
      })

      return res.send({ success: "accounts successfully fetched", data: accounts })

    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: 'Something went wrong on server side!',
      });
    }
  }




}

module.exports = new Admin();
