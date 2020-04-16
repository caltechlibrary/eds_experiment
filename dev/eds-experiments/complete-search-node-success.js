
// Package requirements.
// .............................................................................

const axios = require('axios');


// Local functions.
// .............................................................................

function getAuthToken(authEndpoint) {
    return axios.post(authEndpoint)
        .then(response => response.data)
        .then(data => data.AuthToken)
        .catch(error => { console.log(error); });
}

function getSessionToken(sessionEndpoint, authToken) {
    let headers = {'x-authenticationToken': authToken,
                   'Content-Type': 'application/json' };
    let body    = {'Profile': 'edsapi'};
    let request = { method: 'post',
                    url: sessionEndpoint,
                    headers: headers,
                    data: body };
    return axios(request)
        .then(response => response.data)
        .then(data => data.SessionToken)
        .catch(error => { console.log(error); });
}

function search(authToken, sessionToken, searchURL) {
    let headers = {'x-authenticationToken': authToken,
                   'x-sessionToken': sessionToken,
                   'Content-Type': 'application/json' };
    let body = {
        "SearchCriteria": {
            "Queries":[ { "Term":"Pandemic" } ],
            "SearchMode": "all",
            "IncludeFacets": "y",
            "Sort": "relevance",
            "AutoSuggest": "n",
            "AutoCorrect": "n"
        },
        "RetrievalCriteria": {
            "View": "brief",
            "ResultsPerPage": 20,
            "PageNumber": 1,
            "Highlight": "y",
            "IncludeImageQuickView": "n"
        },
        "Actions": null
    };
    let request = { method: 'post',
                    url: searchURL,
                    headers: headers,
                    data: body };
    return axios(request)
        .then(response => response.data)
        .then(data => data.SearchResult)
        .catch(error => { console.log(error); });
}


// Main code.
// .............................................................................

// let x;
// getAuthToken(config.authEndpoint, config.user, config.password)
//     .then(token => { x = token; console.log('1st: ' + x); return token; })
//     .then(value => console.log('2nd: ' + value));


const authURL    = 'https://eds-api.ebscohost.com/authservice/rest/ipauth';
const sessionURL = 'https://eds-api.ebscohost.com/edsapi/rest/createsession';
const searchURL  = 'https://eds-api.ebscohost.com/edsapi/rest/Search';

async function main() {
    let authToken = await getAuthToken(authURL);
    let sessionToken = await getSessionToken(sessionURL, authToken);
    let results = await search(authToken, sessionToken, searchURL);
    console.log(results.Data.Records[6].Header);
}

main();
