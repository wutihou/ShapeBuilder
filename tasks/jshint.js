var gulp = require('gulp');
var jshint = require('gulp-jshint');
gulp.task('jshint', function() {
	gulp.src('app/js-business/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter());
});