const gulp = require("gulp");
const ts = require("gulp-typescript");
const rimraf = require("rimraf");
const jasmine = require("gulp-jasmine");
const jasmineSpecReporter = require("jasmine-spec-reporter");
const tslint = require("gulp-tslint");

const SOURCE_FILES_GLOB = "src/**/*.ts";
const SPEC_FILES_GLOB = "dist/test/**/*.spec.js";
const DIST_FOLDER = "dist";
const SOURCE_RESOURCE_FILES_GLOB = "src/main/resources/**/*.*";
const DIST_RESOURCES_FOLDER = "dist/resources";
const SERVERLESS_FOLDER = ".serverless";
const TSCONFIG = "tsconfig.json";
const TSLINT_CONFIG = "tslint.json";

function clean() {
    return Promise.all([
        new Promise((resolve) => {rimraf(DIST_FOLDER, resolve);}),
        new Promise((resolve) => {rimraf(SERVERLESS_FOLDER, resolve);}),
    ]);
}

function copyResources() {
    return gulp.src(SOURCE_RESOURCE_FILES_GLOB)
        .pipe(gulp.dest(DIST_RESOURCES_FOLDER));
}

function runCompilation() {
    const tsProject = ts.createProject(TSCONFIG);
    
    return gulp.src(SOURCE_FILES_GLOB)
        .pipe(tsProject())
        .js.pipe(gulp.dest(DIST_FOLDER));
}

function runTests() {
    const reporter = new jasmineSpecReporter.SpecReporter({});
    
    return gulp.src(SPEC_FILES_GLOB).pipe(jasmine({reporter}));
}

function lint() {
    return gulp.src(SOURCE_FILES_GLOB)
        .pipe(tslint({TSLINT_CONFIG}))
        .pipe(tslint.report());
}

const compile = gulp.series(clean, copyResources, runCompilation);
const build = gulp.series(lint, compile, runTests);
const test = gulp.series(compile, runTests);


exports.clean = clean;
exports.compile = compile;
exports.test = test;
exports.lint = lint;
exports.build = build;

exports.default = build;
