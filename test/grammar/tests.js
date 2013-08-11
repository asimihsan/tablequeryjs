test( "equality with '='", function() {
    deepEqual(grammar.parse("index = 5"),
              ['EQ', 'index', '5']);
});

test( "equality with '=='", function() {
    deepEqual(grammar.parse("index == 5"),
              ['EQ', 'index', '5']);
});

test( "simple two statements with OR and NOT", function() {
    deepEqual(grammar.parse("index = 5 or not ('first name' = dude)"),
              ['OR',
                ['EQ', 'index', '5'],
                ['NOT', ['EQ', 'first name', 'dude']]]);
});
