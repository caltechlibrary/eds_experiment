const normal_style = 'color: DarkBlue; background-color: #ddd';
const error_style  = 'color: FireBrick; background-color: #ddd';

const debugLog   = true;                // Print to the console?
const debugBreak = false;               // Go into debugger on errors?


var net = {
    /** Do an HTTP POST to the url, with the body, w/ optional headers. */
    post: function(url, proxy, body, extra_headers = {}) {
        let headers = Object.assign({'Content-Type': 'application/json' },
                                    extra_headers, proxy.headers);
        let request = { method: 'post',
                        url: proxy.url + url,
                        headers: headers,
                        data: body };

        if (debugLog) {
            console.group('%c%s', normal_style, '>>>> post to "' + url + '"');
            console.log('Headers:'); console.table(headers);
            console.log('Body:'); console.table(body);
            console.groupEnd();
        };

        return axios(request)
            .then(response => {
                if (debugLog) {
                    console.group('%c%s', normal_style, '<<<< post response');
                    console.log(response);
                    console.groupEnd();
                };                 
                return response.data;
            })
            .catch(error => {
                if (error.request) {
                    // The request was made but no response was received.
                    console.group('%c%s', error_style,
                                  'Problem with post to "' + url + '"');
                    console.log(error.request);
                    console.groupEnd();
                } else if (error.response) {
                    // Request was made and server responded.
                    console.group('%c%s', error_style,
                                  'Problem with response to "' + url + '"');
                    console.log(error.response);
                    console.groupEnd();
                } else {
                    // Something happened.
                    console.log(error);
                }
                if (debugBreak) debugger;
                return null;
            });
    },

}
module.exports = net;
