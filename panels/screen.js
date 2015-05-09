var screen = require('blessed').screen();


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

module.exports = screen;
