import gulp from 'gulp';

//this  library converts the scss code into css
import gulpSass from 'gulp-sass';

//this library is used to minify the js code
import uglify from 'gulp-uglify';

import imagemin from 'gulp-imagemin';

import * as sass from 'sass';

//this library conpresses the css code converted by gulp-sass
import cssnano from 'gulp-cssnano';

//this library will rename the css file every time it is again sent to the browser
//this is done to prevent the browser from caching the css file if it is already in the browser
import rev from 'gulp-rev';


import { deleteSync } from 'del';

const sassCompiler = gulpSass(sass);

//In Gulp, tasks are fundamental units of work that define a series of operations to be performed on 
//your project files.Tasks can handle a variety of activities such as compiling Sass, minifying 
//JavaScript, optimizing images, or even running a local server.(a task is defined using gulp.task())
gulp.task('css', function (done) {
    console.log("minifying css....");
    gulp.src('./assets/scss/**/*.scss')
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(cssnano())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/css'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: './public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
})

gulp.task('js', function (done) {
    console.log("minifying js....");
    gulp.src('./assets/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: './public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
})

gulp.task('image', function (done) {
    console.log("compressing images....");
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)', {
        encoding: false  //if this option is not set false the image you get will be encoded hence you won't be able to use it in your webpage
    })
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: './public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
})

//this is task which when executed will delete the public/assets folder as it is a good practise to delete the assets folder after the build
gulp.task('clean:assets', function (done) {
    deleteSync('./public/assets');
    done();
})

//this task will all the task for building the assest in series without needing to run those individually
gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'image'), function (done) {
    console.log('building assets...');
    done();
});