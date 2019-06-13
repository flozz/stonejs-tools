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

});
