module.exports = {
    compressScripts: {
        src: './js/main.js',
        dest: './js/'
    },
    browserify: {
        // Эта опция нужна для дебага, с указанием где произошла ошибка
        debug: true,
        //Записываю в main.js все модули в стиле common JS
        bundleConfigs: {
            entries:    './js/modules/*.js',
            dest:       './js',
            outputName: 'main.js'
        }
    },
    autoprefixer: {
        browsers: [
            'last 2 versions',
            'safari 5',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'ios 6',
            'android 4'
        ],
        cascade: true
    },
    base64: {
        src: './css/*.css',
        dest: './css',
        options: {
            extensions: ['png'],
            maxImageSize: 20 * 1024, // bytes 20kb
            debug: false
        }
    },
    less: {
        src: './styles/custom.less',
        dest: './css'
    },
    watch: {
        less: './styles/**/**/**/*.less',
        scripts: ['./js/modules/*.js']
    }
};