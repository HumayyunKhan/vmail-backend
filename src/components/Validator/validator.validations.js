const { Joi } = require('express-validation');

const paramValidation = {
 
  userInfo: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  },

};

module.exports = paramValidation;
