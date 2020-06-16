var express                   = require('express');
var Server                    = require('./Server');

const app = express()
const server = new Server(app) .setup_server()
    .setup_routes()
    .start()

module.exports = server