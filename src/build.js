"use strict";

var async = require("async");
var glob = require("glob");
var fs = require("fs");


/**
 * @class build
 * @constructor
 */
var build = {};

/**
 * Run all the process to compile the .po files into a JSON or Javascript file that can be used with Stone.js.
 *
 * options:
 *
 *     {
 *         'merge': false,   // Merge all locales into an unique file
 *         'format': json    // Output format ("json" or "js"/"javascript")
 *     }
 *
 * @method main
 * @static
 * @param {Array} poFiles list of the .po file to buid (can contain glob pattern)
 * @param {String} output the output folder where compiled files will be created OR output file if the `merge` option is set to `true`
 * @param {Object} options additional options (optional, default: see above)
 */
build.main = function(poFiles, output, options) {
    options = options || {};
    options.merge = (options.merge === undefined) ? false : !!options.merge;
    options.format = (options.format !== undefined && ["json", "js", "javascript"].indexOf(options.format.toLowerCase()) > -1) ? options.format.toLowerCase() : "json";

    var files = [];

    async.each(poFiles,

        function(poFile, callback) {
           glob(poFile, {}, function(error, matchingFiles) {
               files = files.concat(matchingFiles);
               callback();
           });
        },

        function() {
            // TODO
            console.log("BUILD");
            console.log("  poFiles: ", files);
            console.log("  output: ", output);
            console.log("  options: ", options);
        }
    );
};


module.exports = build;
