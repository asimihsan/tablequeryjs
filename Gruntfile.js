module.exports = function(grunt) {
    // Project config
    grunt.initConfig({
        qunit: {
            files: ['test/grammar/tests.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Task to run tests
    grunt.registerTask('test', 'qunit');
}
