var fs = require('fs');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! Terraformer GeoStore - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/esri/terraformer-geostore\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Esri, Inc.\n' +
        '*   Licensed MIT */'
    },

    uglify: {
      options: {
        report: 'gzip',
        banner: '<%= meta.banner %>'
      },
      geostore: {
        src: ['browser/terraformer-geostore.js'],
        dest: 'browser/terraformer-geostore.min.js'
      },
      versioned: {
        src: ['browser/terraformer-geostore.js'],
        dest: 'versions/terraformer-geostore-<%= pkg.version %>.min.js'
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
      coverage: {
        src: [
          "browser/terraformer-geostore.js"
        ],
        options: {
          specs: 'spec/*Spec.js',
          helpers: [
            "./node_modules/terraformer/terraformer.js",
            "./node_modules/terraformer-rtree/terraformer-geostore-rtree.js",
            "./src/memory.js"
          ],
          //keepRunner: true,
          outfile: 'SpecRunner.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: './coverage/coverage.json',
            report: './coverage',
            thresholds: {
              lines: 60,
              statements: 60,
              branches: 40,
              functions: 60
            }
          }
        }
      }
    },

    // lets use jasmine 2.0!
    jasmine_nodejs: {
        // task specific (default) options
        options: {
            useHelpers: true,
            // global helpers, available to all task targets. accepts globs..
            helpers: [],
            random: false,
            seed: null,
            defaultTimeout: null, // defaults to 5000
            stopOnFailure: false,
            traceFatal: true,
            // configure one or more built-in reporters
            reporters: {
                console: {
                    colors: true,        // (0|false)|(1|true)|2
                    cleanStack: 1,       // (0|false)|(1|true)|2|3
                    verbosity: 4,        // (0|false)|1|2|3|(4|true)
                    listStyle: "indent", // "flat"|"indent"
                    activity: false
                }
            },
            // add custom Jasmine reporter(s)
            customReporters: []
        },
        your_target: {
            // spec files
            specs: [
                "./spec/**"
            ]
        }
    }
  });

  var awsExists = fs.existsSync(process.env.HOME + '/terraformer-s3.json');

  if (awsExists) {
    grunt.config.set('aws', grunt.file.readJSON(process.env.HOME + '/terraformer-s3.json'));
  }

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  grunt.registerTask('test', [ 'concat', 'jasmine', 'jasmine_nodejs' ]);
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('version', [ 'test', 'uglify' ]);
};