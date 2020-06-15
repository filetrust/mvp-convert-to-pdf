const bodyParser        = require('body-parser')
const cors              = require("cors");
const https             = require("https");
const fs                = require('fs');
const engine            = require('./pdf-engine/engine')

class Server {
    constructor(app) {
        this.app                = app
        this.default_port   = 4443
        this.default_message    = { info: 'PDF Converter API (v0.0.1)' }
    }

    setup_server() {
        this.app.set('sslPort', process.env.PORT || this.default_port);
        this.app.use(cors());
        this.app.use(bodyParser.json())
        return this
    }

    setup_routes() {
        this.app.post('/convert' , engine.convert)
        return this
    }

    add_error_handling_route() {
        this.app.use(function (req, res, next) {
            process.once('unhandledRejection', function(reason, p) {
                console.log('************************ unhandledRejection ******************')
                console.log(reason)
                console.log('^^^^^^^^^^^^^^^^^^^^^^^^ unhandledRejection ^^^^^^^^^^^^^^^^^^')
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

    start() {
        const certificateName = process.env.CERTIFICATE_NAME;
        var privateKey   = fs.readFileSync(`./src/certs/${certificateName}.key`);
        var certificate  = fs.readFileSync(`./src/certs/${certificateName}.crt`);
        var credentials  = {key: privateKey, cert: certificate};
        const ssl_port = this.app.get('sslPort')
        this.server = https.createServer(credentials, this.app).listen(ssl_port, function() {
            console.log('Express HTTPS server listening on port ' + ssl_port);
        });
        return this
    }
    stop() {
        this.server.close()
    }
}

module.exports = Server;
