var gulp = require('gulp');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function () {
  return gulp.src('data-method.js')
             .pipe(watch('data-method.js'))
             .pipe(sourcemaps.init())
             .pipe(uglify())
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist'))
});

gulp.task('default', ['build']);
