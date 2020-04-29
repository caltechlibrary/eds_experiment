// ============================================================================
// @file    string.js
// @brief   String utilities
// @author  Michael Hucka <mhucka@caltech.edu>
// @license Please see the file named LICENSE in the project directory
// @website https://github.com/caltechlibrary/eds_experiment
// ============================================================================

// Simple implementation of regexp replaceAll.
String.prototype.replaceAll = function (search, replacement) {
    var str1 = this.replace(search, replacement);
    var str2 = this;
    while (str1 != str2) {
        str2 = str1;
        str1 = str1.replace(search, replacement);
    }
    return str1;
}
