/**
 * Code contributed to the Learning Layers project
 * http://www.learning-layers.eu
 * Development is partly funded by the FP7 Programme of the European Commission under
 * Grant Agreement FP7-ICT-318209.
 * Copyright (c) 2014, RWTH Aachen University
 * For a list of contributors see the AUTHORS file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This is a simple WebConnector that handles showing different buttons for all possible authentication providers.
 */

var http = require('http');
// http-sync is a library for synchronous HTTP requests
var httpSync = require('http-sync-win');

function getProviders() {
    var request = httpSync.request({
        method: 'GET',
        headers: {},

        protocol: 'http',
        host: 'localhost',
        port: 3000,
        path: '/providers'
    });
    var result = request.end();
    var providers = JSON.parse(result.body.toString());

    return providers;
}

function getTokens(code) {
    var config = require("./config.json");
    var authentication = new Buffer(config.client_id + ":" + config.client_secret).toString('base64');

    var request = httpSync.request({
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded', "Authorization":"Basic " + authentication},
        body: "grant_type=authorization_code&code=" + code + "&redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fredirect",

        protocol: 'https',
        host: 'api.learning-layers.eu',
        port: 443,
        path: '/o/oauth2/token'
    });

    var result = request.end();
    var tokens = JSON.parse(result.body.toString());

    return tokens;
}

http.createServer(function (req, res) {
    if (req.url === "/login") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var response = "<html><body>";

        // now ask registry about possible providers and generate a list
        var providers = getProviders();

        providers.forEach(function (item) {
            response += "<div><a href=\"/authenticate?provider=" + item.name + "\">" + item.name + "</a></div><br />";
        });

        response += "</body></html>";

        res.end(response);
    } else if (req.url.indexOf("/authenticate") > -1) {
        var provider = req.url.split("=")[1];
        var providers = getProviders();
        var endpoint;
        providers.forEach(function (item) {
            if (item.name === provider) {
                endpoint = item.endpoint;
            }
        });

        res.writeHead(302, {'Location':endpoint});
        res.end();
    } else if (req.url.indexOf("/redirect") > -1) {
        // parse out code and get an access_token for it, then pass on to client
        var arguments = req.url.split("?")[1].split("&");
        var code = arguments[0].split("=")[1];

        // now ask token endpoint
        var tokens = getTokens(code);

        var access_token = tokens["access_token"];

        // now redirect back to client
        var redirect_uri = "http://localhost:3003/redirect?access_token=" + access_token;
        res.writeHead(302, {'Location':redirect_uri});
        res.end();
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Hello World, this is the WebConnector.</h1></body></html>');
    }
}).listen(3002);

console.log('Server running on port 3002.');