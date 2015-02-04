var gulp = require('gulp');
var gUglify = require('gulp-uglify');
var gRename = require('gulp-rename');
var gStylus = require('gulp-stylus');
var gTranspile  = require('gulp-es6-module-transpiler');
var del = require('del');

var jsName = 'mprogress.js';
var jsMinName = 'mprogress.min.js';
var devPath = './dev';
var bulidPath = './bulid';

var paths = {
    srcCSS: './src/css/*.styl',
    srcJS: './src/js/main.js',
    srcBase: './src/js',
    destJS: devPath + '/js',
    destCSS: devPath + '/css'
}



// clean
gulp.task('clean', function(cb){
    del([devPath], cb);
});


// Handle CSS
gulp.task('stylus', ['clean'], function(){

    gulp.src(paths.srcCSS)
        .pipe(gStylus())
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
               .pipe(gulp.dest(paths.destJS))
});

/* gulp.task('compress', function(){ */
/*     return gulp.src('./mprogress.js') */
/*     .pipe(gUglify()) */
/*     .pipe(gulp.dest('./li')) */

/* }); */

/* gulp.watch(paths.srcCSS, ['stylus']); */

gulp.task('default', [ 'stylus', 'es6module']);

gulp.task('bulid', ['stylus', 'es6module'], function(){
   return gulp.src(devPath + '/*/*')
        .pipe(gulp.dest(bulidPath))
});

gulp.task('publish', ['stylus', 'es6module'], function(){
   gulp.src([devPath + '/css/mprogress.css', devPath + '/js/mprogress.min.js'])
        .pipe(gulp.dest('./'));

});
