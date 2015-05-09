var Node = require('blessed').Node,
    Grid = require('blessed-contrib').grid,
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
        rows: 12,
        cols: 12,
        screen: screen
    };

    return new Grid(merge(defaults, options || {}));
}

View.prototype.addModule = function(x, y, width, height, mod)
{
    var node = this.grid.set(y, x, height, width, mod, {});
    node.view = this;

    this.modules.push(node);

    return node;
}

View.prototype.start = function()
{
    screen.render();
}

View.prototype.stop = function()
{
    for (var i = 0; i < this.modules.length; i++) {
        var m = this.modules[i];
        m.stop();
        screen.remove(m);
    }

    this.modules = [];
}

module.exports = View;
