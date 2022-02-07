const _require = require("./require").call;

const fs = _require("fs");

module.exports = function(path) {return ()=>{
	if(!fs().existsSync(path)) fs().mkdirSync(path);
	return path;
}};
