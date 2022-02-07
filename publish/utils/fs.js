const _require = require("./require").call;

const child_process = _require("child_process");

function copyDir(from, to) {
	return new Promise(res => {
                child_process()
			.spawn("cp", ["-r", from, to])
			.on("exit", (code) => {
				res(code == 0 || code == 1)
;
			});
        });
}

function rmDir(path) {
	return new Promise(res => {
		child_process()
			.spawn("rm", ["-r", path])
			.on("exit", (code) => {
                                res(code == 0 || code == 1);
			});
        });
}

module.exports = {
	copyDir, rmDir
}
