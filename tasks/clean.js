/**
 * Created by Administrator on 2016/9/12.
 */
var gulp = require('gulp');
var clean = require('gulp-clean');
gulp.task('clean', function(){
    console.log("exec task clean");
    return gulp.src('app/dist/**/*', {read: false})
        .pipe(clean({force:true}));
});