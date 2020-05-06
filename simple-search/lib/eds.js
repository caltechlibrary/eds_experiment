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
    filtered: function filtered(str) {
        let htmlified = he.decode(str);
        for (var rule of replacements)
            htmlified = htmlified.replaceAll(rule[0], rule[1]);
        return htmlified;
    },
}

module.exports = eds;
