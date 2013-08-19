# tablequeryjs

[![Build Status](https://travis-ci.org/asimihsan/tablequeryjs.png?branch=master)](https://travis-ci.org/asimihsan/tablequeryjs)

Use textual queries to filter tables.

-   Execute arbitrarily complex queries, using parenthesis and logical operators.
-   Confirm the validity of queries in real time; indicated as a coloured outline around the search field.
-   Execute queries on any column name.
-   Re-use old queries; the last five queries are persisted and available via a dropdown.

## Example

See the HTML example page online here:

[http://www.asimihsan.com.s3.amazonaws.com/tablequeryjs/test/example_basic.html](http://www.asimihsan.com.s3.amazonaws.com/tablequeryjs/test/example_basic.html)

## Screencast

[![ScreenShot](https://raw.github.com/asimihsan/tablequeryjs/master/doc/tablequeryjs_screencast.jpg)](http://youtu.be/d0VV6Wlj0aM)

## Usage

See `test/basic_example.html` for how to use. In short:

-   Requirements:
    -   jQuery
    -   jQuery UI

```html
<link href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" rel="stylesheet">

<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script src="http://cdn.jsdelivr.net/jquery.tablequeryjs/0.1.3/tablequery.min.js"></script>
<script type="text/javascript">
  $(document).ready(function() {
    tablequery.set_table("#table");
    tablequery.set_table_search_text("#table_search_text");
  });
</script>
```

See `test/example_basic.html` for an example.

In order to build the library see "Building and testing" below.

## Syntax

Chain together queries with logical operators, i.e.

```
COLUMN_NAME COMPARISON_OPERATOR VALUE

COLUMN_NAME COMPARISON_OPERATOR VALUE LOGICAL_OPERATOR COLUMN_NAME COMPARISON_OPERATOR VALUE
```

-   Both `COLUMN_NAME` and `VALUE` are literals; you may either surround them in single or double quotes or type as-is.
  -     For columns with spaces in their names you must specify them with quotes, just as with SQL.
-   Column names are case insensitive.
-   The following are valid comparison operators; operators on the same bullet
are equivalent:
    -   `EQ`, `=`, `==`: strict equality (e.g. "Mar" doesn't equal "Mark").
    -   `LIKE`, `~`: case sensitive regular expression match.
    -   `ILIKE`, `~*`: case insensitive regular expression match.
- Each of the above operators can be negated:
    -   `NEQ`, `!=`: strict inequality
    -   `NLIKE`, `!~`: case sensitive regular expression non-match.
    -   `NILIKE`, `!~*`: case insensitive regular expression non-match.
-   You can group expressions using logical operators and parentheses, e.g.
    -   `number = 5 OR number = 6`
    -   `(number = 5 OR number = 6) and ((( name = 'Mark' )))`

## Building and testing

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
