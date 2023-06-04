const schedule=require("node-schedule")
const db=require('./src/db/models')
const {Op}=require("sequelize");
const account_records = require("./src/db/models/account_records");

function dailyStatsHandler(){

    const job=schedule.scheduleJob('0 0 0 * * *',async()=>{
        const today = new Date(); 
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const recordCreated=await db.AccountRecords.findOne({where:{
            createdAt: {
                [Op.between]: [startOfDay, endOfDay],
            }
        }})
        if(recordCreated)return 
        const TestAccounts=await db.TestAccounts.findAll()
        TestAccounts.forEach(async(account) => {
          await db.AccountRecords.create({accountId:account.id,creditsUsed:0,active:true})
            
        });
 
    })
}

module.exports={dailyStatsHandler}
