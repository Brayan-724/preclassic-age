const { padding: textPadding } = require("terminal-essencial").spacing;
const TermText = require("./Text");
const style = require("./commons/color");

class TermMultiText {
	#texts = [];
	#padding = [0, -1];
	#paddingBg = "black";

	constructor(...args) { this.#init(...args); }

	#init = function(...texts) {
		if(texts.length !== 0) {
			this.addText(...texts);
		}
	}

	#addText = function(text) {
		if(TermText.is(text)) this.#texts.push(text);
		else
                if(typeof text === "string") this.#texts.push(new TermText(text));
		else
		if(typeof text === "object") {
			const Txt = new TermText(text.template || "")
				.setText(text.text)
				.setBg("BG_" + text.bg)
				.setFg("FG_" + text.fg)
				.setBright(text.bright)
				.setDim(text.dim)
				.setUnderline(text.underline)
				.setStrike(text.strike)
				.setReverse(text.reverse);

			this.#texts.push(Txt);
		}
	}

	addText(...texts) {
		for(const text of texts) 
			this.#addText(text);
		
		return this;
	}

	render(paddingChar = " ") {
		let str = "";
		let allText = "";
		for(const text of this.#texts) {
			str += text.render();
			allText += text.getText();
		}

		const [_, spL, spR] = textPadding(allText, ...this.#padding);
		
		const bgPadding = style.getStyle("BG_" + this.#paddingBg.toUpperCase());
		return  bgPadding + 
			(paddingChar.repeat(spL)) + 
			str + 
			bgPadding +
			(paddingChar.repeat(spR)) + 
			style.reset;
	}



	setPadding(left = 0, right = -1, color = "black") {
		this.#padding = [left, right];
		this.#paddingBg = color;
		return this;
	}
}

module.exports = TermMultiText;

if(require.main === module) {
	console.log(module.exports);

	console.log(" ---- TESTS ---- ");
	let t0, t1, t2, t3;
	
	t1 = new TermText()
		.setText(" Term Text ")
		.setBg("cyan")
		.setFg("white")
		.setBright(true);
	t2 = new TermMultiText(
		" String ",
		{
			text: " Object ",
			bg: "yellow",
			fg: "black",
			bright: true
		},
		t1
	);

	console.log(t2.render());
	
	t0 = new TermText()
		.setBg("blue")
		.setFg("white");
	t1 = new TermText(t0)
		.setText(" ---- ");
	t2 = new TermText(t0)
		.setText("TESTS")
		.setBright(true);
	t3 = new TermMultiText(t1, t2, t1)
		.setPadding(-1, -1, "blue");

	console.log(t3.render());
}
