'use strict';

/**
 * Created by Alexandru on 23/02/16.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var babel = require("gulp-babel");
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var babelOptions = require('./babelOptions');
var concat = require("gulp-concat");

gulp.task('default', ["b"]);

gulp.task('less', function () {
    return gulp.src('/**/*.less').pipe(less()).pipe(cssnano()).pipe(gulp.dest('./public/css'));
});

gulp.task('do-es6', function () {
    return gulp.src("./**/*.js", { base: 'webapp' }).pipe(plumber()).pipe(sourcemaps.init({ loadMaps: true })).pipe(babel()).pipe(sourcemaps.write("/sourcemaps", { sourceRoot: '/webapp' })).pipe(gulp.dest("./dist"));
});
//gulp.task("js-watch",["babel"]);
gulp.task("less-watch", ["less"], browserSync.reload);

gulp.task("watch", function () {
    gulp.watch("/**/*.html").on('change', browserSync.reload);
    gulp.watch('*.less', ['less-watch']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "localhost:8080"
    });
});

gulp.task("babel-6", function () {
    return gulp.src("./**/*.js").pipe(sourcemaps.init()).pipe(babel()).pipe(concat("all.js")).pipe(sourcemaps.write(".")).pipe(gulp.dest("./dist"));
});

gulp.task('b', function () {
    return gulp.src('./**/*.js').pipe(babel({
        presets: ['es2015']
    }, {
        "plugins": ["transform-class-properties", "transform-decorators"]
    })).pipe(gulp.dest('./dist'));
});

// integrate maven gulp