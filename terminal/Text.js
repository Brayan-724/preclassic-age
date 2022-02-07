const style = require("./commons/color");

class TermText {
	#text = "";
	#mods = {
		bg: "BLACK",
		fg: "WHITE",
		bright: false,
		underline: false,
		reverse: false,
		strike: false,
		dim: false,

		others: []
	};

	constructor(...args) {this.#init(...args);}

	#init = (text) => {
		if(text != null) this.setText(text);
	}
	
	/* Copy properties of another [TermText] */
	#copyText = (other) => {
		if(!TermText.is(other)) {
			other = TermText.from(other);
		}

		this.#text = other.getText();
		this.#mods = other.getModifications();

		return this;
	}

	copy() {return new TermText(this);}

	render(resetAfter = true) {
		let str = "";

		str += style.getStyles(
			this.getBgColor(), 
			this.getFgColor(), 
			this.getBright() ? "BRIGHT" : "",
			this.getDim() ? "DIM" : "",
			this.getUnderline() ? "UNDERLINE" : "",
			this.getStrike() ? "STRIKE" : "",
			this.getReverse() ? "REVERSE" : ""
		);
		
		for(let custom of this.getCustom()) str += custom;
		str += this.getText();

		if(resetAfter) str += style.reset;

		return str;
	}
	
	/* ############################ */
	/* Properties setters - Methods */
	/* ############################ */
	
	setText(text = "") {
		if(typeof text === "string") 
			this.#text = text;
		else 
		if(typeof text === "object")
			this.#copyText(text);
		
		return this;
	}

	setBg(color) {
		if(typeof color === "boolean") {
			if(!color) this.#mods.bg = false;
			return this;
		}
		if(typeof color !== "string") return this;
		color = color.toUpperCase();
		if(!color.match(/^BG_/)) color = "BG_" + color;
		else
		if(color.toLowerCase() === "bg_default") return (this.#mods.bg = "BLACK"), this;
		if(!style.exist(color)) return this;

		this.#mods.bg = [...color].splice(3).join("");
		return this;
	}

	setFg(color) {
		if(typeof color === "boolean") {
			if(!color) this.#mods.fg = false;
			return this;
		}
		if(typeof color !== "string") return this;
                color = color.toUpperCase();
		if(!color.match(/^FG_/)) color = "FG_" + color;
		else
                if(color.toLowerCase() === "fg_default") return (this.#mods.fg = "WHITE"), this;
		if(!style.exist(color)) return this;

		this.#mods.fg = [...color].splice(3).join("");
                return this;
        }

	setBright(has = false) 	  { if(typeof has === "boolean") this.#mods.bright = has;    return this; }

	setDim(has = false) 	  { if(typeof has === "boolean") this.#mods.dim = has; 	     return this; }

	setUnderline(has = false) { if(typeof has === "boolean") this.#mods.underline = has; return this; }

	setStrike(has = false)    { if(typeof has === "boolean") this.#mods.strike = has;    return this; }

	setReverse(has = false)   { if(typeof has === "boolean") this.#mods.reverse = has;   return this; }

	addCustom(str) {
                if(typeof str === "string" && 
		   !this.hasCustom(str))
			this.#mods.other.push(str);

                return this;
        }

	remCustom(str) {
		if(typeof str === "string" && 
		   this.hasCustom(str))
			this.#mods.others.filter(e => e !== str);

		return this;
	}

	hasCustom(str) {return this.#mods.other.include(str);}


	/* ############################ */
	/* Properties getters - Methods */
	/* ############################ */
	
	getBg()		{return this.#mods.bg;}
	getBgColor()	{return this.#mods.bg === false ? "" : "BG_" + this.#mods.bg;}
	getFg()		{return this.#mods.fg;}
	getFgColor()	{return this.#mods.fg === false ? "" : "FG_" + this.#mods.fg;}
	getBright()	{return this.#mods.bright;}
	getDim()	{return this.#mods.dim;}
	getUnderline()	{return this.#mods.underline;}
	getStrike()	{return this.#mods.strike;}
	getReverse()	{return this.#mods.reverse;}
	getCustom()	{return [...this.#mods.others];}

	getText() 	{return this.#text;}
	getModifications() {
		return {
			bg: this.getBg(),
			fg: this.getFg(),
			bright: this.getBright(),
			dim: this.getDim(),
			underline: this.getUnderline(),
			strike: this.getStrike(),
			reverse: this.getReverse(),
			others: this.getCustom(),
		};
	}

	
	static from(obj) {
		if(TermText.is(obj) || typeof obj === "string") return new TermText(obj);
		if(typeof obj === "object" && obj !== null) {
			return new TermText()
				.setText(obj.text)
				.setBg(obj.bg)
				.setFg(obj.fg)
				.setBright(obj.bright)
				.setDim(obj.dim)
				.setUnderline(obj.underline)
				.setStrike(obj.strike)
				.setReverse(obj.reverse);
		}

		return new TermText();
	}

	static is(other) { 
		return other instanceof TermText; 
	}
}

module.exports = TermText;

if(require.main === module) {
	console.log(module.exports);

	console.log(" --- TESTS --- ");

	let t1 = new TermText()
		.setText(" This is a Test ")
		.setBg(style.BG_CYAN)
		.setFg(style.FG_BLACK)
		.setBright(true);
	console.log(t1.getModifications());
	console.log(t1.render(true));
	//

}
