
const multer = require('multer');
const Upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory where files should be stored
      },
      filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`; // Generate a unique filename
        cb(null, fileName);
      },
 
    }),
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(csv)$/)) {
        cb(null, true); // Accept the file
      } else {
        cb(new Error('Only CSV files are allowed.'), false); // Reject the file
      }
    },  
  });
  module.exports={Upload}