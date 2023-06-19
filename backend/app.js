const express = require('express');
const Router = require('express');
const bodyParser = require('body-parser');
const api = require('./api')
const app = express();
const router = Router();
const cors = require('cors')

app.use(cors())

// app.use();
// app.use(api.routes());

app.set('x-powered-by', false);
app.set('etag', false);
app.use(express.json());
app.set('trust proxy', 2);
app.set('json spaces', 2);

const bodySizeLimit = '200 kb';
app.use(bodyParser.json({ limit: bodySizeLimit }));
app.use(bodyParser.urlencoded({ limit: bodySizeLimit, extended: true }));

// use diff routers
// use api
router.use('/', api);

app.use(function serveAllRoutes(req, res, next) {
    router(req, res, next);
});


module.exports = app;