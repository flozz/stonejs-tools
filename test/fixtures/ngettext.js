// Not translatable

"nope 1";
N__("nope 2", "nope plural 2");
// N_("nope 3", "nope plural 3");
/* N_("nope 4", "nope plural 4"); */
/*
  N_("nope 5", "nope plural 5);
 */
N_("nope 6", "nope plural 6" + identifier);


// Translatable

N_("translatable 1", "translatable plural 1");
N_('translatable 2', 'translatable plural 2');
N_ (
   "translatable 3",
   "translatable plural 3"
);
foo.N_("translatable 4", "translatable plural 4");

ngettext("translatable 5", "translatable plural 5");
lazyNgettext("translatable 6", "translatable plural 6");
foo.ngettext("translatable 7", "translatable plural 7");
bar.lazyNgettext("translatable 8", "translatable plural 8");

N_("translatable 9", "translatable plural 9", {});
N_("translatable " + "10", "translatable " + "plural " + "10");
N_("translatable " + 11, "translatable plural " + 11);
N_("translatable " + 0x0C, "translatable plural " + 0x0C);
N_("translatable " + 1.4e1, "translatable plural " + 1.4e1);
N_("translatable" + " " + "15", "translatable" + " " + "plural" + " " + "15");
N_("translatable " /* comment */ + "16", "translatable plural " /* comment */ + "16");
N_(
    "trans" +
    "latable " +
    "17",
    "trans" +
    "latable " +
    "plural " +
    "17"
);
N_(
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

N_("escaped \" 1", "escaped plural \" 1");
N_('escaped \' 2', 'escaped plural \' 2');
N_("escaped \\ 3", "escaped plural \\ 3");
N_("escaped \t 4", "escaped plural \t 4");
N_("escaped \n 5", "escaped plural \n 5");
N_(
"escaped \
6",
"escaped \
plural \
6"
);
N_("escaped \x40 7", "escaped plural \x40 7");  // \x40 = "@"


// Special chars

N_("special 1 «↑éÉ☺»", "special plural 1 «↑éÉ☺»");


// Duplicated

N_("duplicated", "duplicated plural");
N_("duplicated", "duplicated plural");

// Es6

var f = a => N_("es6-1", "es6-1 plural");
var {x, y} = {x: N_("es6-2", "es6-2 plural"), y: N_("es6-3", "es6-3 plural")};
