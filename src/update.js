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

    if (!fs.statSync(template).isFile()) {
        helpers.error("The given translation template does not exist: " + template);
        return;
    }

    var potData = fs.readFileSync(template);

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
                poData = fs.readFileSync(files[i]);
                if (!poData) {
                    helpers.warn("    /!\\ Skipped!", options);
                    continue;
                }
                poData = update.updatePo(poData, potData);
                fs.writeFileSync(files[i], poData);
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

    for (var msgid in pot.translations[""]) {
        if (msgid === "") continue;
        if (po.translations[""][msgid] === undefined) {
            po.translations[""][msgid] = pot.translations[""][msgid];
        }
        else {
            po.translations[""][msgid].comments.reference = pot.translations[""][msgid].comments.reference;
        }
    }

    return gettextParser.po.compile(po).toString();
};


module.exports = update;
