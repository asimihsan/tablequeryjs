var casper = require('casper').create({
    clientScripts: ["lib/jquery/jquery.js"]
});
var x = require('casper').selectXPath;

casper.start('./test/tablequery-core/index.html', function() {
    casper.waitForSelector('#table_search_text', undefined, undefined, 2000);
});

casper.then(function() {
    this.test.assertExists("#table_search_text");
    this.evaluate(function() {
        $("#table_search_text").val("ar")
                               .click()
                               .blur();
    });
    this.wait(1000, function() {
        this.capture('test/tablequery-core/test_ilike_any.png', undefined);
        this.test.assertVisible(x(".//tbody/tr[1]"), "first row visisble");
        this.test.assertNotVisible(x(".//tbody/tr[2]"), "second row not visible");
        this.test.assertVisible(x(".//tbody/tr[3]"), "third row visible");
    });
});

casper.run(function() {
    this.test.renderResults(true);
    this.test.done();
});
