"use strict";

var fs = require("fs");

var async = require("async");
var glob = require("glob");
var gettextParser = require("gettext-parser");

var helpers = require("./helpers.js");


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
 *         'format': json,   // Output format ("json" or "js"/"javascript")
 *         'quiet': false    // If true: do not output logs
 *     }
 *
 * @method main
 * @static
 * @param {Array} poFiles list of the .po file to buid (can contain glob pattern)
 * @param {String} output the output folder where compiled files will be created OR output file if the `merge` option is set to `true`
 * @param {Object} options additional options (optional, default: see above)
 * @param {Function} callback function called when everything is done (optional)
 */
build.main = function(poFiles, output, options, callback) {
    options = options || {};
    options.merge = (options.merge === undefined) ? false : !!options.merge;
    options.format = (options.format !== undefined && ["json", "js", "javascript"].indexOf(options.format.toLowerCase()) > -1) ? options.format.toLowerCase() : "json";

    if (options.merge && fs.statSync(output).isDirectory()) {
        helpers.error("You requested a merged output file but '" + output + "' is a directory.");
        process.exit(1);
    }
    else if (!options.merge && !fs.statSync(output).isDirectory()) {
        helpers.error(output + "' is not a directory.");
        process.exit(1);
    }

    var files = [];
    var catalogs = {};

    async.each(poFiles,

        function(poFile, callback) {
           glob(poFile, {}, function(error, matchingFiles) {
               files = files.concat(matchingFiles);
               callback();
           });
        },

        function() {
            var poData, catalog, lang;
            for (var i=0 ; i<files.length ; i++) {
                helpers.log("  * Building '" + files[i] + "'", options);
                poData = fs.readFileSync(files[i]);
                if (!poData) {
                    helpers.warn("    /!\\ Skipped!", options);
                    continue;
                }
                catalog = build.poToJson(poData);
                for (lang in catalog) {
                    catalogs[lang] = catalog[lang];
                }
            }
            console.log(catalogs);  // FIXME
            callback();
        }
    );
};

/**
 * Generate stonejs compatible json from a po file.
 *
 * @method poToJson
 * @static
 * @param {String} poData the po file content
 * @return {Object} the json as object
 */
build.poToJson = function(poData) {
    var po = gettextParser.po.parse(poData);
    var lang = po.headers.language || "C";

    var catalog = {};
    catalog[lang] = {
        "plural-forms": po.headers["plural-forms"] || "nplurals=2; plural=(n > 1);",
        messages: {
            // "<msgid>": ["<msgstr>"]
        }
    };

    for (var msgid in po.translations[""]) {
        if (msgid === "") continue;
        catalog[lang].messages[msgid] = po.translations[""][msgid].msgstr;
    }

    return catalog;
};


module.exports = build;
