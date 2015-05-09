var contrib = require('blessed-contrib'),
    View = require('./view'),
    listContainers = require('../modules/list-containers.js');

function Dashboard()
{
    View.call(this);
}

Dashboard.prototype.__proto__ = View.prototype;

Dashboard.prototype.start = function ()
{
    this.addModule(0, 0, 6, 6, listContainers).start();

    View.prototype.start();
}

module.exports = new Dashboard();
