const express=require('express')
const router=express.Router()
const Validator=require("./validator.contoller")
const { validate, ValidationError, Joi } = require('express-validation');
const {Upload:upload}=require("../../helpers/upload")

router.post('/bulkValidate',upload.single('file'),(req,res)=>{
    Validator.fetchEmailsFromCSV(req,res)

})   
router.post('/checkStatus', Validator.checkStatus)   
router.post('/result',(req,res)=>{
    Validator.processedData(req,res)             
 
})   
router.get('/getBatches',(req,res)=>{
    Validator.batchRecord(req,res)
 
})   
router.post('/getDiscardedMails',(req,res)=>{
    Validator.getDiscardedMails(req,res)
 
})   


router.use(function (err, req, res, next) {
    console.log(err)
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
    return res.status(500).json({ error: err.message })
  })

module.exports=router