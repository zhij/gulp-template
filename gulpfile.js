var gulp = require('gulp');
// var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify'); 
var sass = require('gulp-sass');
var del = require('del');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var fileinclude = require('gulp-file-include');

// 编译sass
gulp.task('sass', function(){
	return gulp.src('src/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer({
            browsers: ['> 1%', 'last 3 versions', 'Firefox >= 20', 'iOS >=7'],
            cascade: false
        }))
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace('sass', 'css') 
         }))
        .pipe(gulp.dest('src/'))
		.pipe(browserSync.reload({
	      	stream: true
	    }))
})

gulp.task('minjs', function(){
	return gulp.src('src/**/*.js')
        .pipe(uglify())
		.pipe(gulp.dest('dist/'))
})

gulp.task('watch', ['browserSync', 'sass', 'build'], function(){
	gulp.watch('src/**/*.scss', ['sass', 'build']);
	gulp.watch('src/**/*.html', browserSync.reload);
    gulp.watch('src/**/*.js', browserSync.reload);
    gulp.watch('src/**/*.html', ['build']);
  	gulp.watch('src/**/*.js', ['build']);
})

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
  })
})

gulp.task('clear', function(){
	del.sync('dist');
})

gulp.task('img', function() {
    return gulp.src('src/**/img/*')
        .pipe(gulp.dest('dist/'))
})

// 复制css
gulp.task('copycss', ['sass'], function() {
    return gulp.src('src/**/*.css')
        .pipe(gulp.dest('dist/'))
})

// 压缩css
gulp.task('mincss', ['copycss'], function() {
    return gulp.src('dist/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8', rebase: false}))
        .pipe(gulp.dest('dist/'))
})

// 压缩html
gulp.task('minhtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'));
});

gulp.task('fileinclude', function() {
    gulp.src(['./src/*.html'])//主文件
        .pipe(fileinclude({
            prefix: '@@',//变量前缀 @@include
            basepath: './src/layout',//引用文件路径
            indent:true//保留文件的缩进
        }))
        .pipe(gulp.dest('./dist'));//输出文件路径
});

// 打包
gulp.task('build', ['clear', 'fileinclude', 'minjs', 'img', 'mincss'])