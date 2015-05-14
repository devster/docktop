var merge = require('merge'),
    blessed = require('blessed'),
    Node = blessed.Node,
    Textbox = blessed.Text

function ContainerInfo(options)
{
    var defaults = {
        tags: true,
        fg: '#808080',
        scrollable: true,
        keys: true,
        mouse: true
    }

    if (!(this instanceof Node)) {
        return new ContainerInfo(options)
    }

    options = merge(defaults, options || {})

    Textbox.call(this, options)
    this.container = options.container
}

ContainerInfo.prototype.__proto__ = Textbox.prototype

ContainerInfo.prototype.start = function()
{
    var lines = []
    var container = this.container

    lines.push('{white-fg}Image: {/white-fg}'+container.Config.Image)
    lines.push('{white-fg}Working dir: {/white-fg}'+container.Config.WorkingDir)


    var volumes = container.HostConfig.Binds == undefined ? [] : container.HostConfig.Binds
    lines.push('{white-fg}Volumes: {/white-fg}'+(!volumes.length ? 'No volumes' : ''))
    volumes.forEach(function(l) { lines.push('  '+l) })

    var ports = container.stringPorts()
    lines.push('{white-fg}Ports: {/white-fg}'+(!ports.length ? 'No volumes' : ''))
    ports.forEach(function(l) { lines.push('  '+l) })

    for (var i = 0; i < 20; i ++) {
        lines.push ('Hello '+i)
    }

    this.setContent(lines.join('\n'))
}

ContainerInfo.prototype.destroy = function()
{
    Textbox.prototype.destroy.call(this)
}

module.exports = ContainerInfo
