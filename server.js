const http = require('http');
const {dailyStatsHandler,hourlyMailBoxReader,statsHandler,fileModifier, hourlyMailBoxReaderSpam}=require("./imap")
const address = process.env.LISTEN_ADDRESS || 'localhost';
const { PORT = 4000 } = process.env;
require('dotenv').config()

const app = require('./app');
dailyStatsHandler();
// fileModifier()
hourlyMailBoxReader() 
hourlyMailBoxReaderSpam
statsHandler()
const server = http.createServer(app);

server.listen(PORT, () => console.log(`===> listening on http://${address}:${PORT}/`));
 