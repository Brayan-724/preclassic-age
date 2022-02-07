const padding = require("./spacing");

const pattern = {
	dark: {
		red: "8;5;1m",
		green: "8;5;2m",
		yellow: "8;5;3m",
		blue: "8;5;4m",
		magenta: "8;5;5m",
		cyan: "8;5;6m"
	},
	light: {
	},

	black: "8;5;16m",
	red: "8;5;9m",
	green: "2m",
	yellow: "3m",
	blue: "4m",
	magenta: "5m",
	cyan: "6m",
	white: "8;5;15m",
	crimson: "8;5;1m"
};

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",                                     blink: "\x1b[5m",                                          reverse: "\x1b[7m",                                        hidden: "\x1b[8m",
    strike: "\x1b[9m",

    bg: usePattern(pattern, "\x1b[4"),
    fg: usePattern(pattern, "\x1b[3")
};

function usePattern(template, prefix = "", subfix = "") {
	const nObj = {};
	function rr(obj, target) {
		for(let key in obj) {
			const v = obj[key];
			if(typeof v === "object") {
				target[key] = {};
				rr(v, target[key]);
			} else {
				target[key] = prefix + v + subfix;
			}
		}
	}

	rr(template, nObj);

	return nObj;
}

colors.presets = {
    dark: {
         white: colors.reset + colors.bg.black + colors.fg.white,
    },
    
    errorText: colors.reset + colors.bg.crimson + colors.fg.white,
    errorInfo: colors.reset + colors.bg.red + colors.fg.white + colors.bright
};

const presets = {
    error(msg = "", name = "!") {
	const [_, spL, spR] = padding(` ${name}  ${msg} `, 0, -1);
	return "" + 
	       colors.presets.errorInfo + 
	       (" ".repeat(spL + 1)) + 
	       name + " " +
	       colors.presets.errorText + 
	       " " + msg + 
	       (" ".repeat(spR + 1)) + 
	       colors.reset;
    }
};

module.exports = { colors, presets }

if(require.main == module) {
	console.log(module.exports);
}
