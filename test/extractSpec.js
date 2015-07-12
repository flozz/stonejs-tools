var expect = require("expect.js");

var extract = require("../src/extract.js");


describe("stonejs extract:", function() {

    describe("extract.extractJsStrings", function() {

        it("do not extract not translatable strings", function() {
            expect(extract.extractJsStrings(
                "'hello';\nfoo('hello');bar_(\"hello\")",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("do not extract commented translatable strings (// comment)", function() {
            expect(extract.extractJsStrings(
                "// _('hello')",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("do not extract commented translatable strings (/* comment */)", function() {
            expect(extract.extractJsStrings(
                "/*\n * _('hello')\n */",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("ignore translatable string concatenated with an idenifier", function() {
            expect(extract.extractJsStrings(
                "_('hello' + identifier)",

                ["_", "gettext", "lazyGettext"]
            )).not.to.have.key("hello");
        });

        it("can extract simple translatable string (single quote)", function() {
            expect(extract.extractJsStrings(
                "_('hello')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("can extract simple translatable string (double quote)", function() {
            expect(extract.extractJsStrings(
                "_(\"hello\")",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("can extract simple translatable string (with fuzzy whitespaces)", function() {
            expect(extract.extractJsStrings(
                "_(\t\n \"hello\"  )",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("can extract translatable string with escaped quote", function() {
            expect(extract.extractJsStrings(
                "_('rock \\'n roll')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("rock 'n roll");
        });

        it("can extract translatable string with hexadecimal escaped char", function() {
            expect(extract.extractJsStrings(
                "_('hello\\x40world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello@world");
        });

        it("can extract translatable string with octal escaped char", function() {
            expect(extract.extractJsStrings(
                "_('hello\\043world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello#world");
        });

        it("can extract concatenated translatable string", function() {
            expect(extract.extractJsStrings(
                "_('hello ' + 'world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract translatable string concatenated with integer", function() {
            expect(extract.extractJsStrings(
                "_('hello ' + 8)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 8");

            expect(extract.extractJsStrings(
                "_('hello ' + 8.0)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 8");

            expect(extract.extractJsStrings(
                "_('hello ' + 10e3)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 10000");
        });

        it("can extract translatable string concatenated with integer (hexa)", function() {
            expect(extract.extractJsStrings(
                "_('hello ' + 0xFF)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 255");
        });

        it("can extract translatable string concatenated with integer (octal)", function() {
            expect(extract.extractJsStrings(
                "_('hello ' + 015)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 13");
        });

        it("can extract translatable string concatenated with float", function() {
            expect(extract.extractJsStrings(
                "_('hello ' + 3.14)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 3.14");

            expect(extract.extractJsStrings(
                "_('hello ' + .3)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 0.3");

            expect(extract.extractJsStrings(
                "_('hello ' + 10e-3)",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello 0.01");
        });

        it("can extract concatenated translatable string (multilines)", function() {
            expect(extract.extractJsStrings(
                "_('hello ' +\n'world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract concatenated translatable string with comment in the middle", function() {
            expect(extract.extractJsStrings(
                "_('hello ' /* everybody */ + 'world')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract multiline translatable strings (with escaped \\n)", function() {
            expect(extract.extractJsStrings(
                "_('hello \\\nworld')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract multiline translatable strings (with escaped \\r\\n)", function() {
            expect(extract.extractJsStrings(
                "_('hello \\\r\nworld')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello world");
        });

        it("can extract translatable strings with replacement", function() {
            expect(extract.extractJsStrings(
                "_('hello {name}', {name: 'John'})",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello {name}");
        });

        it("can extract translatable strings marked with 'methods' instead of functions", function() {
            expect(extract.extractJsStrings(
                "Stone.gettext('hello')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("hello");
        });

        it("returns the line number of extracted translatable strings", function() {
            expect(extract.extractJsStrings(
                "\n\n_('hello')",

                ["_", "gettext", "lazyGettext"]
            ).hello).to.contain(3);
        });

        it("can group duplicated translatable string", function() {
            expect(extract.extractJsStrings(
                "_('hello');\n_('hello');",

                ["_", "gettext", "lazyGettext"]
            ).hello).to.have.length(2);
        });

        it("can handle strings with unicode characters", function() {
            expect(extract.extractJsStrings(
                "_('⚠ Voici une chaîne avec des caractères spéciaux ☺')",

                ["_", "gettext", "lazyGettext"]
            )).to.have.key("⚠ Voici une chaîne avec des caractères spéciaux ☺");
        });

    });

    describe("extract.generatePo", function() {

        var strings = {
            "hello": [{file: "foo.js", line: 1}],
            "world": [{file: "foo.js", line: 2}, {file: "foobaz.js", line: 42}]
        };

        it("generates the po file", function() {
            expect(extract.generatePo(strings))
                .to.contain('#: foo.js:1')
                .and.to.contain('msgid "hello"')
                .and.to.contain('#: foo.js:2')
                .and.to.contain('#: foobaz.js:42')
                .and.to.contain('msgid "world"');
        });

    });

});

