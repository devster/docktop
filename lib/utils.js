if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this.length ? this[this.length - 1] : null;
    };
};

Object.defineProperty(String.prototype, "ltrim", {
    enumerable: false,
    value: function (char) {
        if (this.substr(0, char.length) == char) {
            return this.substr(char.length).ltrim(char)
        }

        return this
    }
})

Object.defineProperty(String.prototype, "parseMemory", {
    enumerable: false,
    value: function () {
        var units = ['b', 'kib', 'mib', 'gib', 'tib', 'pib']

        var reg = /([\d.]*)\s*(\w{0,1}i?b)/i

        var match = reg.exec(this)

        if (!match) {
            return
        }

        var value = parseFloat(match[1]);
        var factor = units.indexOf(match[2].toLowerCase())

        return value * (Math.pow(1024, factor))
    }
})

Object.defineProperty(Number.prototype, "toHumanMemory", {
    enumerable: false,
    value: function (decimal) {
        var units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

        var factor = 0
        var size = this
        while(size >= 1024) {
            size /= 1024
            ++factor;
        }

        var defaultDec =  factor > 2 ? 3 : 2
        decimal = decimal == undefined ? defaultDec : decimal

        return size.toFixed(decimal) + ' ' + units[factor]
    }
})
