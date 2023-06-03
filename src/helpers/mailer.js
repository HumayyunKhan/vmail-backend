const nodemailer = require('nodemailer');
const burnerEmailProviders = require('burner-email-providers');

// Create a transporter object with burner email account credentials
async function mailer(addresses){
const addressLength=addresses.length




}
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'eolabrian9655@gmail.com',
        pass: 'onrwvwvxflixmjvd'
    }
});

// Send an email from the burner email account to a dummy email account

  const mailOptions = {
    from: 'eolabrian9655@gmail.com',
    to: 'sherykhan78687@gmail.com',
    subject: 'Test  for gmail',
    text: 'This is a test email sent from a burner email account.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });