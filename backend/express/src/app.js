var express                   = require('express');
var Server                    = require('./api');

const app = express()
const server = new Server(app) .setup_server()
    .setup_routes()
    .start()

module.exports = server