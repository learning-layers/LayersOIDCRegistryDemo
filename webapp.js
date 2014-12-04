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
 * This is a simple RESTful Web application that has some protected resource.
 */

var http = require('http');
// http-sync is a library for synchronous HTTP requests
var httpSync = require('http-sync-win');

function getUserinfo(access_token) {
    var request = httpSync.request({
        method: 'GET',
        headers: {"Authorization": "Bearer " + access_token, "Accept": "application/json"},

        protocol: 'https',
        host: 'api.learning-layers.eu',
        port: 443,
        path: '/o/oauth2/userinfo'
    });
    var result = request.end();

    return JSON.parse(result.body.toString());
}

http.createServer(function (req, res) {
    if (req.url === "/email") {
        var access_token = req.headers["authorization"].split(" ")[1];
        var userinfo = getUserinfo(access_token);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(userinfo.email);
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Hello World, this is the Web application.</h1></body></html>');
    }
}).listen(3001);

console.log('Server running on port 3001.');