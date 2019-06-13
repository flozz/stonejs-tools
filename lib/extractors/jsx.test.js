const jsxExtractor = require("./jsx.js");

describe("lib.extractors.jsx.jsxExtractor", () => {

    describe("Strings extraction from gettext functions", () => {

        test("can extract a simple string", () => {
            expect(jsxExtractor(
                "foo.jsx",
                "_('hello')",
            )).toHaveProperty("hello");
        });

        test("can extract text in HTML tag", () => {
            expect(jsxExtractor(
                "foo.jsx",
                "<div>_('hello')</div>",
            )).not.toHaveProperty("hello");
        });

        test("can extract a simple string in HTML tag", () => {
            expect(jsxExtractor(
                "foo.jsx",
                "<div>{_('hello')}</div>",
            )).toHaveProperty("hello");
        });

        test("can extract a string with params in HTML tag", () => {
            expect(jsxExtractor(
                "foo.jsx",
                "<div>{_('hello {name}', {name: 'foo'})}</div>",
            )).toHaveProperty("hello {name}");
        });
    });

    describe("config: gettextFunctions", () => {

        test("can extract strings wrapped in given gettext function names", () => {
            const strings = jsxExtractor(
                "foo.js",
                "myTranslationFunction1('string1');myTranslationFunction2('string2');", {
                    gettextFunctions: [
                        "myTranslationFunction1",
                        "myTranslationFunction2",
                    ],
                },
            );
            expect(strings).toHaveProperty("string1");
            expect(strings).toHaveProperty("string2");
        });

    });

});
