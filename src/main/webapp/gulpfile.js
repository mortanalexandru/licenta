/**
 * Created by Alexandru on 23/02/16.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var babel = require("gulp-babel");

gulp.task('default',["watch"]);

gulp.task('less', function() {
    return gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(cssnano())
        .pipe(gulp.dest('./public/css'));
});

gulp.task("babel", function () {
    return gulp.src("./js/**/*.js")
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task("watch", function(){
    gulp.watch('./js/**/*.js', ['babel']);
    gulp.watch('./less/**/*.less', ['less']);
})
