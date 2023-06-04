const fs = require('fs');
const httpStatus = require('http-status');
const {mailer}=require("../../helpers/mailer")
const db=require('../../db/models')
const {validateEmail:validate,isSyntaxValid,isValidDomain}=require("./validation")
require('dotenv').config()
const axios=require("axios")
const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');


class Validator{
  
  async fetchEmailsFromCSV(req,res) {
    try{
      const batchId=uuidv4()
    const emails = [];
    const addresses = [];
    const filePath=req.file.path 
    if(!filePath)return res.status(httpStatus.CONFLICT).send({success:false,message:"No file specified"})

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const email = data.email; // Assuming the email column name is 'email'. Modify this if your CSV has a different column name.
        emails.push({batchId,email});
        addresses.push(email);
      })
      .on('end', async() => {
        
      const newBatch=await db.Batches.create({batchId})
      const newBatchRecords=await db.EmailAddresses.bulkCreate(emails)
      const fakelist=['pawa@gmail.com',"lawa@gmail.com","pawa@devblends.com","pawa@techmania.pk"]
      // mailer(addresses)
      
        // console.log('Emails BATCH',newBatch);
        // console.log('Emails BATCH',newBatchRecords);
        return res.send({message:"Your file has been successfully uploaded",data:{batchId}})

        // console.log(emails);
      })
      .on('error', (error) => {
        console.error('An error occurred while reading the CSV file:', error);
      });

  }catch(ex){
return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({message:"emails processed successfully",success:false})
  }

}


 async readEmailsFromCSV(req,res) {
  try{
    const {email}=req.body
    axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`)
        .then(response => {
            console.log(response.data);
            return res.send({response:JSON.stringify(response.data ),success:true})
        })
        .catch(error => {
            console.log(error);
            return res.send({error})
        });
  

}catch(ex){
  console.log(ex)
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({success:false,message:"An error occured on server side"})
}
}


async checkStatus(req,res){
  try{
    const {batchId}=req.body
    const batchExist=await db.Batches.findOne({where:{batchId}})
    if(!batchExist)return resource.status(httpStatus.CONFLICT).send({success:false,message:"No batch found against specified batch Id"})
    return res.send({success:true,message:"Batch status successFully fetched",status:batchExist.status})
  }catch(ex){
    console.log(ex)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({success:false,message:"An error occured on  server side"})
  }
}
async processedData(req,res){
  try{
    const {batchId}=req.body
    const batchExist=await db.Batches.findOne({where:{batchId}})
    if(!batchExist)return res.status(httpStatus.CONFLICT).send({success:false,message:"No batch found against specified batch Id"})
    if(batchExist.status!='FINALIZED')return res.status(404).send({success:false,message:"Your batch hasn't been finalized yet"})
    const processedMails=await db.EmailAddresses.findAll({where:{batchId:batchId}})

    return res.send({success:true,message:"Batch Data successFully fetched",data:processedMails})
  }catch(ex){
    console.log(ex)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({success:false,message:"An error occured on  server side"})
  }
}

}
module.exports=new Validator() 