const config = {
    "user"             : "v|~92ojb9mnq$bsjy8zn",
    "password"         : "219qh6Tfl9CZr!MQTzv8",
    "authURL"          : 'https://eds-api.ebscohost.com/authservice/rest/uidauth',
    "sessionURL"       : 'https://eds-api.ebscohost.com/edsapi/rest/createsession',
    "searchURL"        : 'https://eds-api.ebscohost.com/edsapi/rest/Search',
    "corsproxy"        : {
        "url": 'http://synonym.caltech.edu:8090/',
        "headers": {'X-Proxy-Cors': 'true' }
    },
};

module.exports = config;
