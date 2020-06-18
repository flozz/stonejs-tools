// Not translatable

"nope 1";
ngettext_("nope 2", "nope plural 2");
// ngettext("nope 3", "nope plural 3");
/* ngettext("nope 4", "nope plural 4"); */
/*
  ngettext("nope 5", "nope plural 5);
 */
ngettext("nope 6", "nope plural 6" + identifier);


// Translatable

ngettext("translatable 1", "translatable plural 1");
ngettext('translatable 2', 'translatable plural 2');
ngettext (
   "translatable 3",
   "translatable plural 3"
);
foo.ngettext("translatable 4", "translatable plural 4");

ngettext("translatable 5", "translatable plural 5");
lazyNgettext("translatable 6", "translatable plural 6");
foo.ngettext("translatable 7", "translatable plural 7");
bar.lazyNgettext("translatable 8", "translatable plural 8");

ngettext("translatable 9", "translatable plural 9", {});
ngettext("translatable " + "10", "translatable " + "plural " + "10");
ngettext("translatable " + 11, "translatable plural " + 11);
ngettext("translatable " + 0x0C, "translatable plural " + 0x0C);
ngettext("translatable " + 1.4e1, "translatable plural " + 1.4e1);
ngettext("translatable" + " " + "15", "translatable" + " " + "plural" + " " + "15");
ngettext("translatable " /* comment */ + "16", "translatable plural " /* comment */ + "16");
ngettext(
    "trans" +
    "latable " +
    "17",
    "trans" +
    "latable " +
    "plural " +
    "17"
);
ngettext(
    "trans" +
    // "foo" +
    "latable " +
    /* "bar" + */
    "18",
    "trans" +
    // "foo" +
    "latable " +
    /* "bar" + */
    "plural " +
    "18"
);


// Escaped

ngettext("escaped \" 1", "escaped plural \" 1");
ngettext('escaped \' 2', 'escaped plural \' 2');
ngettext("escaped \\ 3", "escaped plural \\ 3");
ngettext("escaped \t 4", "escaped plural \t 4");
ngettext("escaped \n 5", "escaped plural \n 5");
ngettext(
"escaped \
6",
"escaped \
plural \
6"
);
ngettext("escaped \x40 7", "escaped plural \x40 7");  // \x40 = "@"


// Special chars

ngettext("special 1 «↑éÉ☺»", "special plural 1 «↑éÉ☺»");


// Duplicated

ngettext("duplicated", "duplicated plural");
ngettext("duplicated", "duplicated plural");

// Es6

var f = a => ngettext("es6-1", "es6-1 plural");
var {x, y} = {x: ngettext("es6-2", "es6-2 plural"), y: ngettext("es6-3", "es6-3 plural")};
