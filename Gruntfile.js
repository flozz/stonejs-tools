var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        yuidoc: {
            doc: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    linkNatives: true,
                    attributesEmit: true,
                    selleck: true,
                    paths: ['./src/'],
                    outdir: './doc/',
                    tabtospace: 4
                }
            }
        },

        mochaTest: {
            test: {
                src: ['test/*.js']
            }
        }

    });

    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Register runnable tasks.
    grunt.registerTask('default', ['doc']);
    grunt.registerTask('doc', ['yuidoc']);
    grunt.registerTask('test', ['mochaTest']);
};
