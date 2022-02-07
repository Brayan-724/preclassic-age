
const COLUMNS = process.stdout.columns;
const ROWS = process.stdout.rows;

function up(n) { return `\x1b[${n === -1 ? ROWS : n}A` };
function right(n) { return `\x1b[${n === -1 ? COLUMNS : n}C` };
function down(n) { return `\x1b[${n === -1 ? ROWS : n}B` };
function left(n) { return `\x1b[${n === -1 ? COLUMNS : n}D` };

function clearLine(n) { return `\x1b[${n}K` };
function clearScreen(n) { return `\x1b[${n}J` };

module.exports = {
	up, down,
	right, left,

	clearLine, clearScreen
};

if(require.main === module) console.log(module.exports);
