const fs = require("fs");

const glob = require("glob");

const { DEFAULT_CONFIG } = require("./config.js");

function globPromise(pattern, options) {
    return new Promise((resolve, reject) => {
        glob(pattern, options, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
}

function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

function flattenArray(array) {
    return Array.prototype.concat.apply([], array);
}

function listFiles(patterns) {
    if (!Array.isArray(patterns)) {
        return globPromise(patterns);
    }

    const promises = [];
    for (let i = 0; i < patterns.length; i++) {
        promises.push(globPromise(patterns[i]));
    }

    return Promise.all(promises)
        .then(results => flattenArray(results));
}

function matchExtractor(fileName, config = DEFAULT_CONFIG.extract) {
    for (const extractorName in config) {  // eslint-disable-line no-restricted-syntax
        if (!Object.prototype.hasOwnProperty.call(config, extractorName)) continue;
        const extractorConfig = config[extractorName];
        const extractorRegExp = new RegExp(extractorConfig.match);
        if (!extractorRegExp.exec(fileName)) continue;
        return extractorConfig;
    }
    throw new Error(`No extractor matches for this file: ${fileName}`);
}

function getModule(module) {
    if (typeof module === "function") {
        return module;
    }
    if (module.indexOf("stonejs-tools/lib/") === 0) {
        module = module.replace("stonejs-tools/lib", __dirname);  // eslint-disable-line no-param-reassign
    }
    return require(module);  // eslint-disable-line global-require, import/no-dynamic-require
}

module.exports = {
    globPromise,
    readFilePromise,
    flattenArray,
    listFiles,
    matchExtractor,
    getModule,
};
