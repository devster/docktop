var Table = require('../widget/table'),
    merge = require('merge'),
    Node = require('blessed').Node,
    docker = require('../lib/docker'),
    router = require('../panels/router'),
    screen = require('../panels/screen')

function ListContainers(options)
{
    var defaults = {
        keys: true,
        fg: 'green',
        columnSpacing:1,
        columnWidth: [14, 24, 18, 28],
        refresh: 1000
    };

    if (!(this instanceof Node)) {
        return new ListContainers(options);
    }

    options = merge(defaults, options || {});
    Table.call(this, options);
    this.updateLabel();
    this.interval;
    this.containers = [];
    this.lastKey = ''
    this.lastKeyHit

    this.rows.on('select', (function(item, i) {
        router.render('container_view', this.containers[i].container_id);
    }).bind(this));

    this.focus()
}

ListContainers.prototype.__proto__ = Table.prototype;

ListContainers.prototype.updateLabel = function(number)
{
    if (number) {
        this.setLabel('Running containers: '+number);
    } else {
        this.setLabel('No running containers');
    }
}

ListContainers.prototype.start = function()
{
    if (this.interval) {
        console.error('Instance of '+this.constructor.name+' already started');
        process.exit(1);
    }

    this.loop();
    this.interval = setInterval(this.loop.bind(this), this.options.refresh);

    screen.on('keypress', this.keypressListener.bind(this));
}

ListContainers.prototype.keypressListener = function(ch, key)
{
    var ts = (new Date()).getTime()
    var diff = ts - this.lastKeyHit;

    if (diff < 900 && this.lastKey == 'd' && key.name == 'd') {
        this.killSelectedContainer()
    }

    this.lastKey = key.name
    this.lastKeyHit = ts
}

ListContainers.prototype.killSelectedContainer = function()
{
    var c = this.containers[this.rows.selected];
    docker.kill(c.container_id, function() {
        this.loop()
    }.bind(this))
}

ListContainers.prototype.destroy = function()
{
    if (this.interval) {
        clearInterval(this.interval);
    }

    screen.off('keypress', this.keypressListener.bind(this))

    Table.prototype.destroy.call(this)
}

ListContainers.prototype.loop = function()
{
    var table = {
        headers: ['ID', 'Names', 'Status', 'Ports']
    };

    docker.ps((function(containers) {
        var data = [];

        this.containers = containers;

        if (containers.length) {
            data = containers.map(function(c) {
                return [c.container_id, c.names, c.status, c.ports];
            });
        }

        this.updateLabel(containers.length);

        table.data = data;
        this.setData(table);
    }).bind(this));
}

module.exports = ListContainers;
