const espree = require("espree");
const { DEFAULT_CONFIG } = require("../config.js");

function javascriptExtractor(fileName, fileContent, config = DEFAULT_CONFIG, isJsx = false) {

    function _cleanString(str) {  // eslint-disable-line no-underscore-dangle
        return new Function(`return ${str};`)();  // eslint-disable-line no-new-func
    }

    const gettextFunctionNames = isJsx
        ? config.extract.jsx.gettextFunctions
        : config.extract.javascript.gettextFunctions;

    const ast = espree.parse(fileContent, {
        tolerant: true,
        tokens: true,
        loc: true,
        ecmaVersion: 2019,
        sourceType: "module",
        ecmaFeatures: {
            jsx: isJsx,
        },
    });

    const strings = {};

    let inFunction = false;  // In function flag
    let inParenthesis = false;  // In parenthesis flag
    let buff = true;   // Buff to concat splitted strings
    for (let i = 0; i < ast.tokens.length; i++) {

        // ?
        if (!inFunction && !inParenthesis) {
            if (ast.tokens[i].type === "Identifier" && gettextFunctionNames.indexOf(ast.tokens[i].value) > -1) {
                inFunction = true;
            }

        // functionName
        } else if (inFunction && !inParenthesis) {
            if (ast.tokens[i].type === "Punctuator" && ast.tokens[i].value === "(") {
                inParenthesis = true;
                buff = "";
            } else {
                inFunction = false;
            }

        // functionName (
        } else if (inFunction && inParenthesis) {
            if (ast.tokens[i].type === "String" || ast.tokens[i].type === "Numeric") {
                buff += _cleanString(ast.tokens[i].value);
            } else if (ast.tokens[i].type === "Punctuator" && ast.tokens[i].value === "+") {
                continue;
            } else if (ast.tokens[i].type === "Identifier") {
                buff = "";
                inFunction = false;
                inParenthesis = false;
            } else {
                if (strings[buff] === undefined) {
                    strings[buff] = [`${fileName}:${ast.tokens[i].loc.start.line}`];
                } else {
                    strings[buff].push(`${fileName}:${ast.tokens[i].loc.start.line}`);
                }
                inFunction = false;
                inParenthesis = false;
            }
        }
    }

    return strings;
}

module.exports = javascriptExtractor;
