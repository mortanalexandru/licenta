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

gulp.task('default',["less"]);

gulp.task('less', function() {
    return gulp.src('/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('do-es6', function () {
    return gulp.src("/webapp/**/*.js", {base: 'webapp'})
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel(babelOptions))
        .pipe(sourcemaps.write("/sourcemaps", {sourceRoot: '/webapp'}))
        .pipe(gulp.dest("/webapp/dist"));
});
//gulp.task("js-watch",["babel"]);
gulp.task("less-watch",["less"],  browserSync.reload);


gulp.task("watch", function(){
    gulp.watch("/**/*.html").on('change', browserSync.reload);
    gulp.watch('*.less', ['less-watch']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:8080"
    });
});



// integrate maven gulp