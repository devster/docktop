var Node = require('blessed').Node,
    merge = require('merge'),
    ContribTable = require('blessed-contrib').table

function Table(options)
{
    var defaults = {

    }

    if (!(this instanceof Node)) {
        return new Table(options)
    }

    options = merge(defaults, options || {})
    ContribTable.call(this, options)
}

Table.prototype.__proto__ = ContribTable.prototype

Table.prototype.destroy = function()
{
    if (this.rows) {
        this.rows.destroy()
        this.remove(this.rows)
    }

    ContribTable.prototype.destroy.call(this)
}

module.exports = Table
