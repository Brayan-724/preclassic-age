#!/bin/env node
const colors = require("./colors").colors;
const { padding } = require("terminal-essencial").spacing;
const COLUMNS = process.stdout.columns;


function space(n) { return " ".repeat(n); }


function expected(name, assert) {
	const nameLog =
                colors.bg.white +
                colors.fg.black +
		">  " +                                                    colors.bright +
		name + ": ";

	const assertLog =
		(assert ?
			colors.bg.green + colors.fg.white :
			colors.bg.red + colors.fg.white
		) +
		(assert ? " SUCCESS " : " FAILED ");
	
	const [_, spaceL, spaceR] = padding(">  " + name + ": " + (assert ? " SUCCESS " : " FAILED "), 1, -1);

	console.log(colors.bg.white + 
		(" ".repeat(spaceL)) +
		nameLog + assertLog + 
		(" ".repeat(spaceR)) +
		colors.reset);
}

function describe(title = "TESTS") {
	const [titleLog] = padding(title);

	console.log(
		colors.bg.cyan + 
		colors.fg.white +
		colors.bright +
		titleLog +
		colors.reset);	
}

if(require.main === module) {
	describe("Module Testing");
	const [_, spL, spR] = padding("Error:  Don't use this module directly ", 2, -1);

	const blankLine = "" + 
		colors.bg.red + 
		space(9) + 
		colors.bg.crimson + 
		space(COLUMNS - 9);

	console.log(
		blankLine +
		colors.presets.errorInfo + 
		space(spL) + 
		"Error: " + 
		colors.presets.errorText + 
		" Don't use this module directly " + 
		space(spR) + 
		blankLine + 
		colors.reset);
}

module.exports = {
	describe,
	expected
}
