"use strict";


var cli = require("cli");


/**
 * @class helpers
 * @constructor
 */
var helpers = {};

/**
 * Format the date to the format used in po files.
 *
 * @method dateFormat
 * @static
 * @param {Date} date The date to format (optional).
 * @return {Sring} The formatted date.
 */
helpers.dateFormat = function(date) {
    date = date || new Date();
    var result = "";

    // Date
    result += date.getFullYear();
    result += "-";
    result += (date.getMonth() < 9) ? "0" + (date.getMonth()+1) : date.getMonth()+1;
    result += "-";
    result += (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();

    result += " ";

    // Time
    result += (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    result += ":";
    result += (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    result += ":";
    result += (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();

    if (date.getTimezoneOffset() === 0) {
        result += "+0000";
    }
    else {
        result += (date.getTimezoneOffset() > 0) ? "-" : "+";
        result += (Math.abs(date.getTimezoneOffset()) / 60 | 0 < 10) ? "0" : "";
        result += Math.abs((date.getTimezoneOffset() / 60 | 0) * 100 + (date.getTimezoneOffset() % 60));
    }
    return result;
};

/**
 * Output a message to the console if not in quiet mode.
 *
 * @method log
 * @static
 * @param {String} message the message to write
 * @param {Object} options the options passed to the program
 */
helpers.log = function(message, options) {
    if (options.quiet || options.q) {
        return;
    }
    console.log(message);
};

/**
 * Output a warning message to the console if not in quiet mode.
 *
 * @method warn
 * @static
 * @param {String} message the message to write
 * @param {Object} options the options passed to the program
 */
helpers.warn = function(message, options) {
    if (options.quiet || options.q) {
        return;
    }
    console.warn(message);
};

/**
 * Output an error message to the console if not in quiet mode.
 *
 * @method error
 * @static
 * @param {String} message the message to write
 * @param {Object} options the options passed to the program
 */
helpers.error = function(message, options) {
    if (options.quiet || options.q) {
        return;
    }
    cli.error(message);
};

/**
 * Output an error message to the console if not in quiet mode.
 *
 * @method ok
 * @static
 * @param {String} message the message to write
 * @param {Object} options the options passed to the program
 */
helpers.ok = function(message, options) {
    if (options.quiet || options.q) {
        return;
    }
    cli.ok(message);
};


module.exports = helpers;
