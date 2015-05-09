var merge = require('merge'),
    Node = require('blessed').Node,
    Log = require('blessed-contrib').log,
    docker = require('../lib/docker');

function ContainerLog(options)
{
    var defaults = {
        fg: "green",
        selectedFg: "green",
        refresh: 1000
    };

    if (!(this instanceof Node)) {
        return new ContainerLog(options);
    }

    options = merge(defaults, options || {});
    Log.call(this, options);
    this.interval;
}

ContainerLog.prototype.__proto__ = Log.prototype;

ContainerLog.prototype.start = function(container)
{
    if (this.interval) {
        console.error('Instance of '+this.constructor.name+' already started');
        process.exit(1);
    }

    this.setLabel('Logs '+container.Name+' ('+container.shortId+')');
    this.container = container;
    this.loop();
    this.interval = setInterval(this.loop.bind(this), this.options.refresh);
}

ContainerLog.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
    }
}

ContainerLog.prototype.loop = function()
{
    var width = this.width - this.iwidth;

    function split(str) {
        var arr = [];
        if (str.length > width) {
            arr.push(str.substr(0, width));
            arr = arr.concat(split('  '+str.substr(width)));
        } else {
            arr.push(str);
        }

        return arr;
    }


    docker.logs(this.container.Id, (function(lines) {
        var items = lines.reduce(function(arr, line) {
            return arr.concat(split(line));
        }, []);

        this.setItems(items);
        this.scrollTo(lines.length);
    }).bind(this));


    // var output = docker.logs(this.containerId);
    // var lines = output.toString().split('\n');
    // for (var i = 0; i < lines.length; i++) {
    //     this.log(lines[i]);
    // }

    // this.log(this.containerId+' Coucou la famille, si si '+ Math.random());
}

module.exports = ContainerLog;
