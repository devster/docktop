var Node = require('blessed').Node,
    Grid = require('../widget/grid'),
    merge = require('merge'),
    screen = require('./screen');

function View()
{
    this.modules = [];
    this.grid = this.createGrid()
}

View.prototype.createGrid = function(options)
{
    var defaults = {
        rows: 24,
        cols: 24,
        screen: screen
    };

    return new Grid(merge(defaults, options || {}));
}

View.prototype.addModule = function(x, y, width, height, mod, options)
{
    var node = this.grid.set(y, x, height, width, mod, options || {});
    node.view = this;

    this.modules.push(node);

    return node;
}

View.prototype.append = function(node)
{
    this.modules.push(node)
    screen.append(node)
}

View.prototype.start = function()
{
    for (var i = 0; i < this.modules.length; i++) {
        var m = this.modules[i]

        if ('start' in m) {
            m.start()
        }
    }

    screen.render();
}

View.prototype.stop = function()
{
    for (var i = 0; i < this.modules.length; i++) {
        var m = this.modules[i];
        m.destroy();
        screen.remove(m);
    }

    this.modules = [];
}

module.exports = View;
