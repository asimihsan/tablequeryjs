var x = require('casper').selectXPath;

casper.start('./test/tablequery-core/index.html', function() {
    casper.waitForSelector('#table_search_text', undefined, undefined, 2000);
});

casper.then(function() {
    this.page.injectJs('lib/jquery/jquery.js');
    this.test.assertExists("#table_search_text");
    this.evaluate(function() {
        $("#table_search_text").val("mark and mark")
                               .click()
                               .blur();
    });
    this.wait(1000, function() {
        this.capture('test/tablequery-core/test_and_same_row_1.png', undefined);
        this.test.assertVisible(x(".//tbody/tr[1]"), "(round 1) first row visisble");
        this.test.assertNotVisible(x(".//tbody/tr[2]"), "(round 1) second row not visible");
        this.test.assertNotVisible(x(".//tbody/tr[3]"), "(round 1) third row not visible");
    });
});

casper.then(function() {
    // do this again; we memoize _get_rows_to_display so want to confirm memoization works
    this.evaluate(function() {
        $("#table_search_text").val("(mark or jacob) and mark")
                               .click()
                               .blur();
    });
    this.wait(1000, function() {
        this.capture('test/tablequery-core/test_and_same_row_2.png', undefined);
        this.test.assertVisible(x(".//tbody/tr[1]"), "(round 2) first row visisble");
        this.test.assertNotVisible(x(".//tbody/tr[2]"), "(round 2) second row not visible");
        this.test.assertNotVisible(x(".//tbody/tr[3]"), "(round 2) third row not visible");
    });
});

casper.then(function() {
    // do this again; we memoize _get_rows_to_display so want to confirm memoization works
    this.evaluate(function() {
        $("#table_search_text").val("(mark or jacob) and (mark or jacob or larry)")
                               .click()
                               .blur();
    });
    this.wait(1000, function() {
        this.capture('test/tablequery-core/test_and_same_row_3.png', undefined);
        this.test.assertVisible(x(".//tbody/tr[1]"), "(round 3) first row visisble");
        this.test.assertVisible(x(".//tbody/tr[2]"), "(round 3) second row visible");
        this.test.assertNotVisible(x(".//tbody/tr[3]"), "(round 3) third row not visible");
    });
});

casper.run(function() {
    this.test.done();
});
