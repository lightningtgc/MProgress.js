var gulp = require('gulp');
var gUglify = require('gulp-uglify');
var gRename = require('gulp-rename');
var gStylus = require('gulp-stylus');
var gMinifyCSS = require('gulp-minify-css');
var gTranspile  = require('gulp-es6-module-transpiler');
var del = require('del');

var projectName = 'mprogress';
var jsName = projectName + '.js';
var jsMinName = projectName + '.min.js';
var cssName = projectName + '.css';
var cssMinName = projectName + '.min.css';

var devPath = './dev';
var buildPath = './build';
var paths = {
    srcCSS: './src/css/*.styl',
    srcJS: './src/js/main.js',
    srcBase: './src/js',
    destJS: devPath + '/js',
    destCSS: devPath + '/css'
};

// clean
gulp.task('clean', function(cb){
    del([devPath], cb);
});

// Handle CSS
gulp.task('stylus', ['clean'], function(){

    gulp.src(paths.srcCSS)
        .pipe(gStylus())
        .pipe(gulp.dest(paths.destCSS))
        .pipe(gMinifyCSS())
        .pipe(gRename(cssMinName))
        .pipe(gulp.dest(paths.destCSS));
});

// Handle JS
gulp.task('es6module', ['clean'], function(){
    return gulp.src(paths.srcJS)
               .pipe(gTranspile({
                    formatter: 'bundle',
                    basePath: paths.srcBase
                }))
               .pipe(gRename(jsName))
               .pipe(gulp.dest(paths.destJS))
               .pipe(gUglify())
               .pipe(gRename(jsMinName))
               .pipe(gulp.dest(paths.destJS));
});

// watch change
gulp.task('watch', function(){
    gulp.watch(paths.srcCSS, ['stylus']);
});

gulp.task('default', [ 'stylus', 'es6module']);

gulp.task('build', ['stylus', 'es6module'], function(){
   return gulp.src(devPath + '/*/*')
        .pipe(gulp.dest(buildPath));
});

gulp.task('publish', ['stylus', 'es6module'], function(){
   gulp.src([devPath + '/css/' + cssMinName, devPath + '/js/' + jsMinName])
        .pipe(gulp.dest('./'));
});
