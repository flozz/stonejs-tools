// Not translatable

"nope 1";
pgettext_("nope context 2", "nope 2");
// pgettext("nope context 3", "nope 3");
/* pgettext("nope context 4", "nope 4"); */
/*
  pgettext("nope context 5", "nope 5);
 */
pgettext("nope context 6", "nope 6" + identifier);


// Translatable

pgettext("translatable context 1", "translatable 1");
pgettext('translatable context 2', 'translatable 2');
pgettext (
    "translatable context 3",
    "translatable 3"
);
foo.pgettext("translatable context 4", "translatable 4");

pgettext("translatable context 5", "translatable 5");
lazyPgettext("translatable context 6", "translatable 6");
foo.pgettext("translatable context 7", "translatable 7");
bar.lazyPgettext("translatable context 8", "translatable 8");

pgettext("translatable context 9", "translatable 9", {});
pgettext("translatable context " + "10", "translatable " + "10");
pgettext("translatable context " + 11, "translatable " + 11);
pgettext("translatable context " + 0x0c, "translatable " + 0x0C);
pgettext("translatable context " + 1.3e1, "translatable " + 1.3e1);
pgettext("translatable context" + " " + "14", "translatable" + " " + "14");
pgettext("translatable context " + /* comment */ "15", "translatable " /* comment */ + "15");
pgettext(
    "trans" +
    "latable" +
    " conte" +
    "xt 16",
    "trans" +
    "latable " +
    "16"
);
pgettext(
    "trans" +
    // "foo" +
    "latable " +
    /* "bar" + */
    "context " +
    "17",
    "trans" +
    // "foo" +
    "latable " +
    /* "bar" + */
    "17"
);


// Escaped

pgettext("escaped context \" 1", "escaped \" 1");
pgettext('escaped context \' 2', 'escaped \' 2');
pgettext("escaped context \\ 3", "escaped \\ 3");
pgettext("escaped context \t 4", "escaped \t 4");
pgettext("escaped context \n 5", "escaped \n 5");
pgettext(
"escaped context \
6", 
"escaped \
6"
);
pgettext("escaped context \x40 7", "escaped \x40 7");  // \x40 = "@"


// Special chars

pgettext("special context 1 «↑éÉ☺»", "special 1 «↑éÉ☺»");


// Duplicated

pgettext("duplicated context", "duplicated");
pgettext("duplicated context", "duplicated");


// Same string, two contexts

pgettext("context one", "same string");
pgettext("context two", "same string");


// Same context

pgettext("same context", "same 1");
pgettext("same context", "same 2");


// Es6

var f = a => pgettext("es6-context-1", "es6-1");
var {x, y} = {x: pgettext("es6-context-2", "es6-2"), y: pgettext("es6-context-3", "es6-3")};
