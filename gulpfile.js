var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var includer = require('gulp-htmlincluder');
var htmlmin = require('gulp-htmlmin');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var spritecreator = require('gulp.spritesmith');
var less = require('gulp-less');

gulp.task('less', function () {
  return gulp.src('dev/less/style/*.less')
    .pipe(less())
    .pipe(gulp.dest('build/css/style/'))
    .pipe(connect.reload());
});
gulp.task('sprite', function () {
  var spriteData = gulp.src('dev/img/icon/*.png').pipe(spritecreator({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    algorithm: 'binary-tree'
  }));
  spriteData.img.pipe(gulp.dest('build/img/'));
  spriteData.css.pipe(gulp.dest('build/css/'));
});
gulp.task('concat', function () {
  return gulp.src('dev/css/**/*.css')
    .pipe(concatCss("styles.css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css/'))
    .pipe(connect.reload());
});
gulp.task('html', function() {
	gulp.src('dev/**/*.html')
    	.pipe(includer())
      .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());;
});
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});
gulp.task('default', function(){
  gulp.start('connect', 'html', 'concat', 'less');

  gulp.watch(['dev/**/*.html'], function(event) {
    gulp.start('html');
  });
  gulp.watch(['dev/css/**/*.css'], function(event) {
    gulp.start('concat');
  });
  gulp.watch(['dev/less/**/*.less'], function(event) {
    gulp.start('less');
  });
});