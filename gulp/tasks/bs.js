var gulp         = require('gulp');
var config       = require('../config');
var browserSync  = require("browser-sync").create();



/**
 * start bs task (with browserSync)
 */
gulp.task('bs', function() {

    browserSync.init({
        server: {
            baseDir: ['./']
        },
        port: 9191,
        files: [
            './*.html'
        ]
    });

    gulp.watch(config.watch.less, ['reloadBrowserOnSLessChange']);
    gulp.watch(config.watch.scripts, ['reloadBrowserOnScriptChange']);
});



/***HELPERS TASKS***/
gulp.task('reloadBrowserOnScriptChange', ['scripts'], function() {
    browserSync.reload();
});

gulp.task('reloadBrowserOnSLessChange', ['less'], function() {
    browserSync.reload();
});
