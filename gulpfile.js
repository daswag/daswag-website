const gulp  = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const merge = require('merge-stream');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const hash = require('gulp-hash');
const del = require('del')


gulp.task('sass', function() {
    del('./themes/daswag/static/css/dist/**/*')
    const sassStream = gulp.src('./themes/daswag/static/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}));

    const cssStream = gulp.src('./themes/daswag/static/css/vendor/*.css')
        .pipe(concat('css-files.css'));

    const mergedStream = merge(sassStream, cssStream)
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(hash())
        .pipe(gulp.dest('./themes/daswag/static/css/dist/'))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/css"));
    return mergedStream;
});

const jsLibsBase = './themes/daswag/static/js/libs/';

gulp.task('js', function() {
    del('./themes/daswag/static/js/dist/**/*')
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js', jsLibsBase + 'jquery.webui-popover.min.js', jsLibsBase + 'slick.min.js'])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./themes/daswag/static/js/dist/'))
      .pipe(rename({ suffix: '.min' }))
      //.pipe(uglify())
      .pipe(hash())
      .pipe(gulp.dest('./themes/daswag/static/js/dist/'))
      .pipe(hash.manifest("hash.json"))
      .pipe(gulp.dest("data/js"));

    gulp.src('./themes/daswag/static/js/index.js')
      .pipe(rename({ suffix: '.min' }))
      //.pipe(uglify())
      .pipe(hash())
      .pipe(gulp.dest('./themes/daswag/static/js/dist/'))
      .pipe(hash.manifest("hash.json"))
      .pipe(gulp.dest("data/js"));
});

gulp.task('hugo:prod',shell.task(['hugo']));
gulp.task('hugo:dev',shell.task(['hugo']));


gulp.task('build:prod',['sass', 'js']);
gulp.task('build:dev',['sass', 'js']);

gulp.task('watch', function () {
  gulp.watch(['themes/daswag/static/js/**/*.js','!themes/daswag/static/js/dist/*.js'],['js']);
  gulp.watch('themes/daswag/static/scss/**/*.scss',['sass']);
});
