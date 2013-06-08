# tablequeryjs

Use textual queries to filter tables. See the HTML example page online here:

[http://www.asimihsan.com.s3-website-eu-west-1.amazonaws.com/tablequeryjs/test/basic_example.html](http://www.asimihsan.com.s3-website-eu-west-1.amazonaws.com/tablequeryjs/test/basic_example.html)

## Usage

-   Clone the repo:

```
git clone git@github.com:asimihsan/tablequeryjs.git
```

-   Install the pre-requisites for being able to build the `jison` grammars:

```
brew update
brew install npm
npm install jison -g
```

-   Build the `jison` grammar and test it to make sure it works from the console:

```
$ jison grammar.jison; echo "index = 5" > testgrammar; node grammar.js testgrammar
[ 'EQ', 'index', '5' ]

$ jison grammar.jison; echo "index = 5 or not ('first name' = dude)" > testgrammar; node grammar.js testgrammar
[ 'OR',
  [ 'EQ', 'index', '5' ],
  [ 'NOT', [ 'EQ', 'first name', 'dude' ] ] ]
```

-   Open the HTML test page in a web browser and confirm the following filters work:

```
'first name' ilike Mark
'first name' like r
'first name' like Mark or number = 3
number = 3
number == 3
not number == 3
not 'first name' ilike mark
not ('first name' ilike mark or number = 2)
```
