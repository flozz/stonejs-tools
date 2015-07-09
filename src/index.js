"use strict";


/**
 * @class tools
 * @constructor
 */
var tools = {};

/**
 * Extract strings from js files.
 *
 * options:
 *
 *     {
 *         'functions': ["_", "gettext", "lazyGettext"]   // The name of the gettext functions
 *     }
 *
 * @method extract
 * @static
 * @param {Array} jsFiles list of js files to parse (can contain glob pattern)
 * @param {String} output the output file (.pot)
 * @param {Object} options additional options (optional, default: see above)
 */
tools.extract = function(jsFiles, output, options) {
    // TODO
}

/**
 * Update .po files from a .pot .
 *
 * @method update
 * @static
 * @param {String} tempate the .pot file
 * @param {Array} poFiles the .po files to update (can contain glob pattern)
 */
tools.update = function(tempate, poFiles) {
    // TODO
}

/**
 * Compile the .po files into a JSON or Javascript file that can be used with Stone.js.
 *
 * options:
 *
 *     {
 *         'merge': false,   // Merge all locales into an unique file
 *         'format': json   // Output format ("json" or "js"/"javascript")
 *     }
 *
 * @method build
 * @static
 * @param {Array} poFiles list of the .po file to buid (can contain glob pattern)
 * @param {String} output the output folder where compiled files will be created OR output file if the `merge` option is set to `true`
 * @param {Object} options additional options (optional, default: see above)
 */
tools.build = function(poFiles, output) {
    // TODO
}


module.exports = tools;
