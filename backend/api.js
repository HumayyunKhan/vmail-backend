const Router = require('express');
const api = Router();
const { Request, Response } = require('express');
const adminRouter =require("./src/components/admin/admin.route")
const validatorRouter =require("./src/components/Validator/validator.routes")
require('dotenv').config()
const db = require('./src/db/models');
function nocache(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Expires', '0');
  res.header('Pragma', 'no-cache');
  return next();
}

// todo: implement CORS
// api.get('*', cors());

api.get('/', function(req, res) {
  return res.json({ message: 'hello world ⚡️'});
});

api.use('/admin', adminRouter);
api.use('/validate', validatorRouter);


module.exports = api;