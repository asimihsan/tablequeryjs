# tablequeryjs

[![Build Status](https://travis-ci.org/asimihsan/tablequeryjs.png?branch=master)](https://travis-ci.org/asimihsan/tablequeryjs)

Use textual queries to filter tables.

-   Execute arbitrarily complex queries, using parenthesis and logical operators.
-   Confirm the validity of queries in real time; indicated as a coloured outline around the search field.
-   Execute queries on any column name.
-   Search on ISO 8601 formatted datetime fields (i.e. `YYYY-MM-DD HH:mm:ss`,
with the `T` separator as optional and the timezone as optional), for example:
    -   `datetime = today`
    -   `datetime = yesterday`
    -   `datetime > 2013-08-01`
-   Search on `HH:mm:ss` time fields, for example:
    -   `time = 1` (equal to one second)
    -   `time > 2` (greater than two seconds)
    -   `time < 01:00` (smaller than one minute)

## Example

See the HTML example page online here:

[http://www.asimihsan.com.s3.amazonaws.com/tablequeryjs/test/example_basic.html](http://www.asimihsan.com.s3.amazonaws.com/tablequeryjs/test/example_basic.html)

## Basic usage

See `test/basic_example.html` for how to use. In short:

-   Requirements:
    -   jQuery

```html
<script src="http://cdn.jsdelivr.net/jquery.tablequeryjs/0.1.4/tablequery.min.js"></script>
<script type="text/javascript">
  $(document).ready(function() {
    tablequery.set_table("#table");
    tablequery.set_table_search_text("#table_search_text");
  });
</script>
```

## Events

tablequeryjs allows you to specify functions to be called when actions are
performed.

The following events are supported:

- `search`: whenever a search is executed by tablequeryjs. Both successful
and unsuccessful searches trigger this, and searches that do not alter the
visibility of the table's rows are also triggered.

Here is an example of using the `search` event to trigger two anonymous
functions, one after the other.

```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="../../build/tablequery.min.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        tablequery.set_table("#table");
        tablequery.set_table_search_text("#table_search_text");

        $("#trigger1").hide();
        $("#trigger2").hide();
        tablequery.on('search', function() {
            console.log("search triggered (1)");
            $("#trigger1").show();  
        });
        tablequery.on('search', function() {
            console.log("search triggered (2)");
            $("#trigger2").show();  
        });
    });
</script>
```

The above code will call two anonymous functions when a search is executed.
The first function shows `#trigger1`, and the second function shows
`#trigger2`.

tablequeryjs uses [Backbone.Events](http://documentcloud.github.io/backbone/docs/backbone.html#section-13),
and as such also supports `off`, `once`, `trigger`, and `listenTo`. See the
annotated Backbone.Events source for more information.

## Search syntax

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
