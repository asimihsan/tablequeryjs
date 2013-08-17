# tablequeryjs

[![Build Status](https://travis-ci.org/asimihsan/tablequeryjs.png?branch=master)](https://travis-ci.org/asimihsan/tablequeryjs)

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

-   Requirements:
    -   jQuery
    -   jQuery UI
-   Include the JS file:

```html
<script src="../build/tablequery.min.js"></script>
```
- Execute:

```
$(document).ready(function() {
    tablequery.set_table("#table");
    tablequery.set_table_search_text("#table_search_text");
});
```

- See `test/example_basic.html` for an example.

### Coloured text box

-   Optionally: if you want the text box to highlight red or green depending
on the correctness of the input then you can include Bootstrap and use a text
box wrapper in a control-group. See `test/example_bootstrap.html` for an
example.

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
cd tablequeryjs
npm install
```

-   Build everything and then run the tests:

```
grunt build
grunt test
```
