var fs = require("fs");

var expect = require("expect.js");

var build = require("../src/build.js");


describe("stonejs build:", function() {
    var poFile = "test/fixtures/gettext-fr.po";

    describe("build.poToJson", function() {
        var poData = fs.readFileSync(poFile);

        it("detects the po file language", function() {
            expect(build.poToJson(poData)).to.have.key("fr");
        });

        it("has the plural forms defined", function() {
            var catalogs = build.poToJson(poData);
            expect(catalogs.fr).to.have.key("plural-forms");
            expect(catalogs.fr["plural-forms"]).to.match(/^\s*nplurals\s*=\s*[0-9]+\s*;\s*plural\s*=\s*.+;\s*/);
            console.log(catalogs);
        });

        it("has the messages", function() {
            var catalogs = build.poToJson(poData);
            expect(catalogs.fr).to.have.key("messages");
            expect(catalogs.fr.messages)
                .to.have.key("translatable 1")
                .and.to.have.key("translatable 2")
                .and.to.have.key("translatable 3")
                .and.to.have.key("translatable 4")
                .and.not.to.have.key("removed 2");
            expect(catalogs.fr.messages["translatable 1"]).to.contain("traductible 1");
        });

    });

});

