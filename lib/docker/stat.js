function Stat(data)
{
    for (d in data) {
        this[d] = data[d];
    }
}

Stat.prototype.cpuUsage = function()
{
    return parseFloat(this.cpu);
}

Stat.prototype.stringCpuUsage = function(cpu)
{
    cpu = cpu != undefined ? cpu : this.cpuUsage();

    cpu = cpu < 10 ? cpu.toFixed(2) : cpu.toFixed(1);

    return cpu+'%';
}

Stat.prototype.stringMemoryLimit = function()
{
    return this.mem_usage_limit.split('/').last();
}

Stat.prototype.stringMemoryUsage = function()
{
    return this.mem_usage_limit.split('/')[0];
}

Stat.prototype.memoryUsage = function()
{
    return this.stringMemoryUsage().parseMemory();
}

module.exports = Stat;
