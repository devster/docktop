var merge = require('merge'),
    childProcess = require('child_process');

function DockerWrapper(options)
{
    var defaults = {
        bin: 'docker'
    };

    this.options = merge(defaults, options || {});
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

DockerWrapper.prototype.execSync = function(cmd, errorCallback)
{
    cmd = this.options.bin+' '+cmd;

    try {
        return childProcess.execSync(cmd);
    } catch (e) {
        if (errorCallback) {
            errorCallback(e);
        } else {
            throw 'Error executing docker command: '+cmd;
            process.exit(1);
        }
    }
}

module.exports = DockerWrapper;
