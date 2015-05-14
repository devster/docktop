var merge = require('merge'),
    childProcess = require('child_process');

function DockerWrapper(options)
{
    var defaults = {
        bin: 'docker'
    };

    this.options = merge(defaults, options || {});
}

DockerWrapper.prototype.spawn = function()
{
    var args = Array.prototype.slice.call(arguments).reduce(function (arr, arg) {
        return arr.concat(arg);
    }, []);

    return childProcess.spawn(this.options.bin, args);
}

DockerWrapper.prototype.rawExec = function(cmd, callback)
{
    cmd = this.options.bin+' '+cmd;

    return childProcess.exec(cmd, callback);
}


DockerWrapper.prototype.exec = function(cmd, done)
{
    cmd = this.options.bin+' '+cmd;

    var callback = function (err, stdout, stderr) {
        if (err) {
            throw 'Error executing docker command: '+cmd+'\n'+stdout+stderr;
            process.exit(1);
        }

        done(stdout, stderr);
    };

    return childProcess.exec(cmd, callback);
}

module.exports = DockerWrapper;
