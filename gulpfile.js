'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
//var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

//script paths
var jsFiles = 'src/js/**/*.js',
    jsDest = 'dist/js';

// Basic usage 
gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('src/js/app.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});