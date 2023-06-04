const nodemailer = require('nodemailer');
const schedule=require('node-schedule')
const db = require("../db/models")
const { Op } = require("sequelize");
// Create a transporter object with burner email account credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'yotamball846d@gmail.com',
        pass: 'gtnracznomujluhu'
    }
});

// Send an email from the burner email account to a dummy email account


async function mailer(addresses) {
console.log(addresses.length,"----------------------------------")
                    const mailOptions = {
                        from: "yotamball846d@gmail.com",
                        to: addresses,
                        subject: 'Greetings',
                        text: 'This is a test email sent from a burner email account.'
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error:', error);
                        } else {
                            console.log('Email sent:', info.response);
                        }
                    });
                    
                    // console.log(sender)
                    
                
            






}
// async function mailer(addresses) {
//     const today = new Date();
// let senderId=null
//     const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
// let count=-1
//     const job=schedule.scheduleJob('* * * * * * ',async()=>{

//             // console.log(address,"----------")
            
            
//             const sender = await db.AccountRecords.findOne({
//                 where: {
//                     createdAt: {
//                         [Op.between]: [startOfDay, endOfDay],
//                     }, creditsUsed: { [Op.lt]: 500 }
//                 }, include: { model: db.TestAccounts, attribute: ['email', 'password', 'domain', 'port'] }
//             })
    
//             if (sender) {
//                 count++
//                 if(count==addresses.length)job.cancel()
//                 await db.AccountRecords.update(
//                     { creditsUsed:await db.sequelize.literal('credits_used + 1') },{where:{id:sender.id}}
//                     )
    
//                     const transporter = nodemailer.createTransport({
//                         pool: true,
//                         host: 'smtp.gmail.com',
//                         port: 587,
//                         maxConnections: 11,
//                         auth: {
//                             user: sender.TestAccount.email,
//                             pass: sender.TestAccount.password
//                         }
//                     });
//                     const mailOptions = {
//                         from: sender.TestAccount.email,
//                         to: addresses[count],
//                         subject: 'Greetings',
//                         text: 'This is a test email sent from a burner email account.'
//                     };
//                     transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                             console.log('Error:', error);
//                         } else {
//                             console.log('Email sent:', info.response);
//                         }
//                     });
                    
//                     console.log(sender)
                    
//                 }
            
//     })





// }


    
module.exports = { mailer }