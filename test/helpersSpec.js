var expect = require("expect.js");

var helpers = require("../src/helpers.js");


describe("helpers:", function() {

    describe("dateFormat", function() {

        it("provides the right date format", function() {
            expect(helpers.dateFormat()).to.match(/^[12][0-9]{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\+[0-9]{4}$/);
        });

    });

    describe("isFile", function() {

        it("returns false if the file does not exist", function() {
            expect(helpers.isFile("__test_foobar")).to.not.be.ok();
        });

        it("returns false if it is a directory", function() {
            expect(helpers.isFile("test")).to.not.be.ok();
        });

        it("returns true if the file exists", function() {
            expect(helpers.isFile("test/fixtures/gettext.pot")).to.be.ok();
        });

    });

    describe("isDir", function() {

        it("returns false if the directory does not exist", function() {
            expect(helpers.isDir("__test_foobar")).to.not.be.ok();
        });

        it("returns false if it is a file", function() {
            expect(helpers.isDir("test/fixtures/gettext.pot")).to.not.be.ok();
        });

        it("returns true if the directory exists", function() {
            expect(helpers.isDir("test")).to.be.ok();
        });

    });

});
