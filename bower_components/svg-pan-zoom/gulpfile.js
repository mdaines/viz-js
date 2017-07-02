/**
 *  Modules
 */
var gulp   = require('gulp')
  , watch      = require('gulp-watch')
  , uglify     = require('gulp-uglify')
  , browserify = require('browserify')
  , source     = require('vinyl-source-stream')
  , rename     = require('gulp-rename')
  , qunit      = require('gulp-qunit')
  , jshint     = require('gulp-jshint')
  , jscs       = require('gulp-jscs')
  , sync       = require('gulp-config-sync')
  , header     = require('gulp-header')
  , buffer     = require('vinyl-buffer')
  , pkg        = require('./package.json')
  , banner     = "// svg-pan-zoom v<%= pkg.version %>" + "\n" + "// https://github.com/ariutta/svg-pan-zoom" + "\n"
  ;

/**
 *  Build script
 */
gulp.task('browserify', function() {
  return browserify({entries:'./src/stand-alone.js'})
    .bundle()
    .on('error', function (err) {
      console.log(err.toString())
      this.emit("end")
    })
    .pipe(source('svg-pan-zoom.js'))
    .pipe(buffer())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./dist/'))
    .pipe(rename('svg-pan-zoom.min.js'))
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./dist/'))
});

/**
 * Watch script
 */
gulp.task('watch', function () {
  gulp.watch('./src/**/*.js', ['browserify']);
});

/**
 * Test task
 */
gulp.task('test', function () {
  gulp.src('./tests/index.html')
    .pipe(qunit())
});

/**
 * Check
 */
gulp.task('check', function() {
  gulp.src(['./src/*', '!./src/uniwheel.js']) // Ignore uniwheel
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jscs())
})

/**
 * Sync metadata (from package.json to bower.json)
 */
gulp.task('sync metadata', function(){
  gulp.src('./bower.json')
    .pipe(sync({
      src: 'package.json'
    , fields: ['name', 'version', {from: 'contributors', to: 'authors'}, 'description', 'main', 'keywords', 'licence']
    }))
    .pipe(gulp.dest(''))
})

/**
 * Build
 */
gulp.task('build', ['test', 'check', 'browserify', 'sync metadata'])

/**
 * Default task
 */
gulp.task('default', [
  'browserify',
  'watch'
]);

