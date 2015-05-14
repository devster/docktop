var merge = require('merge'),
    blessed = require('blessed'),
    Node = blessed.Node,
    Text = blessed.Text,
    docker = require('../lib/docker')

function ContainerLog(options)
{
    var defaults = {
        fg: "green",
        refresh: 1000,
        scrollable: true,
        keys: true,
        mouse: true
    };

    if (!(this instanceof Node)) {
        return new ContainerLog(options);
    }

    options = merge(defaults, options || {});
    Text.call(this, options);
    this.interval;
    this.container = options.container
}

ContainerLog.prototype.__proto__ = Text.prototype;

ContainerLog.prototype.start = function()
{
    if (this.interval) {
        console.error('Instance of '+this.constructor.name+' already started');
        process.exit(1);
    }

    this.setLabel('Logs '+this.container.name()+' ('+this.container.shortId()+')');
    this.loop();
    this.interval = setInterval(this.loop.bind(this), this.options.refresh);
}

ContainerLog.prototype.destroy = function()
{
    if (this.interval) {
        clearInterval(this.interval);
    }

    Text.prototype.destroy.call(this)
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

    docker.logs(this.container.Name, (function(lines) {
        var items = lines.reduce(function(arr, line) {
            return arr.concat(split(line));
        }, []);

        var content = items.join('\n')

        if (this.getContent() != content) {
            this.setContent(items.join('\n'))
            this.scrollTo(items.length)
        }
    }).bind(this));
}

module.exports = ContainerLog;
