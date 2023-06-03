const validator = require('email-validator');
const emailExistence = require('email-existence');
const dns = require('dns');

function isValidDomain(domain) {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        // Error occurred during DNS lookup
        reject(err);
      } else {
        // Check if MX records exist
        resolve(addresses && addresses.length > 0);
      }
    });
  });
}
function isSyntaxValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Usage example
const domain = 'wego.com';

isValidDomain(domain)
  .then((isValid,err) => {
    if (isValid) {
      console.log(`${domain} is a valid domain.`);
    } else {
      console.log(`${domain} is not a valid domain.`);
    }
    console.log(err)
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

// Usage example
// const email = 'example@example.com';
// validateEmail(email)
//   .then((result) => {
//     console.log('Email syntax is valid:', result.validSyntax);
//     console.log('Domain is active:', result.validDomain);
//     console.log('Email is active:', result.validEmail);
//   })
//   .catch((err) => {
//     console.error('An error occurred:', err);
//   });
module.exports={isValidDomain,isSyntaxValid}