var expect = require('expect.js');

var extract = require("../src/extract.js");


describe("stonejs extract:", function() {

    describe("extract.extractStrings", function() {

        it("do not extract not translatable strings", function() {
            expect(extract.extractStrings(
                "'hello';\nfoo('hello');bar_(\"hello\")",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("do not extract commented translatable strings (// comment)", function() {
            expect(extract.extractStrings(
                "// _('hello')",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("do not extract commented translatable strings (/* comment */)", function() {
            expect(extract.extractStrings(
                "/*\n * _('hello')\n */",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("can extract simple translatable string (single quote)", function() {
            expect(extract.extractStrings(
                "_('hello')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("can extract simple translatable string (double quote)", function() {
            expect(extract.extractStrings(
                "_(\"hello\")",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("can extract simple translatable string (with fuzzy whitespaces)", function() {
            expect(extract.extractStrings(
                "_(\t\n \"hello\"  )",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("can extract translatable string with escaped quote", function() {
            expect(extract.extractStrings(
                "_('rock \\'n roll')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("rock 'n roll");
        });

        it("can extract concatenated translatable string", function() {
            expect(extract.extractStrings(
                "_('hello ' + 'world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract concatenated translatable string (multilines)", function() {
            expect(extract.extractStrings(
                "_('hello ' +\n'world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract concatenated translatable string with comment in the middle", function() {
            expect(extract.extractStrings(
                "_('hello ' /* everybody */ + 'world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract multiline translatable strings (with escaped \\n)", function() {
            expect(extract.extractStrings(
                "_('hello\\\nworld')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello\nworld");
        });

        it("can extract multiline translatable strings (with escaped \\r\\n)", function() {
            expect(extract.extractStrings(
                "_('hello\\\r\nworld')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello\r\nworld");
        });

        it("can extract translatable strings with replacement", function() {
            expect(extract.extractStrings(
                "_('hello {name}', {name: 'John'})",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello {name}");
        });

        it("can extract translatable strings marked with 'methods' instead of functions", function() {
            expect(extract.extractStrings(
                "Stone.gettext('hello')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("returns the line number of extracted translatable strings", function() {
            expect(extract.extractStrings(
                "\n\n_('hello')",

                ["_", "gettext", "lazyGettext"]
            ).hello).to.contain(3);
        });

        it("can group duplicated translatable string", function() {
            expect(extract.extractStrings(
                "_('hello');\n_('hello');",

                ["_", "gettext", "lazyGettext"]
            ).hello).to.have.length(2);
        });

        it("can handle strings with unicode characters", function() {
            expect(extract.extractStrings(
                "_('⚠ Voici une chaîne avec des caractères spéciaux ☺')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("⚠ Voici une chaîne avec des caractères spéciaux ☺");
        });

    });

});

