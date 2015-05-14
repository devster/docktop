var docker = require('./lib/docker');

var h = docker.stats(process.argv.slice(2), function (stats) {
    console.log(stats);
});
