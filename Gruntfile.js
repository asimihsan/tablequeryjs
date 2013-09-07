module.exports = function(grunt) {
    // Project config
    grunt.initConfig({
        shell: {
            jison: {
                command: 'jison src/grammar.jison --outfile build/grammar.js',
                options: {
                    stdout: true
                }
            },
            modernizr: {
                command: [
                    "sed 's/window.Modernizr/tablequery.Modernizr/g' build/modernizr.custom.js > build/modernizr.custom.js.tmp",
                    "sed 's/Modernizr.load/tablequery.Modernizr.load/g' build/modernizr.custom.js.tmp > build/modernizr.custom.js",
                    "rm -f build/*.tmp"
                ].join('&& ')
            },
            jquery: {
                command: './node_modules/.bin/jquery-builder --exclude ajax,deprecated,wrap > build/jquery.custom.js'
            },
            casperjs: {
                command: [
                    "casperjs test --direct --log-level=debug test/tablequery-core/test_simple_eq.js",
                    "casperjs test --direct --log-level=debug test/tablequery-core/test_simple_or.js"
                ].join('&& '),
                options: {
                    stdout: true
                }
            }
        },
        lodash: {
            build: {
                dest: 'build/lodash.custom.js'
            },
            options: {
                modifier: 'modern',
                include: [
                    'intersection',
                    'union',
                    'filter',
                    'map',
                    'each',
                    'memoize',
                    'debounce',
                    'contains'
                ],
                flags: [
                    '--debug'
                ]
            }
        },
        bower: {
            install: {
            }
        },
        modernizr: {
            devFile: "lib/modernizr/modernizr.js",
            outputFile: "build/modernizr.custom.js",
            extra : {
                "shiv" : false,
                "printshiv" : false,
                "load" : false,
                "mq" : false,
                "cssclasses" : false
            },
            uglify: false,
            tests: [
                "localstorage"
            ],
            files: [
                'src/tablequery-core.js'
            ]
        },
        uglify: {
            options: {
                banner: [
                '/*! ',
                ' * tablequeryjs v0.1.3',
                ' * https://github.com/asimihsan/tablequeryjs',
                ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>',
                ' *',
                ' * Copyright 2013 Asim Ihsan',
                ' *',
                ' * Licensed under the Apache License, Version 2.0 (the "License");',
                ' * you may not use this file except in compliance with the License.',
                ' * You may obtain a copy of the License at',
                ' *',
                ' *  http://www.apache.org/licenses/LICENSE-2.0',
                ' *',
                ' * Unless required by applicable law or agreed to in writing, software',
                ' * distributed under the License is distributed on an "AS IS" BASIS,',
                ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
                ' * See the License for the specific language governing permissions and',
                ' * limitations under the License.',
                ' */',
                ''
                ].join('\n'),
                wrap: "tablequery",
                //report: 'gzip',
                //mangle: false,
                //beautify: true
            },
            build: {
                src: [
                    'build/lodash.custom.js',
                    'build/modernizr.custom.js',
                    //'build/jquery.custom.js',
                    'build/grammar.js',
                    'src/tablequery-core.js'
                ],
                dest: 'build/tablequery.min.js'
            }
        },
        qunit: {
            files: ['test/grammar/tests.html']
        },
        casperjs: {
            files: ['test/tablequery-core/*.js'],
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

    grunt.loadNpmTasks('grunt-lodash');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build', ['bower',
                                 'lodash',
                                 'modernizr',
                                 'shell:jison',
                                 'shell:modernizr',
                                 'uglify']);
}
