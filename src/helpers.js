"use strict";


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

    result += (date.getTimezoneOffset() > 0) ? "-" : "+";
    result += (Math.abs(date.getTimezoneOffset()) / 60 | 0 < 10) ? "0" : "";
    result += Math.abs((date.getTimezoneOffset() / 60 | 0) * 100 + (date.getTimezoneOffset() % 60));
    return result;
};


module.exports = helpers;
