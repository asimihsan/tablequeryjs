test( "equality with '='", function() {
    deepEqual(parser.parse("index = 5"),
              ['EQ', 'index', '5']);
});

test( "equality with '=='", function() {
    deepEqual(parser.parse("index == 5"),
              ['EQ', 'index', '5']);
});

test( "inequality with '!='", function() {
    deepEqual(parser.parse("index != 5"),
              ['NEQ', 'index', '5']);
});

test( "inequality with NOT and '='", function() {
    deepEqual(parser.parse("not index = 5"),
              ['NOT',
                ['EQ', 'index', '5']]);
});

test( "simple two statements with OR and NOT", function() {
    deepEqual(parser.parse("index = 5 or not ('first name' = dude)"),
              ['OR',
                ['EQ', 'index', '5'],
                ['NOT', ['EQ', 'first name', 'dude']]]);
});

test( "any column with ident literal", function() {
    deepEqual(parser.parse("index"),
              ['ILIKE_ANY', 'index']);
});

test( "any column with single quoted literal", function() {
    deepEqual(parser.parse("'fruity foobar'"),
              ['ILIKE_ANY', "fruity foobar"]);
});

test( "any column with double quoted literal", function() {
    deepEqual(parser.parse('"fruity foobar"'),
              ['ILIKE_ANY', "fruity foobar"]);
});
