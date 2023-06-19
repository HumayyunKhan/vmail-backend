const { Joi } = require('express-validation');

const paramValidation = {
 
  userInfo: {
    body: Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      port: Joi.number().optional(),
      domain: Joi.string().optional(),
    }),
    params:Joi.object({
      id:Joi.number().optional()
    })
  },
  id: {
    params: Joi.object({

      id: Joi.number().required(),
    }),
  },

};

module.exports = paramValidation;
