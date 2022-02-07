const { style, styleNames } = require("terminal-essencial");

function exist(str) {
	if(typeof str !== "string") return false;
	return Object.keys(styleNames).includes(str);
}

function getStyle(str) {
	if(typeof str !== "string") return "";
	if(str === "") return "";
	if(!exist(str)) return "";

	let last = str.match(/^PRESET_/) ? style.presets : style.colors;

	for(let path of str.split("_")) {
		if(typeof last === "object")
			last = last[path.toLowerCase()];
		else 
			return "";
	}

	return last;
}

function getStyles(...styles) {
	let finalStyle = "";
	for(let style of styles) 
		finalStyle += getStyle(style);
	return finalStyle;
}

const CReset = style.colors.reset;

module.exports = {
	exist,
	getStyle,
	getStyles,
	colours: style.colors,
	colorNames: styleNames,

	reset: CReset,

	...styleNames
};


if(require.main === module) {
	console.log(module.exports, CReset);
	console.log("  -- Tests --  ");
	console.log("exist(\"BG_BLACK\"): " + exist("BG_BLACK"));
	let p1,p2,p3;
	console.log("getStyle(\"BG_CYAN\") + reset: " + getStyle("BG_CYAN") + " TEST " + CReset);

	p1 = getStyles("BRIGHT", "BG_RED", "FG_GREEN");
	p2 = p1 + " TEST ";
	p3 = p2 + CReset;
	console.log("getStyles(\"BG_RED\", \"FG_GREEN\", \"BRIGHT\") + reset: " + p3, [p1, CReset]);
}
