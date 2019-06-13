const javascriptExtractor = require("./javascript.js");

describe("lib.extractors.javascript.javascriptExtractor", () => {

    describe("Strings extraction from gettext functions", () => {

        test("does not extract not translatable strings", () => {
            expect(javascriptExtractor(
                "foo.js",
                "'hello';\nfoo('hello');bar_(\"hello\")",
            )).not.toHaveProperty("hello");
        });

        test("does not extract commented translatable strings (// comment)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "// _('hello')",
            )).not.toHaveProperty("hello");
        });

        test("does not extract commented translatable strings (/* comment */)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "/*\n * _('hello')\n */",
            )).not.toHaveProperty("hello");
        });

        test("ignores translatable string concatenated with an idenifier", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello' + identifier)",
            )).not.toHaveProperty("hello");
        });

        test("ignores cases where the translation function is not called", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_['toString']('hello')",
            )).not.toHaveProperty("hello");
        });

        test("can extract simple translatable string (single quote)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello')",
            )).toHaveProperty("hello");
        });

        test("can extract simple translatable string (double quote)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_(\"hello\")",
            )).toHaveProperty("hello");
        });

        test("can extract simple translatable string (with fuzzy whitespaces)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_(\t\n \"hello\"  )",
            )).toHaveProperty("hello");
        });

        test("can extract translatable string with escaped quote", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('rock \\'n roll')",
            )).toHaveProperty("rock 'n roll");
        });

        test("can extract translatable string with hexadecimal escaped char", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello\\x40world')",
            )).toHaveProperty("hello@world");
        });

        test("can extract concatenated translatable string", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 'world')",
            )).toHaveProperty("hello world");
        });

        test("can extract translatable string concatenated with integer", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 8)",
            )).toHaveProperty("hello 8");

            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 8.0)",
            )).toHaveProperty("hello 8");

            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 10e3)",
            )).toHaveProperty("hello 10000");
        });

        test("can extract translatable string concatenated with integer (hexa)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 0xFF)",
            )).toHaveProperty("hello 255");
        });

        test("can extract translatable string concatenated with float", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 3.14)",
            )).toHaveProperty(["hello 3.14"]);

            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + .3)",
            )).toHaveProperty(["hello 0.3"]);

            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' + 10e-3)",
            )).toHaveProperty(["hello 0.01"]);
        });

        test("can extract concatenated translatable string (multilines)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' +\n'world')",
            )).toHaveProperty("hello world");
        });

        test("can extract concatenated translatable string with comment in the middle", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello ' /* everybody */ + 'world')",
            )).toHaveProperty("hello world");
        });

        test("can extract multiline translatable strings (with escaped \\n)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello \\\nworld')",
            )).toHaveProperty("hello world");
        });

        test("can extract multiline translatable strings (with escaped \\r\\n)", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello \\\r\nworld')",
            )).toHaveProperty("hello world");
        });

        test("can extract translatable strings with replacement", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('hello {name}', {name: 'John'})",
            )).toHaveProperty("hello {name}");
        });

        test("can extract translatable strings marked with 'methods' instead of functions", () => {
            expect(javascriptExtractor(
                "foo.js",
                "Stone.gettext('hello')",
            )).toHaveProperty("hello");
        });

        test("Handles strings with unicode characters", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('⚠ Voici une chaîne avec des caractères spéciaux ☺')",
            )).toHaveProperty("⚠ Voici une chaîne avec des caractères spéciaux ☺");
        });

    });

    describe("Line number report", () => {

        test("returns the line number of extracted translatable strings", () => {
            const strings = javascriptExtractor(
                "foo.js",
                "\n\n_('hello')",
            );
            expect(strings.hello).toHaveLength(1);
            expect(strings.hello).toContain("foo.js:3");
        });

        test("can group duplicated translatable string", () => {
            const strings = javascriptExtractor(
                "foo.js",
                "_('hello');\n_('hello');",
            );
            expect(strings.hello).toHaveLength(2);
            expect(strings.hello).toContain("foo.js:1");
            expect(strings.hello).toContain("foo.js:2");
        });

    });

    describe("config: gettextFunctions", () => {

        test("can extract strings wrapped in given gettext function names", () => {
            const strings = javascriptExtractor(
                "foo.js",
                "myTranslationFunction1('string1');myTranslationFunction2('string2');",
                {
                    extract: {
                        javascript: {
                            gettextFunctions: [
                                "myTranslationFunction1",
                                "myTranslationFunction2",
                            ],
                        },
                    },
                },
            );
            expect(strings).toHaveProperty("string1");
            expect(strings).toHaveProperty("string2");
        });

        test("can only extract strings wrapped in given gettext function names", () => {
            expect(javascriptExtractor(
                "foo.js",
                "_('string1');gettext('string2');",
                {
                    extract: {
                        javascript: {
                            gettextFunctions: [
                                "myTranslationFunction1",
                                "myTranslationFunction2",
                            ],
                        },
                    },
                },
            )).not.toHaveProperty(["string1", "string2"]);
        });

    });

});
