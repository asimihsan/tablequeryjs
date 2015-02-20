var x = require('casper').selectXPath;

casper.start('./test/dependency-leakage/index.html', function() {
    casper.waitForSelector('#table_search_text', undefined, undefined, 2000);
});

casper.then(function() {
    this.test.assertEvalEquals(function() {
        return typeof _ === 'undefined';
    }, true, 'Lodash is leaking to global scope.');
});

casper.run(function() {
    this.test.done();
});
