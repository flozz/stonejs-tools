"use strict";

var fs = require("fs");
var path = require("path");

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
    if (options.format == "javascript") options.format = "js";
    callback = callback || function(){};

    if (options.merge && helpers.isDir(output)) {
        helpers.error("You requested a merged output file but '" + output + "' is a directory.", options);
        process.exit(1);
    }
    else if (!options.merge && !helpers.isDir(output)) {
        helpers.error(output + "' is not a directory.", options);
        process.exit(1);
    }

    var formats = {
        json: JSON.stringify,
        js: function(data) {
            var result = "";
            result += "(function(window, undefined) {\n";
            result += "    function _sendEvent(name, data) {\n";
            result += "        var data = data || {};\n";
            result += "        var ev = null;\n";
            result += "        try {\n";
            result += "            ev = new Event(name);\n";
            result += "        }\n";
            result += "        catch (e) {\n";
            result += "            ev = document.createEvent(\"Event\");\n";
            result += "            ev.initEvent(name, true, false);\n";
            result += "        }\n";
            result += "        for (var i in data) {\n";
            result += "            ev[i] = data[i];\n";
            result += "        }\n";
            result += "        document.dispatchEvent(ev);\n";
            result += "    }\n";
            result += "    var catalog = " + JSON.stringify(data) + ";\n";
            result += "    _sendEvent(\"stonejs-autoload-catalogs\", {catalog: catalog});\n";
            result += "}(window));\n";
            return result;
        }
    };

    var files = [];
    var catalogs = {};

    async.each(poFiles,

        function(poFile, doneCb) {
           glob(poFile, {}, function(error, matchingFiles) {
               files = files.concat(matchingFiles);
               doneCb();
           });
        },

        function() {
            var poData, catalog, lang, result, fileName;
            for (var i=0 ; i<files.length ; i++) {
                helpers.log("  * Building '" + files[i] + "'", options);
                poData = fs.readFileSync(files[i], {encoding: "utf-8"});
                if (!poData) {
                    helpers.warn("    /!\\ Skipped!", options);
                    continue;
                }
                catalog = build.poToJson(poData);
                for (lang in catalog) {
                    catalogs[lang] = catalog[lang];
                }
            }
            if (options.merge) {
                result = formats[options.format](catalogs);
                fs.writeFileSync(output, result, {encoding: "utf-8"});
                helpers.ok("Translation built: " + output, options);
            }
            else {
                for (lang in catalogs) {
                    fileName = path.join(output, lang + "." + options.format);
                    catalog = {};
                    catalog[lang] = catalogs[lang];
                    result = formats[options.format](catalog);
                    fs.writeFileSync(fileName, result, {encoding: "utf-8"});
                    helpers.log ("  * writing '" + fileName + "'", options);
                }
                helpers.ok("All translation built.", options);
            }
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
        "plural-forms": po.headers["plural-forms"] || "nplurals=2; plural=(n != 1);",
        messages: {
            // "<msgid>": { "<msgctx>": ["<msgstr>", "<msgstr_plural>"]}
        }
    };

    for (var msgctxt in po.translations) {
        for (var msgid in po.translations[msgctxt]) {
            if (msgid === "") continue;
            if (!catalog[lang].messages[msgid]) catalog[lang].messages[msgid] = {};
            if (msgctxt === "") msgctxt = "*"
            catalog[lang].messages[msgid][msgctxt] = po.translations[msgctxt][msgid].msgstr;
        }
    }
    return catalog;
};


module.exports = build;
