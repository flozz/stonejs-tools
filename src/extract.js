"use strict";

var async = require("async");
var glob = require("glob");
var fs = require("fs");
var espree = require("espree");


/**
 * @class extract
 * @constructor
 */
var extract = {};

/**
 * Run all the string extraction process (list files, read files, extract string, generate po template, write po template).
 *
 * options:
 *
 *     {
 *         'functions': ["_", "gettext", "lazyGettext"]   // The name of the gettext functions
 *     }
 *
 * @method main
 * @static
 * @param {Array} jsFiles list of js files to parse (can contain glob pattern)
 * @param {String} output the output file (.pot)
 * @param {Object} options additional options (optional, default: see above)
 */
extract.main = function(jsFiles, output, options) {
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
            console.log("============================");

            async.each(files,

                function(file, callback) {
                    fs.readFile(file, function(error, data) {
                        console.log(data.toString());  // FIXME
                    });
                },

                function() {
                }
            );
        }
    );
};


module.exports = extract;
