var screen = require('./screen'),
    View = require('./view'),
    router = require('./router'),
    docker = require('../lib/docker'),
    containerLog = require('../modules/container-log.js'),
    containerStat = require('../modules/container-stat.js')
    containerInfo = require('../modules/container-info.js')

function ContainerView()
{
    View.call(this)
    this.colors = ['yellow', 'magenta', 'red', 'cyan', 'blue', 'green', 'white']
}

ContainerView.prototype.__proto__ = View.prototype;

ContainerView.prototype.start = function (containerId)
{
    docker.container(containerId, function(container) {
        this.container = container

        this.addModule(0, 0, 18, 10, containerLog, {container: container})
        this.addModule(18, 0, 6, 10, containerInfo, {container: container})

        var cpu = this.addModule(0, 10, 12, 7, containerStat, {label: 'CPU usage (%)'})
        var mem = this.addModule(0, 17, 12, 7, containerStat, {label: 'Memory usage'})

        this.followStats(function(containers, names, stats) {
            var cseries = [], mseries = []
            var totalCpu = 0, totalMem = 0

            for (var i = 0; i < stats.length; i++) {
                var stat = stats[i]

                if (stat.container == undefined) {
                    return;
                }

                var color = this.colors[containers.indexOf(stat.container)];
                var name =  names[stat.container];

                var memBites = stat.memoryUsage();
                totalCpu += stat.cpuUsage();
                totalMem += memBites;
                cpu.addYData(stat.container, stat.cpuUsage());
                mem.addYData(stat.container, memBites / 1024 / 1024);


                var cline = {
                    title: name+': '+stat.stringCpuUsage(),
                    style: {
                        line: color
                    },
                    x: cpu.xData,
                    y: cpu.yData[stat.container]
                };

                var mline = {
                    title: name+': '+stat.stringMemoryUsage(),
                    style: {
                        line: color
                    },
                    x: mem.xData,
                    y: mem.yData[stat.container]
                };

                cseries.push(cline);
                mseries.push(mline);
            }

            cpu.setLabel('CPU usage: '+stat.stringCpuUsage(totalCpu));
            mem.setLabel('Memory usage: '+totalMem.toHumanMemory()+'/'+stat.stringMemoryLimit());

            cpu.setData(cseries);
            mem.setData(mseries);
        }.bind(this))

        screen.onceKey(['backspace'], function (ch, key) {
            router.prev()
        })

        View.prototype.start.call(this)
    }.bind(this))
}

ContainerView.prototype.stop = function()
{
    if (this.childp) {
        this.childp.kill()
        this.childp = null
    }

    View.prototype.stop.call(this)
}

ContainerView.prototype.followStats = function(callback)
{
    var containers = [this.container.name()].concat(this.container.links())
    var names = this.container.linksShortNames()
    names[this.container.name()] = this.container.shortName()

    this.childp = docker.followStats(containers, function (stats) {
        if (stats.length != containers.length) {
            return
        }

        callback(containers, names, stats);
    }.bind(this))

    this.childp.on('close', function() {
        if (this.childp == null) {
            return
        }

        setTimeout(function() {
            this.stop()
            this.start(this.container.Name)
        }.bind(this))
    }.bind(this))
}

module.exports = new ContainerView
