# Stone.js Tools

[![Lint and test](https://github.com/flozz/stonejs-tools/actions/workflows/tests.yml/badge.svg)](https://github.com/flozz/stonejs-tools/actions/workflows/tests.yml)
[![NPM Version](http://img.shields.io/npm/v/stonejs-tools.svg?style=flat)](https://www.npmjs.com/package/stonejs-tools)
[![License](http://img.shields.io/npm/l/stonejs-tools.svg?style=flat)](https://github.com/flozz/stonejs-tools/blob/master/LICENSE)
[![Discord](https://img.shields.io/badge/chat-Discord-8c9eff?logo=discord&logoColor=ffffff)](https://discord.gg/P77sWhuSs4)

Tools for extracting/compiling translatable strings from Javascript/HTML sources.


## Getting Started

To start using the Stone.js tools, you first have to install them **globally**:

    npm install -g stonejs-tools


## Internationalization

See the Stone.js documentation to learn how to internationalize your application:

* https://github.com/flozz/stone.js


## Extracting Translatable Strings

To extract translatable strings from your Javascript and HTML sources, you should use the `stonejs extract` command:

    stonejs extract [options] <source js/html> <output pot>

* `<source js/html>`: all Javascript and HTML files from which translatable string will be extracted (globbing allowed)
* `<output pot>`: the output translation template (`.pot`)

The available options are:

* `--funtions`: list of the `gettext` function names (default=`_,gettext,lazyGettext`)
* `--pluralFunctions`: list of the `ngettext` function names  (default=`ngettext,lazyNgettext`)
* `--contextFunctions`: list of the `pgettext` function names  (default=`pgettext,lazyPgettext`)
* `--pluralContextFunctions`: list of the `npgettext` function names  (default=`npgettext,lazyNpgettext`)
* `--quiet`, `-q`: do not output progress log to stdout

Examples:

    stonejs extract "src/**/*.js" locales/catalog.pot

    stonejs extract --functions="_,gettext,lazyGettext" "src/**/*.js" "*.html" locales/catalog.pot


## Translating to a New Language

To start translating to a new langage, just copy the translation template file (`.pot`) and update the `Language` and the `Plural-Forms` fields.

### Example: translating to French

First copy the `.pot` file:

    cp locales/catalog.pot locales/fr.po

Then edit it:

    "Language: fr\n"
    "Plural-Forms: nplurals=2; plural=(n > 1);\n"

**NOTE:** A list of plural forms for many languages is is available here:

* http://localization-guide.readthedocs.org/en/latest/l10n/pluralforms.html


## Updating Translations

If you have already translated your app but you have new strings to translate, you can update your `.po` files to add the new strings to them.

First, extract again your translatable strings to recreate the translation template file (`.pot`) with the `stonejs extract` command (see above).

Then you can update your translation files (`.po`) using the `stonejs update` command:

    stonejs update [options] <po files> <source pot>

* `<po files>`: translation files (`.po`) to update (globbing allowed)
* `<source pot>`: the source translation template (`.pot`)

The available options are:

* `--quiet`, `-q`: do not output progress log to stdout

Example:

    stonejs locales/*.po locales/catalog.pot


## Building Translations

To be used by Stone.js, your translation must be built into one ore more JSON or Javascript files using the `stonejs build` command:

    stonejs build [options] <po files> <output>

* `<po files>`: translation files (`.po`) to build (globbing allowed)
* `<output>`: The output directory where built files will be created (or **output file** if you used the `--merge` option)

The available options are:

* `--merge`: Merge all languages into a single file (default: false)
* `--format`: The output format: `json`, `javascript` or `js` (default: json)
* `--quiet`, `-q`: do not output progress log to stdout

Examples:

    stonejs build --format=json locales/*.po locales

    stonejs build --merge locales/*.po locales/catalogs.json

    stonejs build --format=js --merge locales/*.po locales/catalogs.js


## Support this project

Want to support this project?

* [☕️ Buy me a coffee](https://www.buymeacoffee.com/flozz>)
* [💵️ Give me a tip on PayPal](https://www.paypal.me/0xflozz>)
* [❤️ Sponsor me on GitHub](https://github.com/sponsors/flozz>)


## Changelog

* **[NEXT]** (changes on `master` but not released yet):

  * Added support of string with context (`pgettext`, `npgettext`,...) (@Krenodeno, #32)
  * Updated dependencies

* **v1.4.0:** Update JS parser and enable latest ES syntaxes
* **v1.3.0:** Add the line and the column of syntax errors (#25)

* **v1.2.0:**

  * Support of plurals (`ngettext()`) (@jbghoul, #11)
  * Support of `gettext_noop()` (@jbghoul, #16)
  * Update dependencies

* **v1.1.0:**

  * ES6 modules (import / export) support
  * JSX support
  * dependencies updates
  * WARNING: octal literals are not supported anymore!

* **v1.0.8:** Adds the `.twig` extention as HTML file list
* **v1.0.7:** Allows string to be extracted from es2015 (ES6) sources
* **v1.0.6:** Force encoding to UTF-8 when reading/writing files
* **v1.0.5:** Fixes crashes with wrong call of logging functions
* **v1.0.4:** Fixes path issue on Window (issue #2)
* **v1.0.3:** Fixes crash when the merged po file does not contain line references
* **v1.0.2:**

  * Fixes crash when parsing js files containing syntax errors
  * Reporting improved (extracted string ans skipped files count, syntax errors)

* **v1.0.1:** Makes stonejs command working on Unix
* **v1.0.0:** First Release
