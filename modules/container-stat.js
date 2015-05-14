var merge = require('merge'),
    Node = require('blessed').Node,
    Line = require('../widget/line')

function ContainerStat(options)
{
    var defaults = {
        showLegend: true,
        numYlabels: 15,
        points:60
    }

    if (!(this instanceof Node)) {
        return new ContainerStat(options)
    }

    options = merge(defaults, options || {})

    Line.call(this, options);
    this.yData = {};

    // create one time for all the x data
    // the number of line points will be fix
    this.xData = [];
    for (var i = 0; i < this.options.points; i++) {
        this.xData.push(0);
    }
}

ContainerStat.prototype.__proto__ = Line.prototype;

ContainerStat.prototype.destroy = function()
{
    this.yData = null;

    Line.prototype.destroy.call(this)
}

ContainerStat.prototype.addYData = function(id, data)
{
    id in this.yData ? this.yData[id].push(data) : this.yData[id] = [data];

    this.yData[id] = this.yData[id].slice(-this.options.points);

    var pad = [];
    for (var i = 0; i < (this.options.points-this.yData[id].length); i++) {
        pad.push(0);
    }

    this.yData[id] = pad.concat(this.yData[id]);
}

module.exports = ContainerStat
