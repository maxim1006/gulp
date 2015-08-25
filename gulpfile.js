var gulp         = require('gulp');
var config       = require('./gulp/config');
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS    = require('gulp-minify-css');
var gutil        = require('gulp-util');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var uglify       = require('gulp-uglify');
var babelify     = require('babelify');
var glob         = require('glob');
var browserSync  = require('browser-sync').create();



/**
 * start default task
 */
gulp.task('default', function() {
    gulp.watch(config.watch.less, ['less']);
    gulp.watch(config.watch.scripts, ['scripts']);
});



gulp.task('less', function() {
    return gulp.src(config.less.src)
        .pipe(less())
        .on('error', onLessError)
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.less.dest));
});



/**
 * Run JavaScript through Browserify
 */
gulp.task('scripts', function() {
    browserify({
        entries: glob.sync(config.browserify.bundleConfigs.entries),
        debug: true
    })
    //Turn it on if you need Babel
    //.transform(babelify)
    .bundle()
    .on('error', onScriptsError)
    .pipe(source(config.browserify.bundleConfigs.outputName))
    .pipe(gulp.dest(config.browserify.bundleConfigs.dest))
    .on('end', reload);
});



gulp.task('compressScripts', function() {
    return gulp.src(config.compressScripts.src)
        .pipe(uglify())
        .pipe(gulp.dest(config.compressScripts.dest));
});



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
    gulp.watch(config.watch.scripts, ['scripts']);
});



/***HELPERS FUNCTIONS***/
function onLessError(error) {
    gutil.log(error);
    this.emit('end');
}

function onScriptsError(error) {
    gutil.log(error);
    this.emit('end');
}

function reload() {
    browserSync.reload();
}


/***HELPERS TASKS***/
gulp.task('reloadBrowserOnSLessChange', ['less'], function() {
    browserSync.reload();
});
