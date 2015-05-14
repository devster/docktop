var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    screen = require('./screen'),
    View = require('./view'),
    listContainers = require('../modules/list-containers.js')

function Dashboard()
{
    View.call(this);
}

Dashboard.prototype.__proto__ = View.prototype;

Dashboard.prototype.start = function ()
{
    this.addModule(0, 0, 24, 16, listContainers)

    this.addFooter()

    View.prototype.start.call(this)
}

Dashboard.prototype.addFooter = function ()
{
    var commands = {
			'dd': 'Stop container',
            'r': 'Restart container'
		}

		var text = ''
		for (var c in commands) {
			var command = commands[c]
			text += '  {white-bg}{black-fg}' + c + '{/black-fg}{/white-bg} ' + command
		}

		var footer = blessed.text({
			bottom: '0',
			left: '0%',
			width: '100%',
			align: 'right',
			tags:true,
			content: text,
			fg: '#808080'
		})

		this.append(footer)
}

module.exports = new Dashboard()
