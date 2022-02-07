exports.default = module.exports;

exports.num = function(n, length) {return (n=""+n),("0".repeat(Math.max(0,length-n.length)))+n}
