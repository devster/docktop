var screen = require('./screen'),
    View = require('./view'),
    router = require('./router'),
    docker = require('../lib/docker'),
    containerLog = require('../modules/container-log.js');

function ContainerView()
{
    View.call(this);
    this.containerId;
}

ContainerView.prototype.__proto__ = View.prototype;

ContainerView.prototype.start = function (containerId)
{
    var container = docker.container(containerId);

    this.addModule(0, 0, 9, 5, containerLog).start(container);

    screen.onceKey(['backspace'], function (ch, key) {
        router.prev();
    });

    View.prototype.start();
}

module.exports = new ContainerView;
