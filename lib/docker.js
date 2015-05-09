var Wrapper = require('./docker-wrapper.js');

var docker = {
    wrapper: new Wrapper()
};

docker.test = function(callback)
{
    this.wrapper.execSync('version', callback);
}

docker.container = function(containerId)
{
    var output = this.wrapper.execSync('inspect '+containerId).toString();
    var container = JSON.parse(output)[0];

    container.shortId = container.Id.substr(0, 12);

    return container;
}

docker.logs = function(containerId, callback)
{
    this.wrapper.exec('logs --tail=100 '+containerId+' 2>&1', function(stdout) {
        callback(stdout.toString().split('\n'));
    });
}

docker.ps = function(done)
{
    callback = function (stdout) {
        var lines = stdout.split('\n');
        var reg = /\s{2,}/;

        var head = lines[0].split(reg).map(function(word) {
            return word.replace(' ', '_').toLowerCase();
        });

        lines = lines.slice(1).reduce(function(arr, line) {
            var values = line.split(reg);

            if (values.length < 2) {
                return arr;
            }

            var object = {};

            for (var i = 0; i < head.length; i++) {
                object[head[i]] = values[i];
            }

            arr.push(object);
            return arr;
        }, []);

        done(lines);
    };

    this.wrapper.exec('ps', callback);
}

module.exports = docker;
