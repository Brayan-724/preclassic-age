const TermText = require("../Text");

class TermPatternPart extends TermText {
	#width = 1;

	constructor(obj) {
		super(" ");
		if(obj) this.set(obj);
	}

	set(obj) {
		if(typeof obj !== "object") return this;
		this.setText(obj);
		if(TermPatternPart.is(obj))
			this.setWidth(obj.getWidth());
		else
			this.setWidth(obj.width);

		return this;
	}

	setWidth(width) {
		if(typeof width === "number") this.#width = width === -1 ? -1 : Math.min(Math.max(width, 0), 1);
		else
		if(typeof width === "string") this.#width = width;

		return this;
	}

	getWidth() {return this.#width;}
	


	static from(other) {
		if(TermPatternPart.is(other)) return other;
		return new TermPatternPart(other);
	}
	
	static is(other) {return other instanceof TermPatternPart;}
}


module.exports = TermPatternPart;

if(require.main === module) {
	console.log(module.exports);
}
