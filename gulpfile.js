'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var UglifyJS = require('uglify-js');
var map = require('vinyl-map');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var mocha = require('gulp-mocha');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");

var production = (process.env.NODE_ENV === 'production');
/**
 * Run .js files through jshint
 */
gulp.task('jshint', function taskJSHint() {
  return gulp.src('src/**.js')
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

/**
 * Watch and run .js files through jshint
 */
gulp.task('jshint-watch', function taskJSHint() {
  watch({
    glob: 'src/**/*.js',
    name: 'jshint-changed',
    emitOnGlob: true,
    emit: 'one'
  }, function (files) {
    return files
      .pipe(plumber())
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter(stylish));
  });

});

/**
 * Run .js files through UglifyJS
 */
gulp.task('uglify', function taskUglify() {

  var uglify = map(function (buff, filename) {
    var u = UglifyJS.minify(filename, {
    });
    return u.code;
  });

  return gulp.src('dist/pivot.js')
    .pipe(uglify)
    .pipe(concat('jbPivot.min.js'))
    .pipe(gulp.dest('dist'));
});

/**
 * Build file (browserify)
 */
gulp.task('build', function taskBuild() {

  return gulp.src('./src/pivot.js')
    .pipe(plumber())
    .pipe(transform(function (filename) {
      var b = browserify(filename, {
        debug: !production
      });
      return b.bundle();
    }))
    .pipe(rename("jbPivot.js"))
    .pipe(gulp.dest('./dist'));
});

/**
 * Watch and build files (browserify)
 */
gulp.task('build-watch', function () {
  watch({
    glob: 'src/**/*.js',
    name: 'build-changed',
    emitOnGlob: true,
    emit: 'one'
  }, function (files) {
    gulp.src('./src/pivot.js')
      .pipe(plumber())
      .pipe(transform(function (filename) {
        var b = browserify(filename, {
          debug: !production
        });
        return b.bundle();
      }))
      .pipe(rename("jbPivot.js"))
      .pipe(gulp.dest('./dist'));

    return files;
  });
});

gulp.task('mocha', function () {
  return gulp.src('./src/**/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});
gulp.task('mocha-watch', function () {

  var specFilter = filter(['*.spec.js']);

  gulp.src(['src/**/*.js'], { read: false })
    .pipe(watch({
      name: 'mocha-changed',
      emitOnGlob: true,
      emit: 'all'
    }, function (files) {
      files
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', function (err) {
          if (!/tests? failed/.test(err.stack)) {
            console.log(err.stack);
          }
        })
        .pipe(specFilter.restore());
    }));
});

gulp.task('minify-css', function() {
  return gulp.src('./css/*.css')
    .pipe(minifyCss({compatibility: '*'}))
    .pipe(concat('jbPivot.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src('./css/*.css')
    .pipe(concat('jbPivot.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('concat-css', function() {
  return gulp.src('./css/*.css')
    .pipe(concat('jbPivot.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('concat-js', function() {
  return gulp.src(['src/pivot.js', 'src/group*.js', 'src/agregate*.js', 'src/formatter*.js'])
    .pipe(concat('jbPivot.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('develop', ['jshint-watch', 'build-watch', 'mocha-watch', 'css']);
gulp.task('develop-no-browserify', ['jshint', 'concat-js', 'concat-css']);
gulp.task('release', ['jshint', 'build', 'uglify', 'minify-css']);
gulp.task('default', ['develop']);