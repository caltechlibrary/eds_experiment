// ============================================================================
// @file    obj.js
// @brief   JavaScript object utilities
// @author  Michael Hucka <mhucka@caltech.edu>
// @license Please see the file named LICENSE in the project directory
// @website https://github.com/caltechlibrary/eds_experiment
// ============================================================================

var obj = {

    // Based on https://stackoverflow.com/a/59787784/743730 posted by user
    // Kamil Kiełczewski on 2020-01-17, this is the fastest implementation.
    isEmpty: function isEmpty(thing) {
        for (var name in thing)
            return false;
        return true;
    },

    isString: function isString(thing) {
        return (typeof thing === "string" || thing instanceof String);
    },
}

module.exports = obj;
