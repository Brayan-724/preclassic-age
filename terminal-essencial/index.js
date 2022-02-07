module.exports = {
	cursor: require("./cursor"),
	spacing: require("./spacing"),
	style: require("./colors"),
	styleNames: require("./colorNames")
}

if(require.main === module) console.log(module.exports);
