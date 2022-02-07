const { colors, presets } = require("./colors");

function eachNames(obj, path = "", target = {}) {
	for(const name in obj) {
		const NAME = name.toUpperCase();
		if(typeof obj[name] === "object")
			eachNames(obj[name], path + NAME + "_", target);
		else
			target[path + NAME] = path + NAME;
	}

	return target;
};

const colorConst = eachNames(colors);
const presetConst = eachNames(presets, "PRESET_");

module.exports = {
	...colorConst,
	...presetConst
};

if(require.main === module) console.log(module.exports);
