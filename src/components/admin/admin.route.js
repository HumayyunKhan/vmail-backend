const express = require('express');
const { validate, ValidationError, Joi } = require('express-validation');
const admin = require('./admin.controller');
const { userInfo } = require('./admin.validation');
const router = express.Router(); // eslint-disable-line new-cap

router.post('/registerAccount',validate(userInfo), admin.register);

router.get('/getAccounts', admin.displayAccounts);

router.use(async function (err, req, res, next) {
    // console.log(req)
    console.log(err)
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
  
    return res.status(500).json(err)
  })

module.exports = router;
