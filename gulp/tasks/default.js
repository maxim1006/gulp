var gulp         = require('gulp');
var config       = require('../config');
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS    = require('gulp-minify-css');
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var gutil        = require('gulp-util');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var watchify     = require('watchify');
var notify       = require("gulp-notify");
var uglify       = require('gulp-uglify');
var runSequence = require('run-sequence');




/**
 * start default task
 */
gulp.task('default', function() {
    gulp.watch(config.watch.less, ['less']);
    gulp.watch(config.watch.scripts, ['scripts']);
});



gulp.task('less', function() {
    return gulp.src(config.less.src)
        .pipe(plumber({
            errorHandler: onPlumberLessError
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.less.dest));
});



/**
 * Run JavaScript through Browserify
 */
gulp.task('scripts', function(callback) {

    var bundleQueue = config.browserify.bundleConfigs.length;

    var browserifyThis = function(bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: false,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.browserify.extensions,
            // Enable source maps!
            debug: config.browserify.debug
        });

        var bundle = function() {

            return bundler
                .bundle()
                // Report compile errors
                .on('error', function() {
                    var args = Array.prototype.slice.call(arguments);

                    // Send error to notification center with gulp-notify
                    notify.onError({
                        title: "Compile Error",
                        message: "<%= error.message %>"
                    }).apply(this, args);

                    // Keep gulp from hanging on this task
                    this.emit('end');
                })
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);
        };

        if(global.isWatching) {
            // Wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function() {

            if(bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // if you need to compress output file just uncomment the next line
                    //runSequence('compressScripts');
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.browserify.bundleConfigs.forEach(browserifyThis);
});



gulp.task('compressScripts', function() {
    return gulp.src(config.compressScripts.src)
        .pipe(uglify())
        .pipe(gulp.dest(config.compressScripts.dest));
});



/***HELPERS FUNCTIONS***/
function onPlumberLessError(error) {
    gutil.log(error);
    this.emit('end');
    gulp.watch(config.watch.less, ['less']);
}