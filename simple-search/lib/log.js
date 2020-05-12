// ============================================================================
// @file    log.js
// @brief   Logging configuration
// @author  Michael Hucka <mhucka@caltech.edu>
// @license Please see the file named LICENSE in the project directory
// @website https://github.com/caltechlibrary/eds_experiment
// ============================================================================

// Imports.
// ............................................................................

// Load our logging module if necessary.  If we're loaded from an HTML file
// in a browser, this should be loaded already.
try {
    var log = require('loglevel').noConflict();
    var prefix = require('loglevel-plugin-prefix').noConflict();
} catch (ex) {}


// Main code.
// ............................................................................

prefix.reg(log);
prefix.apply(log);

module.exports = log;


// The end.
// ............................................................................

log.debug('loaded log.js');
