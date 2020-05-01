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


// Constants that we may want to adjust at some point in the future.
// ............................................................................

const responseTimeout   = 5 * 1000;       // Wait for 5 sec.
const connectionTimeout = 5 * 1000;       // Wait for 5 sec.


// Main code.
// ............................................................................

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

var net = {
    post: function(url, proxy, data = {}, extra_headers = {}) {
        let headers = { ...{'Content-Type': 'application/json' },
                        ...extra_headers, ...proxy.headers };
        let params = { method: 'post',
                       url: proxy.url + url,
                       headers: headers,
                       timeout: responseTimeout,
                       cancelToken: source.token };
        if (! obj.isEmpty(data))
            params['data'] = data;

        log.debug('>>>> post to', url);
        log.debug('headers: ', headers);
        log.debug('data: ', data);

        setTimeout(() => {
            source.cancel('Connection attempt timed out');
        }, connectionTimeout);

        return axios(params)
            .then(response => {
                log.debug('<<<< post response');
                log.debug(response);
                return response.data;
            })
            .catch(exception => {
                if (axios.isCancel(exception)) {
                    log.warn('connection request cancelled:', exception.message);
                    return exception.message;
                } else if (exception.request) {
                    // The request was made but no response was received.
                    log.error('problem with post to', url);
                    log.error(exception.request);
                    return exception.request;
                } else if (exception.response) {
                    // Request was made and server responded.
                    log.error('problem with response to', url);
                    log.error(exception.response);
                    return exception.response;
                } else {
                    // Something happened.
                    log.error(exception);
                    return 'Network exception';
                }
            });
    },

    interrupt: function(reason) {
        source.cancel(reason);
    },

}

// The end.
// ............................................................................

module.exports = net;
