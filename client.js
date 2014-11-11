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
 * This is a simple Single-Page Web application that accesses some protected resources on a REST server.
 */

var http = require('http');
// http-sync is a library for synchronous HTTP requests
var httpSync = require('http-sync-win');

function getEmail(access_token) {
    var request = httpSync.request({
        method: 'GET',
        headers: {"Authorization": "Bearer " + access_token},
        body: '',

        protocol: 'http',
        host: 'localhost',
        port: 3001,
        path: '/email'
    });
    var result = request.end();

    return result.body.toString();
}

http.createServer(function (req, res) {
    if (req.url === "/login") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        //TODO: ask registry about possible providers and generate a list
        res.end(JSON.stringify(providers));
    } else if (req.url.indexOf("/redirect") > -1) {
        var access_token = req.url.split("=")[1];
        var email = getEmail(access_token);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Hello World, this is the Web client.</h1><div>Your email address is: ' + email + '</div></body></html>');
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Hello World, this is the Web client.</h1>Click <a href=\"http://localhost:3002/login\">here</a> to login.</body></html>');
    }
}).listen(3003);

console.log('Server running on port 3003.');