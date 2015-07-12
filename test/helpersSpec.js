var expect = require("expect.js");

var helpers = require("../src/helpers.js");


describe("helpers:", function() {

    describe("dateFormat", function() {

        it("provides the right date format", function() {
            expect(helpers.dateFormat()).to.match(/^[12][0-9]{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\+[0-9]{4}$/);
        });

    });

});

