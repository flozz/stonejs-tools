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
                        var strings = extract.extractStrings(data.toString(), options.functions);
                        console.log(strings);  //FIXME
                    });
                },

                function() {
                    // TODO
                }
            );
        }
    );
};

/**
 * Extracts strings from the given Javascript source code.
 *
 * @method extractStrings
 * @static
 * @param {String} source The Javascript source code.
 * @param {Array} functionsNames The name of th etranslation functions to search in the source.
 * @return {Object} Translatable strings `{ <string>: [<lines>] }`.
 */
extract.extractStrings = function(source, functionsNames) {
    var strings = {};
    var ast = espree.parse(source, {tolerant: true, tokens: true, loc: true});

    function _cleanString(str) {
        var quote = str[0];
        str = str.slice(1, str.length-1);  // Remove quotes
        str = (quote == "'") ? str.replace(/\\'/g, "'") : str.replace(/\\"/g, '"');  // Unescape quotes
        str = str.replace(/\\(\r?\n)/g, "$1");  // Unescape EOL
        return str;
    }

    var f_fn = false;  // In function flag
    var f_sp = false;  // In parenthesis flag
    var buff = true;   // Buff to concat splitted strings
    for (var i=0 ; i<ast.tokens.length ; i++) {

        // ?
        if (!f_fn && !f_sp) {
            if (ast.tokens[i].type == "Identifier" && functionsNames.indexOf(ast.tokens[i].value) > -1) {
                f_fn = true;
            }
        }

        // functionName
        else if (f_fn && !f_sp) {
            if (ast.tokens[i].type == "Punctuator" && ast.tokens[i].value == "(") {
                f_sp = true;
                buff = "";
            }
            else {
                f_fn = false;
            }
        }

        // functionName (
        else if (f_fn && f_sp) {
            if (ast.tokens[i].type == "String") {
                buff += _cleanString(ast.tokens[i].value);
            }
            else if (ast.tokens[i].type == "Punctuator" && ast.tokens[i].value == "+") {
                continue;
            }
            else {
                if (strings[buff] === undefined) {
                    strings[buff] = [ast.tokens[i].loc.start.line];
                }
                else {
                    strings[buff].push(ast.tokens[i].loc.start.line);
                }
                f_fn = false;
                f_sp = false;
            }
        }
    }

    return strings;
};


module.exports = extract;
