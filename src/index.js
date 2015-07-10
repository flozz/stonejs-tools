"use strict";


var async = require("async");
var glob = require("glob");


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
    options = options || {};
    if (options.functions === undefined) {
        options.functions = ["_", "gettext", "lazyGettext"];
    }
    else if (typeof options.functions == "string") {
        options.functions = options.functions.split(",");
    }

    var files = [];

    async.each(jsFiles,

        function(jsFile, callback) {
           glob(jsFile, {}, function(error, matchingFiles) {
               files = files.concat(matchingFiles);
               callback();
           });
        },

        function() {
            // TODO
            console.log("EXTRACT");
            console.log("  jsFiles: ", files);
            console.log("  output: ", output);
            console.log("  options: ", options);
        }
    );
};

/**
 * Update .po files from a .pot .
 *
 * @method update
 * @static
 * @param {Array} poFiles the .po files to update (can contain glob pattern)
 * @param {String} template the .pot file
 */
tools.update = function(poFiles, template) {
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
            console.log("UPDATE");
            console.log("  poFiles: ", files);
            console.log("  template: ", template);
        }
    );
};

/**
 * Compile the .po files into a JSON or Javascript file that can be used with Stone.js.
 *
 * options:
 *
 *     {
 *         'merge': false,   // Merge all locales into an unique file
 *         'format': json    // Output format ("json" or "js"/"javascript")
 *     }
 *
 * @method build
 * @static
 * @param {Array} poFiles list of the .po file to buid (can contain glob pattern)
 * @param {String} output the output folder where compiled files will be created OR output file if the `merge` option is set to `true`
 * @param {Object} options additional options (optional, default: see above)
 */
tools.build = function(poFiles, output, options) {
    options = options || {};
    options.merge = (options.merge === undefined) ? false : !!options.merge;
    options.format = (["json", "js", "javascript"].indexOf(options.format.toLowerCase()) > -1) ? options.format.toLowerCase() : "json";

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


module.exports = tools;
