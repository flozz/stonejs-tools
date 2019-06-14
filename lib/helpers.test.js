const helpers = require("./helpers.js");

/* eslint arrow-body-style: 0 */

describe("lib.helpers", () => {

    describe("lib.helpers.globPromise", () => {

        test("returns a promise that is fulfilled with files matching the glob pattern", () => {
            return helpers.globPromise("./test/fixtures/**/*.txt")
                .then((files) => {
                    expect(files).toHaveLength(3);
                    expect(files).toContain("./test/fixtures/a.txt");
                    expect(files).toContain("./test/fixtures/more-files/b.txt");
                    expect(files).toContain("./test/fixtures/more-files/even more/c.txt");
                });
        });

    });

    describe("lib.helpers.flattenArray", () => {

        test("flattens given array", () => {
            const result = helpers.flattenArray([[1], [2, 3], 4]);
            expect(result).toHaveLength(4);
            expect(result).toEqual([1, 2, 3, 4]);
        });

    });

    describe("lib.helpers.listFiles", () => {

        test("handles a single string pattern", () => {
            return helpers.listFiles("test/fixtures/**/*.md")
                .then((files) => {
                    expect(files).toHaveLength(1);
                    expect(files).toContain("test/fixtures/more-files/even more/a.md");
                });
        });

        test("handles multiple patterns passed as an array of strings", () => {
            return helpers.listFiles([
                "test/fixtures/**/*.txt",
                "test/fixtures/**/*.rst",
                "test/fixtures/**/*.md",
            ])
                .then((files) => {
                    expect(files).toHaveLength(5);
                    expect(files).toContain("test/fixtures/a.txt");
                    expect(files).toContain("test/fixtures/more-files/b.txt");
                    expect(files).toContain("test/fixtures/more-files/even more/c.txt");
                    expect(files).toContain("test/fixtures/more-files/a.rst");
                    expect(files).toContain("test/fixtures/more-files/even more/a.md");
                });
        });

    });

    describe("lib.helpers.matchExtractor", () => {

        test("throws an error if there is no matching extractor", () => {
            expect(() => helpers.matchExtractor("/foo/bar/xxx.yyy"))
                .toThrow(/No extractor matches for this file/);
        });

        test("returns the config of the matching extractor", () => {
            expect(helpers.matchExtractor("foobar.js"))
                .toHaveProperty("extractor", "stonejs-tools/lib/extractors/javascript");
            expect(helpers.matchExtractor("foobar.jsx"))
                .toHaveProperty("extractor", "stonejs-tools/lib/extractors/jsx");
            expect(helpers.matchExtractor("foobar.html"))
                .toHaveProperty("extractor", "stonejs-tools/lib/extractors/html");
        });

        test("returns the config of a non-built in extractor", () => {
            const extractConfig = {
                foo: {
                    match: "foo$",
                },
                vue: {
                    match: "^.*\\.vue$",
                },
            };
            expect(helpers.matchExtractor("foobar.vue", extractConfig))
                .toBe(extractConfig.vue);
        });

    });

    describe("lib.helpers.getModule", () => {

        test("can import a module", () => {
            const refModule = require("./extractors/javascript.js");   // eslint-disable-line global-require
            expect(helpers.getModule(`${__dirname}/extractors/javascript.js`)).toBe(refModule);
        });

        test("can import stonejs-tools internal modules", () => {
            const refModule = require("./extractors/javascript.js");   // eslint-disable-line global-require
            expect(helpers.getModule("stonejs-tools/lib/extractors/javascript.js")).toBe(refModule);
        });

        test("returns the given function if the module was already imported", () => {
            function foobarExtractor() {}
            expect(helpers.getModule(foobarExtractor)).toBe(foobarExtractor);
        });

    });

});
