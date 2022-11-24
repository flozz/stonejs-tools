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
            expect(catalogs.fr.messages["translatable 1"]['*'][0]).to.contain("traductible 1");
        });

        describe("plural form messages", function() {
            var poFile = "test/fixtures/ngettext-cs.po";
            var poData = fs.readFileSync(poFile);
            it("has the plural messages", function() {
                var catalogs = build.poToJson(poData);
                expect(catalogs.cs).to.have.key("messages");
                expect(catalogs.cs.messages)
                    .to.have.key("horse");
                expect(catalogs.cs.messages.horse['*']).to.contain("kůň")
                    .and.to.contain("koně")
                    .and.to.contain("koní");
            });
        });

        describe("context from message", function() {
            var poFile = "test/fixtures/pgettext-fr.po";
            var poData = fs.readFileSync(poFile);
            it("has multiple context keys for a given string", function() {
                var catalogs = build.poToJson(poData);
                expect(catalogs.fr).to.have.key("messages");
                expect(catalogs.fr.messages).to.have.key("Back");
                expect(catalogs.fr.messages.Back).to.have.keys("going back in a menu", "back of an object");
                expect(catalogs.fr.messages.Back["going back in a menu"]).to.contain("Retour");
                expect(catalogs.fr.messages.Back["back of an object"]).to.contain("Arrière");
            });
        });

        describe("context with plural form", function() {
            var poFile = "test/fixtures/npgettext-fr.po";
            var poData = fs.readFileSync(poFile);
            it("has the plural messages", function() {
                var catalogs = build.poToJson(poData);
                expect(catalogs.fr).to.have.key("messages");
                expect(catalogs.fr.messages).to.have.key("File");
                expect(catalogs.fr.messages.File).to.have.keys("computer file", "*");
                expect(catalogs.fr.messages.File["computer file"])
                    .to.contain("Fichier")
                    .and.to.contain("Fichiers");
            });
            it("can have a non contextual string with the same id as a contextual one", function() {
                var catalogs = build.poToJson(poData);
                expect(catalogs.fr.messages.File["*"]).to.contain("Fichier");
            });
        });

    });

    describe("build.main", function() {
        var poFiles = [
            "test/fixtures/gettext-fr.po",
            "test/fixtures/gettext-it.po"
        ];

        before(function() {
            for (var i=0 ; i<poFiles.length ; i++) {
                fs.writeFileSync("__test_po_" + i + ".po", fs.readFileSync(poFiles[i]));
            }
        });

        after(function() {
            for (var i=0 ; i<poFiles.length ; i++) {
                fs.unlinkSync("__test_po_" + i + ".po");
            }
        });

        it("generates separated json files", function(done) {
            build.main(["__test_po_*.po"], "./", {quiet: true, merge: false, format: "json"}, function() {
                expect(fs.statSync("fr.json").isFile()).to.be.ok();
                expect(fs.statSync("it.json").isFile()).to.be.ok();

                fs.unlinkSync("fr.json");
                fs.unlinkSync("it.json");

                done();
            });
        });

        it("generates separated javascript files", function(done) {
            build.main(["__test_po_*.po"], "./", {quiet: true, merge: false, format: "javascript"}, function() {
                expect(fs.statSync("fr.js").isFile()).to.be.ok();
                expect(fs.statSync("it.js").isFile()).to.be.ok();

                fs.unlinkSync("fr.js");
                fs.unlinkSync("it.js");

                done();
            });
        });

        it("generates merged json file", function(done) {
            build.main(["__test_po_*.po"], "__test_catalog.json", {quiet: true, merge: true, format: "json"}, function() {
                expect(fs.statSync("__test_catalog.json").isFile()).to.be.ok();

                fs.unlinkSync("__test_catalog.json");

                done();
            });
        });

        it("generates merged javascript file", function(done) {
            build.main(["__test_po_*.po"], "__test_catalog.js", {quiet: true, merge: true, format: "jsavascript"}, function() {
                expect(fs.statSync("__test_catalog.js").isFile()).to.be.ok();

                fs.unlinkSync("__test_catalog.js");

                done();
            });
        });
    });

});

