module.exports = function(grunt) {
    // Project config
    grunt.initConfig({
        shell: {
            jison: {
                command: [
                    'mkdir -p build',
                    'jison src/grammar.jison --module-type js --outfile build/grammar.js',
                ].join('&& '),
                options: {
                    stdout: true
                }
            },
            merge: {
                command: [
                    'rm -f build/tablequery.js',
                    'touch build/tablequery.js',
                    'cat bower_components/moment/moment.js >> build/tablequery.js',
                    'cat bower_components/moment-range/lib/moment-range.js >> build/tablequery.js',
                    'cat build/lodash.custom.js >> build/tablequery.js',
                    'cat src/vendor/backbone.events.js >> build/tablequery.js',
                    'cat build/grammar.js >> build/tablequery.js',
                    'cat src/tablequery-core.js >> build/tablequery.js',
                ].join('&& '),
                options: {
                    stdout: true
                }
            },
            minify: {
                command: 'ccjs build/tablequery.js > build/tablequery.min.js',
                options: {
                    stdout: true
                }
            },
            casperjs: {
                command: [
                    "casperjs test --direct --log-level=debug test/tablequery-core/test_simple_eq.js",
                    "casperjs test --direct --log-level=debug test/tablequery-core/test_simple_or.js"
                ].join('&& '),
                options: {
                    stdout: true
                }
            },
        },
        qunit: {
            files: ['test/grammar/tests.html']
        },
        casperjs: {
            files: [
                'test/set-filter/*.js',
                'test/git-commit-token/*.js',
                'test/dependency-leakage/*.js',
                'test/tablequery-core/test*.js',
                'test/tablequery-core-robustness/test*.js',
                'test/events/*.js',
            ],
            options: {
                direct: true,
                logLevel: "debug"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-casperjs');
    grunt.registerTask('test', ['build',
                                'qunit',
                                'casperjs']);
    grunt.registerTask('build', ['shell:jison',
                                 'shell:merge',
                                 'shell:minify']);
};
