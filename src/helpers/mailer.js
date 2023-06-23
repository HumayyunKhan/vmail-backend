const nodemailer = require('nodemailer');
const schedule = require('node-schedule')
const db = require("../db/models")
const { Op } = require("sequelize");

//-----------------------------
async function mailer(addresses) {
    try {
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
                    }, creditsUsed: { [Op.lt]: 400 },deletedAt:null
                }, include: { model: db.TestAccounts, attribute: ['email', 'password', 'domain', 'port'] }
            })
if(!sender){
    console.log("NO ACCOUND AVAILABLE")
}
console.log(sender)
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


            let creditsLeft = 400 - sender.creditsUsed;

            // Determine the number of emails to send in this batch
            const emailsToSend = Math.min(creditsLeft, batchAddresses.length);
            await db.AccountRecords.update(
                { creditsUsed: await db.sequelize.literal(`credits_used + ${emailsToSend}`) }, { where: { id: sender.id } }
            )
            if (creditsLeft < batchAddresses.length) {
                let extraRecepients = batchAddresses.slice(creditsLeft, batchAddresses.length)
                console.log("------------------------------XTRA RECEPIENTS-------------------------")
                console.log("------------------------------", extraRecepients, "-------------------------")
                mailer(extraRecepients)
            }

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

            // Deduct credit for each email sent

            // Check if the credits are exhausted
        }

        console.log("All emails sent successfully.");
    } catch (ex) {
        console.log(ex)

    }
}




module.exports = { mailer }