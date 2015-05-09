var Table = require('blessed-contrib').table,
    merge = require('merge'),
    Node = require('blessed').Node,
    docker = require('../lib/docker'),
    router = require('../panels/router');

function ListContainers(options)
{
    var defaults = {
        keys: true,
        fg: 'green',
        columnSpacing:1,
        columnWidth: [24, 24],
        refresh: 2000
    };

    if (!(this instanceof Node)) {
        return new ListContainers(options);
    }

    options = merge(defaults, options || {});
    Table.call(this, options);
    this.updateLabel();
    this.interval;
    this.containers = [];
    this.focused = false;
    this.rows.on('select', (function(item, i) {
        router.render('container_view', this.containers[i].container_id);
    }).bind(this));
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
}

ListContainers.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
    }

    this.focused = false;
}

ListContainers.prototype.loop = function()
{
    var table = {
        headers: ['ID', 'names']
    };

    docker.ps((function(containers) {
        var data = [];

        this.containers = containers;

        if (containers.length) {
            data = containers.map(function(c) {
                return [c.container_id, c.names];
            });

            if (!this.focused) {
                this.focus();
                this.focused = true;
            }
        }

        this.updateLabel(containers.length);

        table.data = data;
        this.setData(table);
    }).bind(this));
}

module.exports = ListContainers;
