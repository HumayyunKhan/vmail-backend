const { Joi } = require('express-validation');

const paramValidation = {
 
  userInfo: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      smtpPort: Joi.number().required(),
      domain: Joi.string().required(),
    }),
  },

};

module.exports = paramValidation;
