var http        = require('http');

http.globalAgent.options.rejectUnauthorized = false

const proxy_config = {
    client_host : process.env.REACT_CLIENT_HOST ,
    client_port : process.env.REACT_CLIENT_PORT
}
const set_proxy_host = (host) => proxy_config.client_host = host

const proxy_request = (client_req, client_res, next)=>{

    const host = proxy_config.client_host
    const port = proxy_config.client_port

    if (!(host && port)) {
        console.log('[proxy_request] Error client_host or client_port not set')
        next()
    }
    console.log(`Proxied request for ${client_req.url} to https://${host}:${port}`)

    var options = {
        hostname: host              ,
        port    : port              ,
        path    : client_req.url    ,
        method  : client_req.method ,
        headers : client_req.headers
    };

    const proxy = http.request(options, function (res) {
        client_res.writeHead(res.statusCode, res.headers)
        res.pipe(client_res, {
            end: true
        });
    });

    client_req.pipe(proxy, {
        end: true
    });
}

module.exports = {proxy_request, set_proxy_host}
