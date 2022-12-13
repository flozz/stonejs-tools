"use strict";

var fs = require("fs");

var async = require("async");
var glob = require("glob");
var gettextParser = require("gettext-parser");

var helpers = require("./helpers.js");



/**
 * @class update
 * @constructor
 */
var update = {};

/**
 * Run all the .po files udpate process.
 *
 * options:
 *
 *     {
 *         'quiet': false   // If true: do not output logs
 *     }
 *
 * @method main
 * @static
 * @param {Array} poFiles the .po files to update (can contain glob pattern)
 * @param {String} template the .pot file
 * @param {Object} options additional options (optional, default: see above)
 * @param {Function} callback function called when everything is done (optional)
 */
update.main = function(poFiles, template, options, callback) {
    callback = callback || function(){};
    options = options || {};
    var files = [];

    if (!helpers.isFile(template)) {
        helpers.error("The translation template does not exist: " + template, options);
        process.exit(1);
    }

    var potData = fs.readFileSync(template, {encoding: "utf-8"});

    async.each(poFiles,

        function(poFile, doneCb) {
           glob(poFile, {}, function(error, matchingFiles) {
               files = files.concat(matchingFiles);
               doneCb();
           });
        },

        function() {
            var poData;
            for (var i=0 ; i<files.length ; i++) {
                helpers.log("  * Updating '" + files[i] + "'", options);
                poData = fs.readFileSync(files[i], {encoding: "utf-8"});
                if (!poData) {
                    helpers.warn("    /!\\ Skipped!", options);
                    continue;
                }
                poData = update.updatePo(poData, potData);
                fs.writeFileSync(files[i], poData, {encoding: "utf-8"});
            }
            callback();
        }
    );
};

/**
 * Updates the po file from the given pot.
 *
 * @method updatePo
 * @static
 * @param {String} poData the po file content
 * @param {String} potData the pot file content
 * @return {String} the update po data
 */
update.updatePo = function(poData, potData) {
    var pot = gettextParser.po.parse(potData);
    var po = gettextParser.po.parse(poData);

    po.headers["po-revision-date"] = helpers.dateFormat(new Date());
    var nplural = helpers.nplurals(po.headers["plural-forms"]);

    for (var msgctxt in pot.translations) {
        for (var msgid in pot.translations[msgctxt]) {
            if (msgid === "") continue;
            if (po.translations[msgctxt] === undefined) {
                po.translations[msgctxt] = {};
            }
            if (po.translations[msgctxt][msgid] === undefined) {
                po.translations[msgctxt][msgid] = pot.translations[msgctxt][msgid];
            }
            else {
                if (!po.translations[msgctxt][msgid].comments) {
                    po.translations[msgctxt][msgid].comments = {};
                }
                po.translations[msgctxt][msgid].comments.reference = pot.translations[msgctxt][msgid].comments.reference;
            }
            var msgid_plural = pot.translations[msgctxt][msgid].msgid_plural;
            if (msgid_plural) {
                po.translations[msgctxt][msgid].msgid_plural = msgid_plural;
                if (po.translations[msgctxt][msgid].msgstr.length !== nplural) {
                    var msgstr = [];
                    for (var i = 0; i < nplural; i++) {
                        msgstr.push(po.translations[msgctxt][msgid].msgstr[i] || "");
                    }
                    po.translations[msgctxt][msgid].msgstr = msgstr;
                }
            }
        }
    }

    return gettextParser.po.compile(po).toString();
};


module.exports = update;
