"use strict";
let gulp = require("gulp");
let autoPrefix = require("gulp-autoprefixer"); //Расстановка префиксов
let cleanCSS = require("gulp-clean-css"); //Минификация CSS
let uglifyES = require("gulp-uglify-es").default; //Минификация JS (ES5+)
let rename = require("gulp-rename"); //Перетменовае файлов
/*==================================================================================*/

//Styles
function style() {
  return (
    gulp
      .src("./src/css/style.css")
      .pipe(
        autoPrefix({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        })
      )
      //Минификация
      .pipe(
        cleanCSS({
          level: 2,
        })
      )
      //Переименование
      .pipe(rename({ suffix: ".min" }))
      //Папка назначения
      .pipe(gulp.dest("./src/css"))
  );
}

//JavaScript
function script() {
  return gulp
    .src("./src/js/index.js")
    .pipe(uglifyES())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./src/js/"));
}

//Таск для удаления файлов в папке dist и запуск сборки
gulp.task("build", gulp.parallel(style, script));
