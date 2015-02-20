var x = require('casper').selectXPath;

casper.start('./test/git-commit-token/index.html', function() {
    casper.waitForSelector('#table_search_text', undefined, undefined, 2000);
});

casper.then(function() {
    this.page.injectJs('lib/jquery/jquery.js');
    this.test.assertExists("#table_search_text");
    this.evaluate(function() {
        $("#table_search_text").val("xxx")
                               .click()
                               .blur();
    });
    this.wait(1000, function() {
        this.test.assertVisible(x(".//tbody/tr[1]"), "first row visible");
        this.test.assertVisible(x(".//tbody/tr[2]"), "second row visible");
    });
});

casper.run(function() {
    this.test.done();
});
