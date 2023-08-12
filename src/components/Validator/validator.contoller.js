const fs = require('fs');
const httpStatus = require('http-status');
const { mailer } = require("../../helpers/mailer")
const db = require('../../db/models')
const { Op } = require('sequelize')
const schedule = require('node-schedule')
const { validateEmail: validate, availableCredits, setValidStatus } = require("./validation")
require('dotenv').config()
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');

class Validator {

  async validateBatch(req, res) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const batchId = uuidv4()
      const emails = [], addresses = [], filePath = req.file.path
      let accountRecordIds = []
      if (!filePath) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No file specified" })

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          console.log(data)
          const email = data.email

          console.log(email, "0000000000000000000")
          // Assuming the email column name is 'email'. Modify this if your CSV has a different column name.
          if (email) {
            emails.push({ batchId, email });
            addresses.push(email);

          }
        })
        .on('end', async () => {
          var date = new Date()
          date.setDate(date.getDate() + 3)
          console.log(date)
          const availableCreds = await availableCredits();
          let listLength = addresses.length;
          console.log(availableCreds, "-----------", listLength)
          if (availableCreds < addresses.length) return res.status(409).send({ success: false, message: "Your batch exceeds the daily limit" })

          const newBatch = await db.Batches.create({ batchId, deliverableAt: date.toUTCString(), filePath: filePath, fileName: req.file.originalname })
          const newBatchRecords = await db.EmailAddresses.bulkCreate(emails)
          if (addresses.length > 0) {
            const sender = await db.AccountRecords.findAll({
              where: {
                createdAt: {
                  [Op.between]: [startOfDay, endOfDay],
                }, creditsUsed: { [Op.lt]: 400 }, deletedAt: null, allotedTo: null
              }, include: { model: db.TestAccounts, attribute: ['email', 'password', 'domain', 'port'] ,where:{active:true}}
            })
            if(sender.length==0)return res.status(409).send({success:false,message:'No test account available',})
            let accountLimit = 0
            for (const account of sender) {
              if (accountLimit < listLength) {
                accountLimit += 400-account.creditsUsed 
                console.log(accountLimit)
                accountRecordIds.push(account.id)
              }
            }
            await db.AccountRecords.update({ allotedTo: batchId }, { where: { id: { [Op.in]: accountRecordIds } } })

            mailer(addresses, batchId)

          } else {
            return res.status(httpStatus.CONFLICT).send({ success: false, message: "No email found", data: null })
          }

          const millisecondsIn72Hours = 71 * 60 * 60 * 1000;
          // const millisecondsIn1Hours =  1* 60 * 60 * 1000;;
          const job = schedule.scheduleJob('0 0 */1 * * *', async function () {
            const batchPending=await db.Batches.findOne({ where: { batchId: batchId,status: "FINALIZED" } })
            if(batchPending) job.cancel();
            const discardedMails = await db.EmailAddresses.findAll({ where: { deletedAt: { [Op.ne]: null }, batchId: batchId }, paranoid: false })
            console.log(discardedMails)
            let inValidEmails = discardedMails.map(mail => mail.email)

            setValidStatus(filePath, inValidEmails, () => {
              console.log("FILE SUCCESSFULLY MODIFIED")
            })
          })
          setTimeout(async () => {
            await db.Batches.update({ status: "FINALIZED" }, { where: { batchId: batchId } })
            const discardedMails = await db.EmailAddresses.findAll({ where: { deletedAt: { [Op.ne]: null }, batchId: batchId }, paranoid: false })
            console.log(discardedMails)
            let inValidEmails = discardedMails.map(mail => mail.email)

            setValidStatus(filePath, inValidEmails, () => {
              console.log("FILE SUCCESSFULLY MODIFIED")
            })
            // Code to execute after 72 hours
            console.log('Timeout has completed after 72 hours.');
          }, millisecondsIn72Hours);

          return res.send({ message: "Your file has been successfully uploaded", data: { batchId } })
        })
        .on('error', (error) => {
          console.error('An error occurred while reading the CSV file:', error);
        });

    } catch (ex) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "emails processed successfully", success: false })
    }

  }


  async checkStatus(req, res) {
    try {
      const { batchId } = req.body
      const batchExist = await db.Batches.findOne({ where: { batchId } })
      if (!batchExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })
      return res.send({ success: true, message: "Batch status successFully fetched", status: batchExist.status, delivery: batchExist.deliverableAt })
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }

  async deleteBatch(req, res) {
    try {
      const { batchId } = req.query
      // let batchId="ef7f699a-7bc7-404a-bbb1-4cb51ea98e68"
      const batchExist = await db.Batches.findOne({ where: { batchId } })
      if (!batchExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })
      await db.EmailAddresses.destroy({where:{batchId:batchId},force:true})
     await  fs.rmSync(batchExist.filePath, {
        force: true,
    });
    
      await db.Batches.destroy({ where: { batchId: batchId } })
    
      return res.send({ success: true, message: "Batch successfully deleted  " })
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }

  async downloadBatch(req, res) {
    try {
      const { batchId } = req.query
      // let batchId="ef7f699a-7bc7-404a-bbb1-4cb51ea98e68"
      const batchExist = await db.Batches.findOne({ where: { batchId } })
      if (!batchExist) return resource.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })
      return res.download(batchExist.filePath, (err) => {
        if (err) {
          // Handle error if the file cannot be downloaded
          console.error(err);
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: 'Error downloading file.' });
        }
      });
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }

  async getDiscardedMails(req, res) {
    try {
      const { batchId } = req.body
      const batchExist = await db.Batches.findOne({ where: { batchId } })
      if (!batchExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })
      const discardedMails = await db.EmailAddresses.findAll({ where: { deletedAt: { [Op.ne]: null }, batchId: batchId }, paranoid: false })
      return res.send({ success: true, message: "Batch status successFully fetched", data: discardedMails })
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }

  async processedData(req, res) {
    try {
      const { batchId } = req.body
      const batchExist = await db.Batches.findOne({ where: { batchId } })
      if (!batchExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })
      if (batchExist.status != 'FINALIZED') return res.status(404).send({ success: false, message: "Your batch hasn't been finalized yet" })
      const processedMails = await db.EmailAddresses.findAll({ where: { batchId: batchId } })

      return res.send({ success: true, message: "Batch Data successFully fetched", data: processedMails })
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }

  async dailyLimit(req, res) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const accountRecords = await db.AccountRecords.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          }, creditsUsed: { [Op.lt]: 400 }, deletedAt: null, allotedTo: null
        }
      })
      const totalLimit = 400 * accountRecords.length
      let credsUsed = 0
      for (const record of accountRecords) {
        credsUsed += record.creditsUsed
      }

      return res.send({ success: true, message: "Daily limit Successfully fetcehd", limit: totalLimit - credsUsed })
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }
  // async processedData(req, res) {
  //   try {
  //     const { batchId } = req.body
  //     const batchExist = await db.Batches.findOne({ where: { batchId } })
  //     if (!batchExist) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })
  //     if (batchExist.status != 'FINALIZED') return res.status(404).send({ success: false, message: "Your batch hasn't been finalized yet" })
  //     const processedMails = await db.EmailAddresses.findAll({ where: { batchId: batchId } })

  //     return res.send({ success: true, message: "Batch Data successFully fetched", data: processedMails })
  //   } catch (ex) {
  //     console.log(ex)
  //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
  //   }
  // }
  async batchRecord(req, res) {
    try {
      const batches = await db.Batches.findAll({})
      if (!batches) return res.status(httpStatus.CONFLICT).send({ success: false, message: "No batch found against specified batch Id" })

      return res.send({ success: true, message: "Batch Data successFully fetched", data: batches })
    } catch (ex) {
      console.log(ex)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: "An error occured on  server side" })
    }
  }

}
module.exports = new Validator() 
