/* eslint no-console: off */

const gulp = require("gulp");
const mocha = require("gulp-mocha");
const eslint = require("gulp-eslint");
const env = require("gulp-env");
const spawn = require("child_process").spawn;
const jsFiles = [
  "*.js", "bin/www", "auth/**/*.js", "config/**/*.js",
  "models/**/*.js", "route/**/*.js", "test/**/*.js"
];

let server;
gulp.task("serve", ["clean", "test"], function(cb) {
  server = spawn("node", ["server.js"], {
    stdio: [0, "pipe", process.stdout],
    env: {NODE_ENV: "development"}
  });

  server.on("close", (code, sig) => {
    console.log(`Server closed\n\tcode: ${code}\n\tsignal: ${sig}`);
    server = null;
  });

  server.stdout.on("data", buff => {
    var text = buff.toString();
    process.stdout.write(buff);
    if (/Server listening on port \d+/.test(text)) {
      cb();
    }
  });
});

gulp.task("clean", cb => {
  if (server) {
    server.kill("SIGTERM");
    setTimeout(cb, 500);
  } else {
    cb();
  }
});

gulp.task("default", ["watch", "serve"]);

gulp.task("mocha", () => {
  const envs = env.set({NODE_ENV: "test"});
  return gulp.src("test/**/*.js", {read: false})
    .pipe(envs)
    .pipe(mocha({
      reporter: "spec",
      require: ["should"]
    }))
    .pipe(envs.reset);
});

gulp.task("test", ["eslint", "mocha"]);

gulp.task("watch", cb => {
  gulp.watch(jsFiles, ["serve"]);
  cb();
});

gulp.task("eslint", () => {
  return gulp.src(jsFiles)
    .pipe(eslint(".eslintrc.json"))
    .pipe(eslint.format())
    // .pipe(eslint.failOnError());
});
