// Not translatable

"nope 1";
npgettext_("nope context 2", "nope 2", "nope plural 2");
// npgettext("nope context 3", "nope 3", "nope plural 3");
/* npgettext("nope context 4", "nope 4", "nope plural 4"); */
/*
  npgettext("nope context 5", "nope 5", "nope plural 5);
 */
npgettext("nope context 6", "nope 6", "nope plural 6" + identifier);


// Translatable

npgettext("translatable context 1", "translatable 1", "translatable plural 1");
npgettext('translatable context 2', 'translatable 2', 'translatable plural 2');
npgettext (
    "translatable context 3",
    "translatable 3",
    "translatable plural 3"
);
foo.npgettext("translatable context 4", "translatable 4", "translatable plural 4");

npgettext("translatable context 5", "translatable 5", "translatable plural 5");
lazyNpgettext("translatable context 6", "translatable 6", "translatable plural 6");
foo.npgettext("translatable context 7", "translatable 7", "translatable plural 7");
bar.lazyNpgettext("translatable context 8", "translatable 8", "translatable plural 8");

npgettext("translatable context 9", "translatable 9", "translatable plural 9", {});
npgettext("translatable context " + "10", "translatable " + "10", "translatable " + "plural " + "10");
npgettext("translatable context " + 11, "translatable " + 11, "translatable plural " + 11);
npgettext("translatable context " + 0x0C, "translatable " + 0x0C, "translatable plural " + 0x0C);
npgettext("translatable context " + 1.3e1, "translatable " + 1.3e1, "translatable plural " + 1.3e1);
npgettext("translatable context" + " " + "14", "translatable" + " " + "14", "translatable" + " " + "plural" + " " + "14");
npgettext("translatable context " /* comment */ + "15", "translatable " /* comment */ + "15", "translatable plural " /* comment */ + "15");
npgettext(
    "trans" +
    "latable " +
    "context " +
    "16",
    "trans" +
    "latable " +
    "16",
    "trans" +
    "latable " +
    "plural " +
    "16"
);
npgettext(
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
    "17",
    "trans" +
    // "foo" +
    "latable " +
    /* "bar" + */
    "plural " +
    "17"
);


// Escaped

npgettext("escaped context \" 1", "escaped \" 1", "escaped plural \" 1");
npgettext("escaped context \' 2", 'escaped \' 2', 'escaped plural \' 2');
npgettext("escaped context \\ 3", "escaped \\ 3", "escaped plural \\ 3");
npgettext("escaped context \t 4", "escaped \t 4", "escaped plural \t 4");
npgettext("escaped context \n 5", "escaped \n 5", "escaped plural \n 5");
npgettext(
"escaped \
context \
6", 
"escaped \
6",
"escaped \
plural \
6"
);
npgettext("escaped context \x40 7", "escaped \x40 7", "escaped plural \x40 7");  // \x40 = "@"


// Special chars

npgettext("special context 1", "special 1 «↑éÉ☺»", "special plural 1 «↑éÉ☺»");


// Duplicated

npgettext("duplicated context", "duplicated", "duplicated plural");
npgettext("duplicated context", "duplicated", "duplicated plural");

// Same context

npgettext("same context", "same 1", "same plural 1");
npgettext("same context", "same 2", "same plural 2");

// Es6

var f = a => npgettext("es6-context-1", "es6-1", "es6-1 plural");
var {x, y} = {x: npgettext("es6-context-2", "es6-2", "es6-2 plural"), y: npgettext("es6-context-3", "es6-3", "es6-3 plural")};
