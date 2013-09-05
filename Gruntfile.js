var fs = require('fs');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    meta: {
      version: '1.0.0',
      banner: '/*! Terraformer JS - <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/esri/terraformer-wkt-parser\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Esri, Inc.\n' +
        '*   Licensed MIT */'
    },

    uglify: {
      options: {
        report: 'gzip'
      },
      geostore: {
        src: ["browser/terraformer-geostore.js"],
        dest: 'browser/terraformer-geostore.min.js'
      }
    },

    concat: {
      geostore: {
        src: ['<banner:meta.banner>', 'src/partials/geostore-head.js', 'src/helpers/sync.js', 'src/helpers/browser/eventemitter.js', 'src/helpers/browser/stream.js', 'src/geostore.js', 'src/partials/geostore-tail.js' ],
        dest: 'browser/terraformer-geostore.js'
      },
      geostore_node: {
        src: [ 'src/partials/geostore-head.js', 'src/helpers/sync.js', 'src/helpers/node/stream.js', 'src/geostore.js', 'src/partials/geostore-tail.js' ],
        dest: 'node/terraformer-geostore.js'
      }
    },

    jasmine: {
      src: [
      ],
      coverage: {
        src: [
          "browser/terraformer-geostore.js"
        ],
        options: {
          specs: 'spec/*Spec.js',
          helpers: [
            "./node_modules/terraformer/terraformer.js",
            "./node_modules/terraformer-rtree/index.js",
            "./src/memory.js"
          ],
          //keepRunner: true,
          outfile: 'SpecRunner.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: './coverage/coverage.json',
            report: './coverage',
            thresholds: {
              lines: 75,
              statements: 75,
              branches: 75,
              functions: 75
            }
          }
        }
      }
    },

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'Spec',
        helperNameMatcher: 'Helpers'
      },
      all: ['spec/']
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', [ 'concat', 'jasmine', 'jasmine_node' ]);
  grunt.registerTask('default', [ 'concat', 'jasmine', 'jasmine_node', 'uglify' ]);
};