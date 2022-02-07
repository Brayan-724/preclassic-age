const TermPatternPart = require("./PatternPart");

class TermLinePattern {
	#pattern = [new TermPatternPart()];

	constructor(pattern) {this.setPattern(pattern)}

	
	/* Setters/Getters (OOP) Methods */

	setPattern(pattern) {
		if(TermLinePattern.is(pattern)) 
			this.#pattern = pattern.getPattern();
		else
		if(TermLinePattern.isValid(pattern))
			this.#pattern = [],
			this.append(pattern);
		return this;
	}

	getPattern() {
		const nw = [];
		for(let ptt of this.#pattern) 
			nw.push(new TermPatternPart().set(ptt));

		return nw;
	}

	/* Append/Preppend pattern */

	append(...patterns) {
		if(patterns.length === 1) {
			const pattern = patterns[0];
			if(!TermLinePattern.isValid(pattern)) return this;
			if(TermLinePattern.is(pattern))
				this.#pattern = this.#pattern.concat(pattern.getPattern());
			else
			if(Array.isArray(pattern)) {
				this.append(...pattern);
			} else
				this.#pattern.push(TermPatternPart.from(pattern));
		} else 
		if(patterns.length >= 2) {
			for(let pattern of patterns)
				this.append(pattern);
		}

		return this;
	}

	preppend(...patterns) {
		if(patterns.length === 1) {
			const pattern = patterns[0];
			if(!TermLinePattern.isValid(pattern)) return this;
			if(TermLinePattern.is(pattern))
				this.#pattern = pattern.getPattern().concat(this.#pattern);
			else
			if(Array.isArray(pattern)) 
				this.preppend(...pattern);
			else
				this.#pattern.unshift(TermPatternPart.from(pattern));
		} else 
		if(patterns.length >= 2) 
			for(let pattern of patterns.reverse())
				this.preppend(pattern);

		return this;
	}



	/* Comparation */

	static is(other) { return other instanceof TermLinePattern }
	static isValid(other) {
		if(TermLinePattern.is(other)) return true;
		if(other == null) return false;
		if(typeof other !== "object") return false;
		
		if(Array.isArray(other)) 
			for(let oth of other) {
				if(typeof oth !== "object") return false;
			}

		return true;
	}
}

module.exports = TermLinePattern;
