#!/bin/env node
const { resolve, join, dirname, parse: pathParse } = require("path");
const utils = require("./utils");
const _require = utils.require.direct;
const normalize = utils.normalize;

const fs = utils.require.call("fs");

const package = require("./package.json");
const COLUMNS = process.stdout.columns;

const HOME = process.env.HOME;
const jsDir = resolve(HOME, "js");
const nodeModulesDir = utils.dir(resolve(jsDir, "node_modules"));
const publishedDir = utils.dir(resolve(jsDir, "published"));

let EXECDIR = dirname(process.argv[1]);
if(EXECDIR === join(process.env.PREFIX, "bin")) 
	EXECDIR = join(process.env.PREFIX, "lib", "node_modules", package.name);

const START  = "\x1b[100D"
    , UP     = "\x1b[1A"
    , RMLINE = "\x1b[0K";

const PREFIX = "\x1b[38;5;9m\x1b[1m[PUBLISH] \x1b[0m";

let logLevel = 0;

function getPkgDependencies(path) {return getPackageJson(path).dependencies || {};}function getPackageJson(path) {return _require(getPackagePath(path));}function getPackagePath(path) {return path.endsWith("package.json") ? path : join(path, "package.json");}

function getDependencies(path) {
	let r = {};
	const dps = getPkgDependencies(path);
	for(const dp in dps) {
		const pnm = join(path, "node_modules", dp)
		    , nm  = join(nodeModulesDir(), dp);
		if(fs().existsSync(pnm)) 
			r = {...r, ...getDependencies(pnm)}
		else
		if(fs().existsSync(nm)) 
			r = {...r, ...getDependencies(nm)};
		else continue;

		r[dp] = [];
	}

	return r;
}

function execNodeBin(pkgPblDir, echo = true) {
	if(typeof pkgPblDir !== "string") {
		throw new TypeError("'pkgPblDir' should be string, is " + typeof pkgPblDir);
	}

	console.log();

	return new Promise(res => {
		_require("child_process")
			.spawn(EXECDIR + "/nodeBin.sh", [echo, pkgPblDir], echo ? { stdio: "inherit" } : undefined)
			.on("exit", function (code, err) {
				if(code == 0 || code == 1) return res(true);
				console.log(code, err);
				res(false);
			})
	});
}

function wait(ms) {return new Promise(res=>setTimeout(res,ms))};

function _log(...args) {
	// Only write if log level is more or equal than 1
	if(logLevel >= 1) {
		// Normalize arguments
		const l = args.length;
		let p = "", 
		    s = "", 
		    str = "";
		if(l === 0) str = PREFIX;
		else
		if(l === 1) s = args[0];
		else 
			p = args[0], 
			s = args
				.slice(1)
				.reduce((a,b)=>((Array.isArray(b) ? a.concat(b) : a.push(b)), a),[])
				.join("");
		p = (typeof p === "string" ? 
			p : 
			Array.isArray(p) ? 
				p.join("") : 
				"");
		
		// Concat arguments with prefix
		str = p + PREFIX + s;
		
		// Send to out
		console.log("\x1b[1A\x1b[100D" + str);
	}
}

function credits() {
	console.log(`\x1b[31;1m[PUBLISH] \x1b[2mBy \x1b[0;35;1mApika Luca\x1b[0;31m - \x1b[0;33;1m${package.version}\x1b[0m`);
}

