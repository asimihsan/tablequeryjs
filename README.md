# tablequeryjs

Use textual queries to filter tables.

-   Execute arbitrarily complex queries, using parenthesis and logical operators.
-   Confirm the validity of queries in real time; indicated as a coloured outline around the search field.
-   Execute queries on any column name.
-   Re-use old queries; the last five queries are persisted and available via a dropdown.

## Example

See the HTML example page online here:

[http://www.asimihsan.com.s3.amazonaws.com/tablequeryjs/test/basic_example.html](http://www.asimihsan.com.s3.amazonaws.com/tablequeryjs/test/basic_example.html)

## Screencast

[![ScreenShot](https://raw.github.com/asimihsan/tablequeryjs/master/doc/tablequeryjs_screencast.jpg)](http://youtu.be/d0VV6Wlj0aM)

## Usage

See `test/basic_example.html` for how to use. In short:

-   Need:
    -   JQuery JS
    -   JQuery UI JS + CSS
    -   Bootstrap CSS
    -   Lodash JS
    -   Modernizr JS
-   Use a standard HTML5 table with headers and rows.
-   Use a text box wrapper in a control-group.
-   Include in the correct order, then finally execute:

```
$(document).ready(function() {
    tablequery.set_table("#table");
    tablequery.set_table_search_text("#table_search_text");
});
```

## Syntax

Chain together queries with logical operators, i.e.

```
COLUMN_NAME COMPARISON_OPERATOR VALUE

COLUMN_NAME COMPARISON_OPERATOR VALUE LOGICAL_OPERATOR COLUMN_NAME COMPARISON_OPERATOR VALUE
```

-   Both `COLUMN_NAME` and `VALUE` are literals; you may either surround them in single or double quotes or type as-is.
  -     For columns with spaces in their names you must specify them with quotes, just as with SQL.
-   Column names are case insensitive.
-   The following are valid comparison operators:
    -   `LIKE`, `~`: case sensitive regular expression match.
    -   `ILIKE`, `~*`: case insensitive regular expression match.

## Testing

-   Clone the repo:

```
git clone git@github.com:asimihsan/tablequeryjs.git
```

-   Install the pre-requisites for being able to build the `jison` grammars:

```
brew update
brew install npm
npm install jison -g
```

-   Build the `jison` grammar and test it to make sure it works from the console:

```
$ jison grammar.jison; echo "index = 5" > testgrammar; node grammar.js testgrammar
[ 'EQ', 'index', '5' ]

$ jison grammar.jison; echo "index = 5 or not ('first name' = dude)" > testgrammar; node grammar.js testgrammar
[ 'OR',
  [ 'EQ', 'index', '5' ],
  [ 'NOT', [ 'EQ', 'first name', 'dude' ] ] ]

$ jison grammar.jison; closure-compiler --js grammar.js --js_output_file grammar.min.js; echo "index = 5 && !('first name' == dude)" > testgrammar; node grammar.min.js testgrammar
grammar.js:238: WARNING - unreachable code
    return true;
    ^

0 error(s), 1 warning(s)
[ 'AND',
  [ 'EQ', 'index', '5' ],
  [ 'NOT', [ 'EQ', 'first name', 'dude' ] ] ]
```

-   Open the HTML test page in a web browser and confirm the following filters work:

```
'first name' ilike Mark
'first name' like r
'first name' like Mark or number = 3
number = 3
number == 3
not number == 3
not 'first name' ilike mark
not ('first name' ilike mark or number = 2)
```
