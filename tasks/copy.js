/**
 * Created by Administrator on 2016/9/13.
 */
var gulp = require('gulp');
gulp.task('copy', function(){
    gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('app/dist/js/'));
    gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('app/dist/css/'));
    console.log("文件任务完成！");
});