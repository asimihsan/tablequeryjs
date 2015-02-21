var x = require('casper').selectXPath;

casper.start('./test/set-filter/index.html', function() {
    casper.waitForSelector('#table_search_text', undefined, undefined, 2000);
});

casper.then(function() {
    this.page.injectJs('lib/jquery/jquery.js');
    this.test.assertExists("#table_search_text");
    this.evaluate(function() {
        tablequery.set_filter("mark", function() {
            $("#trigger1").show();
        });
    });
    this.wait(1000, function() {
        this.capture('test/tablequery-core/test_date_eq_today.png', undefined);
        this.test.assertVisible(x(".//tbody/tr[1]"), "first row visible");
        this.test.assertNotVisible(x(".//tbody/tr[2]"), "second row not visible");
        this.test.assertNotVisible(x(".//tbody/tr[3]"), "third row not visible");
        this.test.assertVisible("#trigger1", "trigger1 visible");
        this.test.assertNotVisible("#trigger2", "trigger2 not visible");
    });
});

casper.run(function() {
    this.test.done();
});
