/**
 * Created by Alexandru on 23/02/16.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var babel = require("gulp-babel");
var browserSync = require('browser-sync').create();

gulp.task('default',["watch", "browser-sync"]);

gulp.task('less', function() {
    return gulp.src('/**/*.less')
        .pipe(less())
        .pipe(cssnano())
        .pipe(gulp.dest('./public/css'));
});

gulp.task("babel", function () {
    return gulp.src("/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task("js-watch",["babel"]);
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
