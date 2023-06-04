const nodemailer = require('nodemailer');
const schedule = require('node-schedule')
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


// async function mailer(addresses) {
// console.log(addresses.length,"----------------------------------")
//                     const mailOptions = {
//                         from: "yotamball846d@gmail.com",
//                         to: addresses,
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

//                     // console.log(sender)









// }
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
//                         host: "smtp.gmail.com",
//                         port: 465,
//                         secure: true, 
//                         maxConnections: 11,
//                         maxMessages: Infinity,

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


//-----------------------------
async function mailer(addresses) {
    const batchSize = 100;
    const numAddresses = addresses.length;
    const numBatches = Math.ceil(numAddresses / batchSize);

    for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
        const recipient = []
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min((batchIndex + 1) * batchSize, numAddresses);
        const batchAddresses = addresses.slice(startIndex, endIndex);
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const sender = await db.AccountRecords.findOne({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                }, creditsUsed: { [Op.lt]: 500 }
            }, include: { model: db.TestAccounts, attribute: ['email', 'password', 'domain', 'port'] }
        })

        const transporter = nodemailer.createTransport({
            pool: true,
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            maxConnections: 11,
            maxMessages: Infinity,

            auth: {
                user: sender.TestAccount.email,
                pass: sender.TestAccount.password
            }
        });


        let creditsLeft = 500-sender.creditsUsed;

        // Determine the number of emails to send in this batch
        const emailsToSend = Math.min(creditsLeft, batchAddresses.length);

        // Send emails
        for (let i = 0; i < emailsToSend; i++) {
            recipient.push(batchAddresses[i])

        }
        const mailOptions = {
            from: sender.TestAccount.email,
            to: recipient,
            subject: 'Greetings',
            text: 'This is a test email sent from a burner email account.'
        };
        console.log("-------------------------", mailOptions, "-----------------------------")
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        await db.AccountRecords.update(
            { creditsUsed: await db.sequelize.literal(`credits_used + ${emailsToSend}`) }, { where: { id: sender.id } }
        )

        // Deduct credit for each email sent

        // Check if the credits are exhausted
    }

    console.log("All emails sent successfully.");
}




module.exports = { mailer }