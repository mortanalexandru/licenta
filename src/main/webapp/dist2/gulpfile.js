System.register([], function (_export) {
    /**
     * Created by Alexandru on 23/02/16.
     */
    'use strict';

    var gulp, less, cssnano, babel, babel, browserSync, plumber, sourcemaps, babelOptions;
    return {
        setters: [],
        execute: function () {
            gulp = require('gulp');
            less = require('gulp-less');
            cssnano = require('gulp-cssnano');
            babel = require("gulp-babel");
            babel = require('gulp-babel');
            browserSync = require('browser-sync').create();
            plumber = require('gulp-plumber');
            sourcemaps = require('gulp-sourcemaps');
            babelOptions = require('./babelOptions');

            gulp.task('default', ["do-es6"]);

            gulp.task('less', function () {
                return gulp.src('/**/*.less').pipe(less()).pipe(cssnano()).pipe(gulp.dest('./public/css'));
            });

            gulp.task('do-es6', function () {
                return gulp.src("/webapp/**/*.js", { base: 'webapp' }).pipe(plumber()).pipe(sourcemaps.init({ loadMaps: true })).pipe(babel(babelOptions)).pipe(sourcemaps.write("/sourcemaps", { sourceRoot: '/webapp' })).pipe(gulp.dest("/webapp/dist"));
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

            // integrate maven gulp
        }
    };
});
//# sourceMappingURL=../sourcemaps/app/gulpfile.js.map
