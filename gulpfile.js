const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const del = require('del');

// Шляхи до файлів
const files = {
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js',
    htmlPath: 'src/html/**/*.html',
    imgPath: 'src/img/**/*.{jpg,jpeg,png,gif,svg}'
};

// Очищення папки dist
function clean() {
    return del(['dist']);
}

// Компіляція SCSS
function scssTask() {
    return src(files.scssPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Обробка JavaScript
function jsTask() {
    return src(files.jsPath)
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// Просто копіювання зображень (без оптимізації)
function imgTask() {
    return src(files.imgPath)
        .pipe(dest('dist/img'));
}

// Копіювання HTML
function htmlTask() {
    return src(files.htmlPath)
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// Запуск сервера
function browserSyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false,
        open: false
    });
    console.log('\n✅ Server running at http://localhost:3000\n');
    cb();
}

// Спостереження за змінами
function watchTask() {
    watch(files.scssPath, scssTask);
    watch(files.jsPath, jsTask);
    watch(files.htmlPath, htmlTask);
    watch(files.imgPath, imgTask);
    watch('dist/*.html').on('change', browserSync.reload);
}

// Експорт завдань
exports.dev = series(
    clean,
    parallel(scssTask, jsTask, imgTask, htmlTask),
    browserSyncServe,
    watchTask
);

exports.build = series(
    clean,
    parallel(scssTask, jsTask, imgTask, htmlTask)
);

exports.default = exports.dev;