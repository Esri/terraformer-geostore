var fs = require('fs');

module.exports = function (grunt) {
  grunt.initConfig({
    aws: grunt.file.readJSON(process.env.HOME + '/terraformer-s3.json'),
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
              lines: 75,
              statements: 75,
              branches: 55,
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
        specNameMatcher: 'Spec'
      },
      all: ['./spec/']
    },

    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // 1 Year cache policy (1000 * 60 * 60 * 24 * 365)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      dev: {
        upload: [
          {
            src: 'versions/terraformer-geostore-<%= pkg.version %>.min.js',
            dest: 'terraformer-geostore/<%= pkg.version %>/terraformer-geostore.min.js'
          }
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-s3');

  grunt.registerTask('test', [ 'concat', 'jasmine', 'jasmine_node' ]);
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('version', [ 'test', 'uglify', 's3' ]);
};