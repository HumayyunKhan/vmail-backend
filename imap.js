const schedule = require("node-schedule")
const { simpleParser } = require('mailparser');
const db = require('./src/db/models')
const { Op } = require("sequelize");
const Imap = require('./lib/Connection');
// const account_records = require("./src/db/models/account_records");
function extractEmailAddress(message) {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = message.match(regex);

    if (matches && matches.length > 0) {
        return matches[0];
    }

    return null; // No email address found
}
function dailyStatsHandler() {

    const job = schedule.scheduleJob('0 0 0 * * *', async () => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const recordCreated = await db.AccountRecords.findOne({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                }
            }
        })
        if (recordCreated) return
        const TestAccounts = await db.TestAccounts.findAll()
        TestAccounts.forEach(async (account) => {
            await db.AccountRecords.create({ accountId: account.id, creditsUsed: 0, active: true })

        });

    })
}
async function statsHandler() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const recordCreated = await db.AccountRecords.findOne({
        where: {  
            createdAt: {
                [Op.between]: [startOfDay, endOfDay],
            }
        }
    })
    if (recordCreated) return
    const TestAccounts = await db.TestAccounts.findAll()
    TestAccounts.forEach(async (account) => {
        await db.AccountRecords.create({ accountId: account.id, creditsUsed: 0, active: true })

    });


}
async function hourlyMailBoxReader() {   
    try { 
        let responseStatus = false;       
        //   const job=schedule.scheduleJob('0 */1 * * *',async()=>{ 
            const job=schedule.scheduleJob('*/15 * * * * *',async()=>{
              const testAccounts = await db.TestAccounts.findAll({where:{deletedAt:null}}) 
            for (const account of testAccounts) {
                // console.log(account)
                let imapConfig = {
                    user: account.email,
                    password: account.password,
                    host: "smtp.gmail.com",
                    port: 993,  
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },

                };
                let uidIndex = 0; 
                // console.log(imapConfig)
                const imap = new Imap(imapConfig);
                let limitedResult = [];
                let Result = 0;
                imap.once('ready', (err) => {
                    console.log(err)
                    imap.openBox('Inbox', false, (err) => {
                        if (err) {
                            console.log("ERROR OCCURED AT OPENING BOX",imapConfig)
                        }
                        imap.search([['UNDELETED'], ['TEXT', 'Address not found']], (err, results) => {
                            console.log('results here: ', results, 'no of mails: ', results.length);
                            // console.log('results here: ', results, 'no of mails: ', results.length,imapConfig);
                            Result = results.lengths;
                            if (results.length > 0) {
                                limitedResult = results;
                                limitedResult.reverse();

                                const fetchOptions = {
                                    bodies: ['TEXT'],
                                };
                                limitedResult.forEach((uid) => {

                                    const mailInstance = imap.fetch(uid, fetchOptions);

                                    mailInstance.on('message', (msg) => {
                                        console.log(msg, 'msg here---------------');
                                        msg.on('body', (stream) => {
                                            simpleParser(stream, async (err, parsed) => {
                                                const {
                                                    from, subject, textAsHtml, text, to, headerLines,
                                                } = parsed;
                                                console.log('parsed..............................', text);
                                                const email = extractEmailAddress(text);
                                                console.log(email);
                                                await db.EmailAddresses.destroy({ where: { email: email } })

                                                await imap.setFlags(uid, '\\Deleted', () => {
                                                    console.log('successfully deleted');
                                                    // imap.end();
                                                });


                                                console.log(limitedResult[uidIndex], '------------uidINDEX HERE');
                                                uidIndex++;
                                                if (uidIndex == limitedResult.length) {
                                                    console.log('Connection ended');

                                                    // imap.destroy();
                                                    responseStatus = true;

                                                }
                                            });
                                        });

                                    });

                                    mailInstance.once('error', (ex) =>{
                                        console.log(ex)
                                    });

                                    mailInstance.once('end', () => {
                                        console.log('Done fetching all messages!');
                                        //   imap.end();
                                    });
                                });

                                if (err) {
                                    console.log(err);
                                }
                            } else {
                                console.log("NO MAIL FOUND")
                                responseStatus = true;
                                imap.destroy();
                            }
                        });
                    });
                });
                
                imap.connect()
                imap.once('error', (err) => {
                    console.log(err)
                    if (!responseStatus) {
                        //   res.send({ success: false, error: err, message: 'An error occured' });
                        console.log("ERROR OCCURED AT OPENING BOX")

                        responseStatus = true;
                    }
                    imap.destroy();
                });
                imap.once('end', async () => {
                    console.log('Connection ended');

                });

                // imap.connect();
            }
        })

    } catch (ex) {
        console.log('an error occurred', ex);
        //   res.send({ success: false, message: 'Error Ocuured', status: 400 });
    }
};



module.exports = { dailyStatsHandler, hourlyMailBoxReader, statsHandler }
