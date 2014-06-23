module.exports = function(grunt) {

    'use strict';

    var ipAddress = require('network-address')();
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            distPath:       'dist'
        },
        // 全局变量
        banner: '/*! Project: LegoMobile\n *  Version: 3.0.0\n */\n',

        clean:{
            dist: ['<%= meta.distPath %>/']
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded', //nested, compact, compressed, expanded
                    lineNumbers: true,
                    noCache: true,
                    sourcemap: true
                },
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.scss'],
                    dest: '<%= meta.distPath %>/css',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8']
            },
            dist: {
                expand: true,
                flatten: true,
                cwd: '<%= meta.distPath %>/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= meta.distPath %>/css/'
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>'
            },
            minify: {
                expand: true,
                cwd: '<%= meta.distPath %>/css',
                src: ['*.css', '!*.min.css'],
                dest: '<%= meta.distPath %>/css',
                ext: '.min.css'
            }
        },

        connect: {
            site_src: {
                options: {
                    hostname: ipAddress,
                    port: 9000,
                    base: [''],
                    livereload: true,
                    open: true //打开默认浏览器
                }
            }
        },

        imagemin: {
            dist: {
                expand: true,
                cwd: 'img/',
                src: ['{,*/}*.{png,jpg,jpeg,gif}'],
                dest: '<%= meta.distPath %>/img/'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: ['**/*.js','!zeptodoc/*.js'],
                    dest: '<%= meta.distPath %>/js'
                }]
            }
        },
        copy: {
            fonts: {
                expand: true,
                src: ['fonts/**/*.{ttf,svg}'],
                dest: '<%= meta.distPath %>'
            }
        },
        watch: {
            css: {
                files: ['sass/{,*/}*.scss'],
                tasks:['sass','autoprefixer']
            },
            js: {
                files: ['js/{,*/}*.js'],
                tasks: ['uglify']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['demo/*.html', '<%= meta.distPath %>/css/*.css', '<%= meta.distPath %>/js/*.js']
            }
        }
    });

    // Default tasks.
    grunt.registerTask('dist-sass', ['sass','autoprefixer']);
    grunt.registerTask('dist-css', ['sass','autoprefixer', 'cssmin']);
    grunt.registerTask('dist-img', ['imagemin']);
    grunt.registerTask('dist-js', ['uglify']);
    grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'dist-img', 'copy']);

    // Demo task
    grunt.registerTask('demo', ['connect:site_src', 'watch']);
    
};
