'use stric';

var gulp = require('gulp'),
		webserver = require('gulp-webserver'),
		livereload = require('gulp-livereload'),
		sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
		autoprefixer = require('gulp-autoprefixer'),
		plumber = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith'),
    image = require('gulp-image'),
		pug = require('gulp-pug'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require("gulp-notify"),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglifyjs'),
    uglifycss = require('gulp-uglifycss'),
    clean = require('gulp-clean'),
		rename = require('gulp-rename');

var settings = {
	scss: {
		main: 'source/scss/index.scss',
		watch: 'source/scss/**/*.scss',
		output: 'build/css/'
	},
	javascript: {
		main: 'source/javascript/index.js',
		watch: 'source/javascript/**/*.js',
		output: 'build/javascript/'
	},
	html: {
		main: 'source/*.pug',
		watch: 'source/**/*.pug',
		output: 'build/'
	}
}

gulp.task('server', function() {
	gulp.src('./build')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8080,
			livereload: true
		}))
});

// gulp.task('build:imagesize', function () {
//   gulp.src('source/images/images/*')
//     .pipe(image({
//       pngquant: true,
//       optipng: true,
//       zopflipng: true,
//       jpegRecompress: false,
//       mozjpeg: true,
//       guetzli: false,
//       gifsicle: true,
//       svgo: true,
//       concurrent: 10
//     }))
//     .pipe(gulp.dest('build/images'));
// });

gulp.task('build:image', function () {
  var spriteData = gulp.src('source/images/ico/*.png').pipe(spritesmith({
      imgName: '../images/sprite-image.png',
      cssName: '_03.sprite-image.scss',
      cssFormat: 'scss',
      padding: 6
    }));

    spriteData.img.pipe(gulp.dest('build/images'));
    spriteData.css.pipe(gulp.dest('source/scss/02-tools/'));
});

gulp.task('build:css', ['build:image'],function () {
	gulp.src(settings.scss.main)
		.pipe(plumber())
		.pipe(sassGlob())
		.pipe(sass({
			includePaths: ['node_modules/'],
      outputStyle: 'expanded'
			// outputStyle: 'compressed'
		}))
    // .pipe(uglifycss({
    //   "maxLineLen": 80,
    //   "uglyComments": true
    // }))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
      cascade: false
		}))
		.pipe(rename('index.min.css'))
		.pipe(gulp.dest(settings.scss.output))
    .pipe(notify({message: 'Sass task complete', onLast: true}));
})

gulp.task('build:js', function() {
	return browserify(settings.javascript.main)
		.bundle()
		.on('error', function (err) {
			this.emit('end')
		})
		.pipe(source('bundle.js'))
		.pipe(rename('main.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(settings.javascript.output))
    .pipe(notify({message: 'Pug task complete', onLast: true}));
});

gulp.task('build:html', function() {
	gulp.src(settings.html.main)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.on('error', function (err) {
      console.error('Error', err.message);
    })
		.pipe(gulp.dest(settings.html.output))
    .pipe(notify({message: 'Pug task complete', onLast: true}));
});

gulp.task('watch', function() {
	livereload.listen()
	gulp.watch(settings.html.watch, ['build:html'])
	gulp.watch(settings.scss.watch, ['build:css'])
	gulp.watch(settings.javascript.watch, ['build:js'])
});

gulp.task('build', ['build:html', 'build:css', 'build:js', 'build:image'])

gulp.task('default',['server', 'watch', 'build'])
