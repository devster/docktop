var pkg = require('../package.json')
var screen = require('blessed').screen({
    debug: true
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

screen.title = 'Docktop v'+pkg.version

module.exports = screen;