async function run(packageName, _logLevel) {
	logLevel = _logLevel;
	console.log();
	const { existsSync, promises: _fs$promises} = fs();
	const { readdir } = _fs$promises;
	const { copyDir, rmDir } = utils.fs;
	
	{
	_log("Reading `node_modules` ...");
	const modulesList = await readdir(nodeModulesDir());
	_log(START + RMLINE, "`node_modules` readed √\n");

	_log(`Searching \`${packageName}\` in \`node_modules\` ...`);
	if(!modulesList.some(e=>e===packageName))
		throw new ReferenceError(`\`${packageName}\` don't exist in \`node_modules\`. Check name or Move/copy the directory of your package to \`node_modules\` to can read it.`);
	_log(START + RMLINE, "Package founded √\n");
	}

	const packageDir = join(nodeModulesDir(), packageName);
	const pkgMdlDir  = join(packageDir, "node_modules");
	
	/* Si ya existe el paquete en ~/js/published/ lo elimina */
	_log("Removing last update ...");
	const pblDir = publishedDir();
	const pkgPblDir = join(pblDir, packageName);
	const pkgMdlPblDir = utils.dir(join(pkgPblDir, "node_modules"));

	try { await rmDir(resolve(process.env.HOME, join("..","usr","lib","node_modules", packageName))); } catch {}
	try { await rmDir(pkgPblDir); } catch {}
	_log(START + RMLINE, "Last update removed succefully √\n");
	
	{ /* Copia el paquete hacia ~/js/published/ */
	_log("Copying package to published directory ...");
	if(!(await copyDir(packageDir, pkgPblDir)))
		throw new Error("Copy package failed. " + `From ${packageDir} to ${pkgPblDir}.`);
	_log(START + RMLINE, "Package copied succefully √\n");
	}

	{ /* Busca los modulos que no estan en el paquete y los 'instala' (copia) */
	const l = "Searching no installed modules on package and copy it ...";
	let ml = l.length;
	const ln = ((ml + 10) / COLUMNS)|0;
	_log(l);
	const moduleList = await readdir(pkgMdlPblDir());
	const moduleTargets = Object.keys(getDependencies(pkgPblDir));
	const maxTargets = moduleTargets.length;

	const fromNM = (mName) => join(nodeModulesDir(), mName);
	const setNum = (i) => {
		const t = ` ${normalize.num(i + 1, maxTargets)}/${maxTargets}`;
		_log(START + UP.repeat(ln), `${l}${t}`);
		ml = Math.max(ml, l.length + t.length);
	};
		
	let i = 0;
	for(let mName of moduleTargets) {
		const fPath = fromNM(mName);
		const tPath = join(pkgMdlPblDir(), mName);
		
		setNum(i++);
		if(maxTargets <= 2) await wait(500);
		else
		if(maxTargets <= 5) await wait(100);
		else
		if(maxTargets <= 10) await wait(10);
		if(existsSync(tPath)) continue;
		if(!(await copyDir(fPath, tPath))) {
			throw new Error(`Copy '${mName}' module failed. From ${fPath} to ${tPath}`);
		}
	}
	_log(START + RMLINE + (UP + RMLINE).repeat((ml + 10) / process.stdout.columns|0), "Modules installed √\n");
	}
	
	{ /* Hace que el binario del paquete pueda ser ejecutado desde cualquier lugar con `npm install --global` (codigo completo en 'nodeBin.sh') */
	_log("Converting package to global bin ...");
	if(!(await execNodeBin(pkgPblDir, logLevel >= 1))) {
		throw new Error("Convert failed. Contact me to get help");
	}
	_log(START + RMLINE + (UP + RMLINE).repeat(2), "Converted to global bin √\n");
	}


	credits();
}


// Middleware to show help or run program

const argv = process.argv.slice(2);

function usage() {
	console.log(""+
`Usage: publish <packageName> [logLevel]
       publish --help
 
 packageName: EXACT name of your package.
 logLevel: number of log level.
    0: silent
    1: all`);

	process.exit(1);
}

if(argv.length === 0 || argv.length >= 3) {
	console.log("Error: Invalid arguments");
	usage();
} else {
	const package = argv[0];
	if(package.match(/^\-\-?h(elp|lp)?$/) != null) usage();
	else {
		let logLevel = argv[1];
		if(logLevel == null) logLevel = 0;
		else logLevel = Math.min(Math.max(+logLevel, 0), 1)|0;

		run(package, logLevel);
	}
}
