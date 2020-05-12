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
const connectionTimeout = 10 * 1000;      // Wait for 10 sec.


// Main code.
// ............................................................................

// IMHO, the cancellation scheme in Axios is difficult to understand, so here
// is a verbose explanation of what's happening below.  A key point to
// understand is that you must create a separate CancelToken object for each
// axios network call, and not simply create one token and keep reusing it.
// Otherwise, all calls will end up sharing the same cancellation token --
// which means the first cancellation will pre-cancel all subsequent network
// calls :-(.  A second point to keep in mind is that in order to be able to
// manipulate the cancellation token from outside of the axios call (for
// example, to perform a cancellation via a timeout), we have to store the
// token in an external (to the axios call) variable.  A final and subtle
// point (don't you just love all this?) is that the CancelToken.source()
// method returns an object that has two properties: "token" and "cancel".
// The token is what is passed to the axios network call, and "cancel" is
// actually a function that takes one argument, a text string.  You call this
// function to perform the cancellation.
//
// So, below, the variable "cancelSource" is used to store a fresh
// CancelToken.source() object every time our post(...) function is called.
// The token from this object is passed to the axios network call, and then
// in our interrupt(...) function later below, that's when we call the
// cancel(...) method with a message about the reason for the cancellation.

let cancelSource;

var net = {
    post: function(url, proxy, data = {}, extra_headers = {}) {
        cancelSource = new axios.CancelToken.source();
        let headers = { ...{'Content-Type': 'application/json' },
                        ...extra_headers, ...proxy.headers };
        let params = { method: 'post',
                       url: proxy.url + url,
                       headers: headers,
                       timeout: responseTimeout,
                       cancelToken: cancelSource.token
                     };
        if (! obj.isEmpty(data))
            params['data'] = data;

        let timeout = setTimeout(() => {
            log.debug('connectionTimeout reached');
            this.interrupt('Connection attempt timed out');
        }, connectionTimeout);

        log.debug('>>>> post to', url);
        log.debug('headers: ', headers);
        log.debug('data: ', data);

        return axios(params)
            .then(response => {
                log.debug('<<<< post response');
                log.debug(response);
                clearTimeout(timeout);
                return response.data;
            })
            .catch(exception => {
                let returnValue;
                if (axios.isCancel(exception)) {
                    log.warn('connection request cancelled:', exception.message);
                    returnValue = exception.message;
                } else if (exception.request) {
                    // The request was made but no response was received.
                    log.error('problem with post to', url);
                    log.error(exception.request);
                    returnValue =  exception.request;
                } else if (exception.response) {
                    // Request was made and server responded.
                    log.error('problem with response to', url);
                    log.error(exception.response);
                    returnValue =  exception.response;
                } else {
                    // Something happened.
                    log.error(exception);
                    returnValue =  'Network exception';
                }
                clearTimeout(timeout);
                return returnValue;
            });
    },

    interrupt: function(reason) {
        log.debug('issuing interrupt:', reason);
        cancelSource.cancel(reason);
    },

}

module.exports = net;

// The end.
// ............................................................................

log.debug('loaded net.js');
