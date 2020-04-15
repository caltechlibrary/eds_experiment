const config = require('./config.js');
const fetch = require('node-fetch');

let authenticationEndpoint = 'https://eds-api.ebscohost.com/authservice/rest/uidauth';
let body = JSON.stringify({ "UserId": config.user, "Password": config.password });
let headers = {'Content-Type': 'application/json',
               'Content-Length': body.length };

let params = {
    method: 'POST',
    headers: headers,
    body: body,
}

console.log('fetching:');
fetch(authenticationEndpoint, params)
    .then((response) => {
        return response.text();
    })
    .then((text) => {
        console.log(text);
    })
    .catch(err => {
        console.log(err);
    })
