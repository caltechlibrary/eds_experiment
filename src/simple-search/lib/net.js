// ============================================================================
// @file    net.js
// @brief   Network utilities
// @author  Michael Hucka <mhucka@caltech.edu>
// @license Please see the file named LICENSE in the project directory
// @website https://github.com/caltechlibrary/eds_experiment
// ============================================================================

// Imports.
// ............................................................................

// Load other modules if necessary.  If we're loaded from an HTML file in a
// browser, they should be loaded already.
try {
    var log = require('loglevel');
    var obj = require('./obj');
} catch (ex) {}


// Main code.
// ............................................................................

var net = {
    /** Do an HTTP POST to the url, with the data, w/ optional headers. */
    post: function(url, proxy, data = {}, extra_headers = {}) {
        let headers = { ...{'Content-Type': 'application/json' },
                        ...extra_headers, ...proxy.headers };
        let params = { method: 'post',
                       url: proxy.url + url,
                       headers: headers };
        if (! obj.isEmpty(data))
            params['data'] = data;

        log.debug('>>>> post to', url);
        log.debug('headers: ', headers);
        log.debug('data: ', data);

        return axios(params)
            .then(response => {
                log.debug('<<<< post response');
                log.debug(response);
                return response.data;
            })
            .catch(error => {
                if (error.request) {
                    // The request was made but no response was received.
                    log.error('Problem with post to', url);
                    log.error(error.request);
                } else if (error.response) {
                    // Request was made and server responded.
                    log.error('Problem with response to', url);
                    log.error(error.response);
                } else {
                    // Something happened.
                    log.error(error);
                }
                return null;
            });
    },

}

// The end.
// ............................................................................

module.exports = net;
