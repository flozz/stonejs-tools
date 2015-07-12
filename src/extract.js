"use strict";

var async = require("async");
var glob = require("glob");
var fs = require("fs");
var espree = require("espree");
var gettextParser = require("gettext-parser");

var helpers = require("./helpers.js");


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
    var strings = {};

    async.each(jsFiles,

        function(jsFile, doneCb) {
           glob(jsFile, {}, function(error, matchingFiles) {
               files = files.concat(matchingFiles);
               doneCb();
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

                function(file, doneCb) {
                    fs.readFile(file, function(error, data) {
                        var extractedStrings = extract.extractJsStrings(data.toString(), options.functions);
                        for (var str in extractedStrings) {
                            if (strings[str] === undefined) {
                                strings[str] = [];
                            }
                            for (var i=0 ; i<extractedStrings[str].length ; i++) {
                                strings[str].push({
                                    file: file,
                                    line: extractedStrings[str][i]
                                });
                            }
                        }
                        doneCb();
                    });
                },

                function() {
                    fs.writeFile(output, extract.generatePo(strings));
                }
            );
        }
    );
};

/**
 * Extracts strings from the given Javascript source code.
 *
 * @method extractJsStrings
 * @static
 * @param {String} source The Javascript source code.
 * @param {Array} functionsNames The name of th etranslation functions to search in the source.
 * @return {Object} Translatable strings `{ <string>: [<lines>] }`.
 */
extract.extractJsStrings = function(source, functionsNames) {
    var strings = {};
    var ast = espree.parse(source, {tolerant: true, tokens: true, loc: true});

    function _cleanString(str) {
        return new Function("return " + str + ";")();  // jshint ignore:line
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
            if (ast.tokens[i].type == "String" || ast.tokens[i].type == "Numeric") {
                buff += _cleanString(ast.tokens[i].value);
            }
            else if (ast.tokens[i].type == "Punctuator" && ast.tokens[i].value == "+") {
                continue;
            }
            else if (ast.tokens[i].type == "Identifier") {
                buff = "";
                f_fn = false;
                f_sp = false;
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

/**
 * Generates the .po file.
 *
 * @method generatePo
 * @static
 * @param {Object} strings the strings `{ "<msgid>": [{file: String, line: Number}] }`.
 * @return {String} the generated po file.
 */
extract.generatePo = function(strings) {

    function _buildRef(refs) {
        var result = "";
        for (var i=0 ; i<refs.length ; i++) {
            if (i > 0) result += "\n";
            result += refs[i].file + ":" + refs[i].line;
        }
        return result;
    }

    var date = new Date();
    var data = {
        "charset": "UTF-8",

        headers: {
            "mime-version": "1.0",
            "content-type": "text/plain; charset=UTF-8",
            "content-transfer-encoding": "8bit",
            "pot-creation-date": helpers.dateFormat(date),
            "po-revision-date": helpers.dateFormat(date),
            "language": "C",
            "plural-forms": "nplurals=2; plural=(n > 1);"
        },

        translations: {
            "": {
                // "<msgid>" {
                //     msgid: "<msgid>",
                //     msgstr: ["<msgstr>"],
                //     comments: {
                //         reference: "<ref1>\n<ref2>"
                //     }
                // }
            }
        }
    };

    for (var msgid in strings) {
        data.translations[""][msgid] = {
            msgid: msgid,
            msgstr: "",
            comments: {
                reference: _buildRef(strings[msgid])
            }
        };
    }

    return gettextParser.po.compile(data).toString();
};



module.exports = extract;
