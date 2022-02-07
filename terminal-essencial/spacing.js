
function padding(text = "", left = -1, right = -1) {
	const txtL = text.length;
	const lW = process.stdout.columns; // Line Width
	if(txtL >= lW) return ""+text;
	let spaceL = lW - txtL;
	let spaceLt = 0;
	let spaceRt = 0;

	if(left === -1) {
		if(right === -1) {
			spaceLt = Math.floor(spaceL / 2);
			spaceRt = Math.ceil(spaceL / 2);
		} else {
			spaceRt = Math.min(Math.max(0, right), spaceL);
			spaceLt = spaceL - spaceRt;
                }
        } else {
		spaceLt = Math.min(Math.max(0, left), spaceL);
		spaceRt = spaceL - spaceLt;
	}

	return [(" ".repeat(spaceLt)) +
		text +
		(" ".repeat(spaceRt)),
		spaceLt, spaceRt];
}

module.exports = { 
	padding
};

if(require.main === module) console.log(module.exports);
