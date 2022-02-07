const all = {};

module.exports = {
	direct: function(path) {
		if(!all[path]) 
			all[path] = require(path);
		return all[path];
	},
	call: function(path) {
		const o = {
			data: undefined,
			getted: false
		};

		function f() {
			if(!o.getted)
				o.data = require(path),
				o.getted = true;

			return o.data;
		};

		return f;
	}
}
