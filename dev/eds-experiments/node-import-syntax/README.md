Node import syntax
==================

The syntax to read a separate file for config variables is different when running in a Javascript interpreter like Node compared to reading the file from a browser script inside a web page's `<script>` tag.  Here, `config.js` demonstrates the key part: the use of a `module.exports` statement, and then in the main file, the use of `require` to read the file.

Tested in NodeJS v13.
