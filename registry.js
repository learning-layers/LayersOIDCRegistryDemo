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
 * This is a simple Registry mockup that outputs all possible authentication providers for this Layers Box instance.
 */

var http = require('http');

// the list of providers
var providersList = [
    {name:"Layers", logo:"http://learning-layers.eu/wp-content/themes/learninglayers/images/logo.png", endpoint:"https://api.learning-layers.eu/o/oauth2/authorize?response_type=code&client_id=0734bbed-2aa2-43ce-812e-200ae2ce2da7&redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fredirect&scope=openid+email+profile&state=bla&nonce=blubb"},
    {name:"Google", logo:"https://www.google.de/images/srpr/logo8w.png", endpoint:"https://plus.google.com/o/oauth2/authorize"}
];

http.createServer(function (req, res) {
    if (req.url === "/providers") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(providersList));
    } else if (req.url.indexOf("/providers/") > -1) {
        var providerName = req.url.split("/")[2];
        var result = {};
        providersList.forEach(function(item) {
            if (item.name === providerName) {
                result = item;
            }
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Hello World, this is the Registry.</h1></body></html>');
    }
}).listen(3000);

console.log('Server running on port 3000.');
