"use strict";

var async = require("async");
var glob = require("glob");
var fs = require("fs");


/**
 * @class update
 * @constructor
 */
var update = {};

/**
 * Run all the .po files udpate process.
 *
 * @method main
 * @static
 * @param {Array} poFiles the .po files to update (can contain glob pattern)
 * @param {String} template the .pot file
 */
update.main = function(poFiles, template) {
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


module.exports = update;
