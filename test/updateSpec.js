var fs = require("fs");

var expect = require("expect.js");

var update = require("../src/update.js");


describe("stonejs update:", function() {
    var potFile = "test/fixtures/gettext.pot";
    var inputPoFile = "test/fixtures/gettext-fr.po";

    describe("update.updatePo", function() {

        describe("updates the po file", function() {
            var potData = fs.readFileSync(potFile);
            var poData = fs.readFileSync(inputPoFile);

            it("update single message translation", function() {
                expect(update.updatePo(poData, potData))
                    .to.contain('msgstr "traductible 1"')
                    .and.to.contain('msgid "translatable 5"')
                    .and.to.contain('msgid "escaped @ 7"')
                    .and.to.contain('msgid "duplicated"');
                    //.and.to.contain('#~ msgid "removed 1"')
                    //.and.not.to.contain('msgid "removed 1"');
            });
        });

        describe("update plural forms", function() {
            var potFile = "test/fixtures/ngettext.pot";
            var inputPoFile = "test/fixtures/ngettext-cs.po";
            var potData = fs.readFileSync(potFile);
            var poData = fs.readFileSync(inputPoFile);

            it("updates the po file", function() {
                expect(update.updatePo(poData, potData))
                    .to.contain('msgid "horse"')
                    .and.to.contain('msgid_plural "horses"')
                    .and.to.contain('msgstr[0] "kůň"')
                    .and.to.contain('msgstr[1] "koně"')
                    .and.to.contain('msgstr[2] "koní"');
            });

            it("adjust number of plural forms", function() {
                expect(update.updatePo(poData, potData))
                    .to.contain('msgid "apple"')
                    .and.to.contain('msgid_plural "apples"')
                    .and.to.contain('msgstr[0] ""')
                    .and.to.contain('msgstr[1] ""')
                    .and.to.contain('msgstr[2] ""');
            });
        });

        describe("update string with context", function() {
            var potFile = "test/fixtures/pgettext.pot";
            var inputPoFile = "test/fixtures/pgettext-fr.po";
            var potData = fs.readFileSync(potFile);
            var poData = fs.readFileSync(inputPoFile);

            it("updates the po file", function() {
                expect(update.updatePo(poData, potData))
                    .to.contain('msgctxt "object containing data"\nmsgid "File"\nmsgstr ""')
                    .and.to.contain('msgctxt "action of filing a form"\nmsgid "File"\nmsgstr ""');
            });
        });

        describe("update string with context and plural forms", function() {
            var potFile = "test/fixtures/npgettext.pot";
            var inputPoFile = "test/fixtures/npgettext-fr.po";
            var potData = fs.readFileSync(potFile);
            var poData = fs.readFileSync(inputPoFile);

            it("updates the po file", function() {
                expect(update.updatePo(poData, potData))
                    .to.contain('msgctxt "computer file"\nmsgid "File"\nmsgid_plural "Files"\nmsgstr[0] "Fichier"\nmsgstr[1] "Fichiers"')
                    .and.to.contain('msgctxt "object containing data"\nmsgid "File"\nmsgid_plural "Files"\nmsgstr[0] ""\nmsgstr[1] ""');
            });
        });
    });

    describe("update.main", function() {
        var outputPoFile = "__test_fr.po";

        before(function() {
            fs.writeFileSync(outputPoFile, fs.readFileSync(inputPoFile));
        });

        after(function() {
            fs.unlinkSync(outputPoFile);
        });

        it("updates po file from a pot", function(done) {
            update.main([outputPoFile], potFile, {quiet: true}, function() {
                var poData = fs.readFileSync(outputPoFile).toString();
                expect(poData)
                    .to.contain('msgstr "traductible 1"')
                    .and.to.contain('msgid "translatable 5"')
                    .and.to.contain('msgid "escaped @ 7"')
                    .and.to.contain('msgid "duplicated"');
                    //.and.to.contain('#~ msgid "removed 1"')
                    //.and.not.to.contain('msgid "removed 1"');
                done();
            });
        });
    });

});

