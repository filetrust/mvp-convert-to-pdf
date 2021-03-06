const bodyParser        = require('body-parser')
const cors              = require("cors");
const https             = require("https");
const fs                = require('fs');
var express             = require('express');
const engine            = require('./pdf-engine/engine')
const {proxy_request}   = require('./utils/proxy_request'   )
const env               = require('dotenv').config()

class Server {
    constructor(app) {
        this.app                = app
        this.default_port       = 4443
        this.default_message    = { info: 'PDF Converter API (v0.0.1)' }
    }

    setup_server() {
        this.app.set('sslPort', process.env.PORT || this.default_port);
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '30mb'}))
        this.app.use(bodyParser.urlencoded({extended: true}))
        return this
    }

    add_logging_route() {
        this.app.use(function(req, res, next) {
            console.log('URL:', req.url)
            next()
        })
    }

    setup_routes() {
        this.add_logging_route()
        this.add_error_handling_route()
        this.app.get ('/api', (request, response) => { response.json(this.default_message)}    )
        this.app.post('/convert'              , engine.convert)
        this.app.post('/convert_to_img'       , engine.convert_to_img)
        this.setup_client_ui_routes()
        return this
    }

    add_error_handling_route() {
        this.app.use(function (req, res, next) {
            process.once('unhandledRejection', function(reason, p) {
				console.log('************************* -> Unhandled Promise Rejection <- *************************')
                console.log(reason)
                console.log('************************* <- Unhandled Promise Rejection >- *************************')
                if(!res.headersSent ) {
                    res.status(500)
                    res.send('Sorry an error has occured');
                }
                else {
                    res.end()
                }
                next(reason);
            });
            next();
        });
    }

    setup_client_ui_routes() {
        this.app.get ('/*', proxy_request)
    }

    start() {
        const certificateName   = process.env.CERTIFICATE_NAME;
        var privateKey          = fs.readFileSync(`./src/certs/${certificateName}.key`);
        var certificate         = fs.readFileSync(`./src/certs/${certificateName}.crt`);
        var credentials         = {key: privateKey, cert: certificate};
        const port              = this.app.get('sslPort')
        this.server             = https.createServer(credentials, this.app).listen(port, function() {
            console.log('Express HTTPS server listening on port ' + port);
        });
        return this
    }

    stop() {
        this.server.close()
    }
}


module.exports = Server;
