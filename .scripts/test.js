#!/usr/bin/env node
var path = require('path'),
   extend = require('util')._extend,
   exec = require('child_process').exec;

var baseDir = path.resolve(__dirname, '..'),
   srcDir = path.resolve(baseDir, 'src'),
   karmaBin = path.resolve(baseDir, 'node_modules/.bin/karma'),
   chimpScript = path.resolve(__dirname, 'start.js');

runTestsSequentially();
// TODO run tests in parallel for beefier machines

function runTestsSequentially() {
  runClientTests(function () {
    runServerTests(function () {
      runEndToEndTests(function () {
        console.log('Yay!');
      });
    });
  });
}

function runClientTests(callback) {
  startProcess({
    name: 'Karma',
    options: {},
    command: karmaBin + ' start karma.conf.js --single-run'
  }, callback);
}

function runServerTests(callback) {
  // TODO add Meteor 1.3 server testing mode
  callback();
}

function runEndToEndTests(callback) {
  startProcess({
    name: 'Chimp',
    options: {
      env: extend({CI: 1}, process.env)
    },
    command: chimpScript
  }, callback);
}

function startProcess(opts, callback) {

  var proc = exec(
     opts.command,
     opts.options
  );
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('close', function (code) {
    if (code > 0) {
      console.log(opts.name, 'exited with code ' + code);
      process.exit(code);
    } else {
      callback();
    }
  });
}
