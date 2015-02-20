var x = require('casper').selectXPath;

casper.start('./test/tablequery-core-robustness/index.html', function() {
    casper.waitForSelector('#table_search_text', undefined, undefined, 2000);
});

casper.then(function() {
    this.page.injectJs('lib/jquery/jquery.js');
    this.test.assertExists("#table_search_text");
    this.evaluate(function() {
        $("#table_search_text").val("number = 1")
                               .click()
                               .blur();
    });
    this.wait(1000, function() {
        this.capture('test/tablequery-core-robustness/test_simple_eq.png', undefined);
        this.test.assertVisible(x(".//tbody/tr[1]"), "first row visisble");
        this.test.assertNotVisible(x(".//tbody/tr[2]"), "second row not visible");
        this.test.assertNotVisible(x(".//tbody/tr[3]"), "third row not visible");
    });
});

casper.run(function() {
    this.test.done();
});
