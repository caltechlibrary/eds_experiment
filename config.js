const config = {
    "user"             : "",
    "password"         : "",
    "authURL"          : 'https://eds-api.ebscohost.com/authservice/rest/uidauth',
    "sessionURL"       : 'https://eds-api.ebscohost.com/edsapi/rest/createsession',
    "searchURL"        : 'https://eds-api.ebscohost.com/edsapi/rest/Search',
    "corsproxy"        : {
        "url": '',
        "headers": { }
    },
};

module.exports = config;
