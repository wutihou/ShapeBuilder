var gulp = require('gulp');
gulp.task('watch',['clean'], function(){
	gulp.watch(['app/**/*','!app/dist/**/*'],['sass','jshint','copy']);
});