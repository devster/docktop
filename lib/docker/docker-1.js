var Wrapper = require('./docker-wrapper'),
    Container = require('./container'),
    Stat = require('./stat');

var docker = {
    wrapper: new Wrapper()
};

docker.test = function(callback)
{
    this.wrapper.rawExec('version', callback);
}

docker.kill = function(containerId, callback)
{
    this.wrapper.exec('stop -t 3 '+containerId, callback)
}

docker.followStats = function(containerId, callback)
{
    var h = this.wrapper.spawn('stats', containerId);

    h.stdout.on('data', function (str) {
        var stats = this.parseOutput(str.toString());

        stats = stats.map(function(s) {
            return new Stat(s);
        });

        if (stats.length > 0) {
            if (!(containerId instanceof Array)) {
                stats = stats[0];
            }

            callback(stats);
        }
    }.bind(this));

    return h;
}

docker.container = function(containerId, callback)
{
    this.wrapper.exec('inspect '+containerId, function (stdout, stderr) {
        var container = new Container(JSON.parse(stdout.toString())[0]);
        callback(container)
    })
}

docker.logs = function(containerId, callback)
{
    this.wrapper.exec('logs --tail=1000 '+containerId+' 2>&1', function(stdout) {
        callback(stdout.toString().split('\n'));
    });
}

docker.ps = function(done)
{
    var callback = (function (stdout) {
        done(this.parseOutput(stdout));
    }).bind(this);

    this.wrapper.exec('ps', callback);
}

docker.parseOutput = function(str)
{
    var lines = str.split('\n');
    var reg = /\s{2,}/;

    var head = lines[0].split(reg).map(function(word) {
        return word.replace(/\W+/g, '_').replace(/_$/g, '').toLowerCase();
    });

    lines = lines.slice(1).reduce(function(arr, line) {
        var values = line.split(reg);

        if (values.length < head.length) {
            return arr;
        }

        var object = {};

        for (var i = 0; i < head.length; i++) {
            object[head[i]] = values[i];
        }

        arr.push(object);
        return arr;
    }, []);

    return lines;
}

module.exports = docker;
