const fs = require('fs');
const httpStatus = require('http-status');
const Checker=require("../../helpers/checker")
const {validateEmail:validate,isSyntaxValid}=require("./validation")
require('dotenv').config()
const axios=require("axios")
const csv = require('csv-parser');

class Validator{
  
  async fetchEmailsFromCSV(req,res) {
    try{
    const emails = [];
    const filePath=req.file.path 
    if(!filePath)return res.status(httpStatus.CONFLICT).send({success:false,message:"No file specified"})
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const email = data.email; // Assuming the email column name is 'email'. Modify this if your CSV has a different column name.
        emails.push(email);
      })
      .on('end', () => {
        console.log('Emails:');
        console.log(emails);
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


async validateSingleMail(req,res){
  try{
    const {email}=req.body
    const result =Checker.validateEmail(email)
    if(!result){
      return res.status(httpStatus.OK).send({success:true,data:{email:email,isvalidDomain:false,isSyntaxValid:false,isEmailValid:false}})
    }
    validate(email).then((result) => {

      console.log(email)
      return res.send({success:true,data:{email:email,isvalidDomain:result.validDomain,isSyntaxValid:result.validSyntax,isEmailValid:result.validEmail}})
    })






  }catch(ex){
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({success:false,message:"An error occured on  server side"})
  }
}

}
module.exports=new Validator()