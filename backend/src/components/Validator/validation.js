const dns = require('dns');
const fs = require('fs');
const csv = require('csv-parser');
const stringify = require('csv-writer').createObjectCsvStringifier;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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

function setValidStatus(csvFilePath,addresses, callback) {
  const rows = [];

  // Read the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', () => {
      const hasIsValidColumn = Object.keys(rows[0]).includes('isValid');

      // Add 'isValid' column if it doesn't exist
      // if (!hasIsValidColumn) {
        rows.forEach((row) => {
            if(addresses.includes(row.email))row.isValid = false;
            else row.isValid = true;    
        });

        // Write the modified rows back to the existing CSV file
        const csvStringifier = stringify({ header: Object.keys(rows[0]) });
        const csvWriter = createCsvWriter({
          path: csvFilePath,
          header: Object.keys(rows[0]).map((key) => ({ id: key, title: key })),
        });

        csvWriter.writeRecords(rows).then(() => {
          callback();
        });
      // } else {
      //   callback();
      // }
    });
}
// Example usage
// addIsValidColumnToCSV('./myFile0.csv', () => {
//   console.log('CSV file modified successfully.');
// });
module.exports = { isValidDomain, isSyntaxValid,setValidStatus}