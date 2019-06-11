const javascriptExtractor = require("./javascript.js");
const { DEFAULT_CONFIG } = require("../config.js");

function jsxExtractor(fileName, fileContent, config = DEFAULT_CONFIG) {
    return javascriptExtractor(fileName, fileContent, config, true);
}

module.exports = jsxExtractor;
