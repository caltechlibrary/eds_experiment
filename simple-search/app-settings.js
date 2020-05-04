const config = {
    // For UID-based authentication, fill out user & password.
    "user"             : "",
    "password"         : "",

    // If using a CORS proxy, fill out the values below.
    "corsproxy"        : {
        "url": 'https://synonym.caltech.edu:8090/',
        "headers": {'X-Proxy-Cors': 'true' }
    },

    // The remaining values should not need changing.
    "UIDauthURL"       : 'https://eds-api.ebscohost.com/authservice/rest/uidauth',
    "IPauthURL"        : 'https://eds-api.ebscohost.com/authservice/rest/ipauth',
    "sessionURL"       : 'https://eds-api.ebscohost.com/edsapi/rest/createsession',
    "searchURL"        : 'https://eds-api.ebscohost.com/edsapi/rest/Search',
};

module.exports = config;
