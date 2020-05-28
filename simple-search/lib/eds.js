// ============================================================================
// @file    eds.js
// @brief   JavaScript functions for working with EDS search results
// @author  Michael Hucka <mhucka@caltech.edu>
// @license Please see the file named LICENSE in the project directory
// @website https://github.com/caltechlibrary/eds_experiment
// ============================================================================

// Imports.
// ............................................................................

// Load other modules if necessary.  If we're loaded from an HTML file in a
// browser, they should be loaded already.
try {
    var log = require('he');
    var log = require('loglevel');

    var obj = require('./log');
    var obj = require('./net');
    var obj = require('./obj');
    var obj = require('./string');
} catch (ex) {}


// Main code.
// ............................................................................

const replacements = [
    // Outright removals.
    [/<relatesto.*?>(.+?)<\/relatesto>/i, ''],
    [/<superscript>(.+?)<\/superscript>/i, ''],
    [/<br ?\/?>/gi,      ' '],

    // Simple translations.
    [/<highlight>/i,    '<span class="highlight">'],
    [/<\/highlight>/i,  '</span>'],
    [/<title/i,         '<h2'],
    [/<\/title/i,       '</h2'],
    [/<hd/i,            '<h3'],
    [/<\/hd/i,          '</h3'],
    [/<text/i,          '<div'],
    [/<\/text/i,        '</div'],
    [/<title/i,         '<h2'],
    [/<\/title/i,       '</h2'],
    [/<anid/i,          '<p'],
    [/<\/anid/i,        '</p'],
    [/<aug/i,           '<strong'],
    [/<\/aug/i,         '</strong'],
    [/<linebr/i,        '<br'],
    [/<\/linebr/i,      ''],
    [/<olist/i,         '<ol'],
    [/<\/olist/i,       '</ol'],
    [/<reflink/i,       '<a'],
    [/<\/reflink/i,     '</a'],
    [/<blist/i,         '<p class="blist"'],
    [/<\/blist/i,       '</p'],
    [/<bibl/i,          '<a'],
    [/<\/bibl/i,        '</a'],
    [/<bibtext/i,       '<span'],
    [/<\/bibtext/i,     '</span'],
    [/<ref/i,           '<div class="ref"'],
    [/<\/ref/i,         '</div'],
    [/<ulink/i,         '<a'],
    [/<\/ulink/i,       '</a'],
];

var eds = {
    authToken: function authToken(current) {
        if (current.authToken) {
            log.debug('returning existing auth token');
            return new Promise(function(resolve, reject) {
                resolve(current.authToken);
            });
        };

        let url  = null;
        let data = {};

        if (current.search.cancelled) {
            log.debug('search cancelled -- stopping authToken()');
            return null;
        };

        // If config has a user & password, use UID auth, else we use IP.
        if (current.config.user && current.config.password) {
            log.debug('getting authentication token using UID auth method');
            url = current.config.UIDauthURL
            data = JSON.stringify({ "UserId": current.config.user,
                                    "Password": current.config.password });
        } else {
            log.debug('getting authentication token using IP auth method');
            url = current.config.IPauthURL;
        }
        return net.post(url, current.config.corsproxy, data)
            .then(data => {
                // We're expecting an object.  If we get a string, 
                // it's an error message from our net.js.
                if (obj.isString(data)) {
                    current.error = data;
                    return null;
                } else {
                    log.debug('saving auth token in current page');
                    current.authToken = data.AuthToken;
                    return data.AuthToken;
                }
            })
            .catch(exception => {
                if (obj.isString(exception))
                    current.error = exception;
                return null;
            });
    },

    sessionToken: function sessionToken(current, a_token) {
        if (current.sessionToken) {
            log.debug('returning existing session token');
            return new Promise(function(resolve, reject) {
                resolve(current.sessionToken);
            });
        }

        if (! a_token) {
            log.debug("no authentication token -- can't get session token");
            return null;
        };

        if (current.search.cancelled) {
            log.debug('search cancelled -- stopping sessionToken()');
            return null;
        };

        log.debug('getting session token');
        return net.post(current.config.sessionURL, current.config.corsproxy,
                        {'Profile': 'edsapi'},
                        {'x-authenticationToken': a_token })
            .then((data) => {
                log.debug('saving session token in current page');
                current.sessionToken = data.SessionToken;
                return data.SessionToken;
            });
    },

    searchResults: function searchResults(current, a_token, s_token) {
        if (! a_token || ! s_token) {
            log.debug("do not have all necessary tokens -- aborting search");
            return null;
        };

        if (current.search.cancelled) {
            log.debug('search cancelled -- stopping searchResults()');
            return null;
        };

        let headers = {'x-authenticationToken': a_token,
                       'x-sessionToken': s_token,
                       'Content-Type': 'application/json' };
        let data = {
            "SearchCriteria": {
                "Queries": [ { "Term": current.search.current } ],
                "SearchMode": "all",
                "IncludeFacets": "y",
                "Sort": current.sortMode,
                "AutoSuggest": "n",
                "AutoCorrect": current.autocorrect ? "y" : "n",
            },
            "RetrievalCriteria": {
                "View": "detailed",
                "ResultsPerPage": current.perPage,
                "PageNumber": current.currentPage,
                "Highlight": current.highlightTerms ? "y" : "n",
                "IncludeImageQuickView": "n"
            },
            "Actions": null
        };
        log.debug('sending search query');
        log.debug(current.perPage);
        return net.post(current.config.searchURL, current.config.corsproxy,
                        data, headers)
            .then(data => data.SearchResult);
    },

    filtered: function filtered(str) {
        let htmlified = he.decode(str);
        for (var rule of replacements)
            htmlified = htmlified.replaceAll(rule[0], rule[1]);
        return htmlified;
    },
}

module.exports = eds;


// The end.
// ............................................................................

log.debug('loaded eds.js');
