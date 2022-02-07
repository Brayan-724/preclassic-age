const cursor = require("../../terminal-essencial/cursor.js");
const Text = require("../Text");


module.exports = 
class TermAnimation {
	#events = {
		start: [],
		end: [],
	};

	#text = new Text();

	constructor(...args) {
		this.#init(...args);
	}
	
	#init() {
		this.cursor = cursor;
		
		this.addEventListener = this.addEventListener.bind(this);
		this.run = this.run.bind(this);

		for(let eventName in this.#events) {
			const event = this.#events[eventName];
			Object.defineProperty(this, "on" + eventName, {
				set(f) {
					if(typeof f === "function") event.push(f);
					return f;
				},

				get() {return null}
			});
		}
	}

	#executeEvent(evt, ...args) {
		const events = this.#events[evt];
		if(events != null && Array.isArray(events)) {
			for(let event of events) 
				event(...args);
			return true;
		} else {
			return false;
		}
	}

	addEventListener(evt, f) {
		const events = this.#events[evt];
		if(events != null && 
		   Array.isArray(events) && 
		   typeof f === "function"
		) { events.push(f); };

		return f;
	}
	
	/* Animation Functions */
	
	wait(ms) {
		return new Promise(res => setTimeout(res, ms));
	}

	clearLine(relative) {
		let str = "";
		if(relative != 0) {
			if(relative < 0) 
				str += this.cursor.up(-relative);
			else 
				str += this.cursor.down(relative);
		}
		str += this.cursor.left(-1);
		str += " ".repeat(this.width);
		return {
			run() {console.log(str);},
			get() {return str}
		}
	}

	get width() {
		return process.stdout.columns:
	}

	
	/* Life Cycle Handlers */
	async run() {
		const e = new Event();
		
		this.#executeEvent("start", e);
		this._run();
		this.#executeEvent("end", e);
	}

	/* Life Cycle Custom */
	_run() {}
}

if(require.main === module) console.log(module.exports);
