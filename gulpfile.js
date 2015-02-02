var gulp = require('gulp');
var stylus = require('gulp-stylus');

var paths = {
    styl: './src/css/*.styl'
}

gulp.task('stylus', function(){
    gulp.src(paths.styl)
        .pipe(stylus())
        .pipe(gulp.dest('./bulid'));
});

gulp.watch(paths.styl, ['stylus']);

gulp.task('default', ['stylus']);
