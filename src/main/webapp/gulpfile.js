var argv = require('yargs').argv;
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var babelOptions = require('./babel-options');
var run = require('run-sequence');
var path = require('path');
var gulpOpen = require('gulp-open');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var less = require('gulp-less');

var doWatch = argv.watch ? true : false;

var paths ={
    source: 'src/**/*.js',
    templates: 'src/**/*.html',
    less: ['src/**/*.less'],
    output: 'target/',
    outputCss: 'target/**/*.css',
}; 


gulp.task('build', function () {
    run('clean', ['html', 'es6', 'less']);
});

gulp.task('html', ['do-html'], function () {
    if (doWatch) {
        gulp.watch('src/**/*.html', ['do-html']);
    }
});

gulp.task('do-html', function () {
    return gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('target/'));
});

gulp.task('es6', ['do-es6'], function () {
    if (doWatch) {
        gulp.watch('src/**/*.js', ['do-es6']);
    }
});

gulp.task('do-es6', function () {
    return gulp.src('src/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel(babelOptions))
        .pipe(sourcemaps.write("/sourcemaps", {sourceRoot: '/'}))
        .pipe(gulp.dest('target/'));
});




gulp.task('clean', function () {
    return gulp.src(['target/'])
        .pipe(vinylPaths(del));
});

gulp.task('less', ['do-less'], function() {
    if (doWatch) {
        gulp.watch(paths.less, ['do-less']);
    }
});

gulp.task('do-less', function() {
    return gulp.src('src/**/*.less')
        .pipe(plumber())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('target/'));
});



