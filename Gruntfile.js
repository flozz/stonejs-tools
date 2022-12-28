var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                src: ['test/*Spec.js']
            }
        },

        jshint: {
            all: ['src/**/*.js', 'bin/*', 'test/*Spec.js'],
            options: {
                futurehostile: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                node: true,
                mocha: true
            }
        }

    });

    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Register runnable tasks.
    grunt.registerTask('default', ['test']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
};
