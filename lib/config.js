const DEFAULT_CONFIG = {
    extract: {
        javascript: {
            match: "\\.m?js$",
            preprocessor: [],
            extractor: "stonejs-tools/lib/extractors/javascript",
            gettextFunctions: ["_", "gettext", "lazyGettext"],
            nGettextFunctions: ["N_", "ngettext", "nLazyGettext"],
        },
        jsx: {
            match: "\\.jsx$",
            preprocessors: [],
            extractor: "stonejs-tools/lib/extractors/jsx",
            gettextFunctions: ["_", "gettext", "lazyGettext"],
            nGettextFunctions: ["N_", "ngettext", "nLazyGettext"],
        },
        html: {
            match: "\\.x?html?$",
            preprocessor: [],
            extractor: "stonejs-tools/lib/extractors/html",
            gettextAttributes: ["stonejs"],
        },
    },
    build: {
        json: {
            builder: "stonejs-tools/lib/builders/json",
            mergeCatalogs: false,
        },
        mo: {
            builder: "stonejs-tools/lib/builders/mo",
        },
    },
};

module.exports = {
    DEFAULT_CONFIG,
};
