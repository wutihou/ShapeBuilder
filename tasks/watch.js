var gulp = require('gulp');
gulp.task('watch', function(){
	gulp.watch(['app/**/*','!app/dist/**/*'],['build']);//['sass','jshint','copy']
});