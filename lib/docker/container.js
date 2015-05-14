/**
    Data comes from a docker inspect command output
*/
function Container(data)
{
    for (d in data) {
        this[d] = data[d];
    }
}

Container.prototype.name = function()
{
    return this.Name.ltrim('/');
}

Container.prototype.shortName = function()
{
    return this.name();
}

Container.prototype.shortId = function()
{
    return this.Id.substr(0, 12);
}

Container.prototype.links = function()
{
    if (this.HostConfig == undefined || this.HostConfig.Links == undefined) {
        return [];
    }

    return this.HostConfig.Links.reduce(function (arr, str) {
        var name = str.split(':')[0];
        if (arr.indexOf(name) < 0) {
            arr.push(name);
        }

        return arr;
    }, []);
}

Container.prototype.linksShortNames = function()
{
    if (this.HostConfig == undefined || this.HostConfig.Links == undefined) {
        return {};
    }

    return this.HostConfig.Links.reduce(function (arr, str) {
        var parts = str.split(':');
        var name = parts[0];
        var sname = parts.last().split('/').last();

        if (!(name in arr) || sname.length < arr[name].length) {
            arr[name] = sname;
        }

        return arr;
    }, {});
}

Container.prototype.stringPorts = function()
{
    if (this.NetworkSettings == undefined || this.NetworkSettings.Ports == undefined) {
        return []
    }

    var ports = []

    for (ph in this.NetworkSettings.Ports) {
        var list = this.NetworkSettings.Ports[ph]

        ports = ports.concat(list.map(function(o) {
            return o.HostIp+':'+o.HostPort+'->'+ph
        }))
    }

    return ports
}

module.exports = Container;
