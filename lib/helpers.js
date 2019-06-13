const glob = require("glob");

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

module.exports = {
    globPromise,
    flattenArray,
    listFiles,
};
