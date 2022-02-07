const TermText = require("./Text");
const TermLinePattern = require("./pattern/LinePattern");
const COLUMNS = process.stdout.columns;

class TermBlankLine {
	#pattern = new TermLinePattern();

	constructor(pattern) {
		if(pattern) this.setPattern(pattern);
	}

	render(mode = 0) {
		const patterns = this.#pattern.getPattern();
		let str = "";
		let l = COLUMNS;
		
		if(mode === TermBlankLine.FILL) {
			for(let pattern of patterns) {
				const text = pattern.getText() || " "
			 	   , width = pattern.getWidth()
			  	  , space = typeof width == "string" ? Math.min(parseInt(width, 10), l) : Math.min(Math.floor(COLUMNS * width), l)
			  	  , r = Math.floor(space / text.length);
				const final = new TermText(pattern)
					.setText(text.repeat(r))
					.render();
				l -= text.repeat(r).length;
				str += final;
			}

			if(l >= 1) {
				const target = patterns[patterns.length - 1];
				str += new TermText(target)
					.setText(target.getText().slice(0, l))
					.render();
			}
		} else 
		if(mode === TermBlankLine.REPEAT) {
			let i = 0;
			const im = patterns.length;
			while(true) {
				const ptt = patterns[i];
				const text = ptt.getText()
				    , r = Math.min(text.length, l);
				str += new TermText(ptt)
					.setText(text.slice(0, r))
					.render();
				l -= text.length;

				if(l <= 0) break;

				i++;
				i %= im;
			}
		}

		return str;
	}

	setPattern(pattern) {
		if(TermLinePattern.is(pattern)) this.#pattern = pattern;
		else
		if(TermLinePattern.isValid(pattern)) this.#pattern.setPattern(pattern);

		return this;
	}


	/* Modes Enum */
	static FILL = 0;
	static REPEAT = 1;
}

module.exports = TermBlankLine;

if(require.main === module) {
	console.log(module.exports);

	const line = new TermBlankLine([
		{ text: " Hola ", bg: "red"  },
		{ text: " Adios ", bg: "blue" }
	]);
	console.log(line.render(TermBlankLine.REPEAT));
}
