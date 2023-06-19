const { Joi } = require('express-validation');
const dotenv =require("dotenv")
dotenv.config();
// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(4040),

  DB_HOST: Joi.string().required().description('Database host is required'),
  DB_PORT: Joi.number().default(3306).description('Database port is required'),
  DB_USERNAME: Joi.string()
    .required()
    .description('Database username is required'),
  DB_PASSWORD: Joi.string().allow(''),
  DB_NAME: Joi.string().required().description('Database name is required'),
  DB_DIALECT: Joi.string()
    .default('mysql')
    .description('Database dialect is required'),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    dialect: envVars.DB_DIALECT,
  }

};

module.exports = config;
