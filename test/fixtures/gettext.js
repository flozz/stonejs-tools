// Not translatable

"nope 1";
__("nope 2");
// _("nope 3");
/* _("nope 4"); */
/*
  _("nope 5);
 */
_("nope 6" + identifier);


// Translatable

_("translatable 1");
_('translatable 2');
_ ( 
   "translatable 3"
);
foo._("translatable 4");

gettext("translatable 5");
lazyGettext("translatable 6");
foo.gettext("translatable 7");
bar.lazyGettext("translatable 8");

_("translatable 9", {});
_("translatable " + "10");
_("translatable " + 11);
_("translatable " + 0x0C);
_("translatable " + 015);
_("translatable " + 1.4e1);
_("translatable" + " " + "15");
_("translatable " /* comment */ + "16");
_(
    "trans" +
    "latable " +
    "17"
);
_(
    "trans" +
    // "foo" +
    "latable " +
    /* "bar" + */
    "18"
);


// Escaped

_("escaped \" 1");
_('escaped \' 2');
_("escaped \\ 3");
_("escaped \t 4");
_("escaped \n 5");
_(
"escaped \
6"
);
_("escaped \x40 7");  // \x40 = "@"
_("escaped \043 8");  // \043 = "#"


// Special chars

_("special 1 «↑éÉ☺»");


// Duplicated

_("duplicated");
_("duplicated");
