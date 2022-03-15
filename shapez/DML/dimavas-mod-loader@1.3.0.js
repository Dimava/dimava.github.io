// @ts-nocheck
const METADATA = {
	website: "",
	author: "Dimava",
	name: "Mod Importer",
	version: "1.3.0",
	id: "-dimavas-mod-loader",
	description: "Import mods directly from shapez.mods.io!",
	minimumGameVersion: ">=1.5.0",

	// You can specify this parameter if savegames will still work
	// after your mod has been uninstalled
	doesNotAffectSavegame: true,

	settings: {
		dml_modListString: 'hexagonal'
	},
};

class Mod extends shapez.Mod {
	init() {
		// Increment the setting every time we launch the mod
		this.settings.dml_modListString = dml.dml_modListString;
		this.saveSettings();

		// Show a dialog in the main menu with the settings
		this.signals.stateEntered.add(state => {
			if (state instanceof shapez.ModsState) {
				this.modsState();
			}
		});
	}

	modsState() {
		String.prototype._replaceAll ??= String.prototype.replaceAll;
		String.prototype.replaceAll = function (v, ...a) {
			if (typeof v == 'string')
				return (this + '')._replaceAll(v, ...a);
			return (this + '').replace(v, ...a);
		}
		if (!globalThis.PoopJs) location.reload();
		qq('.dml').map(e => e.remove());
		q.orElm('head>style#qwe').innerHTML = `
			textarea.dml {
				font-family: monospace;
				font-size: 16px;
				line-height: 1.4;
			}
			#dml-container {
				display: grid;
				grid-template-areas: "a b c" "a b d";
			}
			[area="a"] {grid-area: a;}
			[area="b"] {grid-area: b;}
			[area="c"] {grid-area: c;}
			[area="d"] {grid-area: d;}
		`

		let container = elm('#dml-container');
		let ta = elm('textarea.dml[area="a"]');

		ta.value = this.settings.dml_modListString;
		if (!ta.value.startsWith('// insert'))
			ta.value = '// insert mod ids here, one per line\n// Alt-R to reload game\n' + ta.value;
		ta.rows = ta.value.split('\n').length + 2;
		if (ta.rows < 5) ta.rows = 5;


		let ta2 = elm('textarea.dml[area="b"]');
		ta2.value = '// active mods:\n'
			+ shapez.MODS.mods.map(e => {
				let id = e.metadata.id;
				if (!e.metadata.dmlImported) id = '    ' + id + ' // local file'
				return id;
			}).sort().sort((a, b) => a.startsWith(' ') - b.startsWith(' ')).join('\n')
		ta2.rows = ta2.value.split('\n').length;


		let ta3 = elm('textarea.dml[area="d"]');

		ta.rows = ta2.rows = ta3.rows = Math.max(ta.rows, ta2.rows, 10);
		ta3.rows--;

		let srch = elm('textarea.dml[area="c"][rows="1"]');
		srch.placeholder = "filter (split by spaces, supports \"-\")"
		srch.oninput = () => {
			let vv = srch.value.toLowerCase().match(/\S+/g) || [];
			function filter(s) {
				s = s.toLowerCase();
				return vv.every(v => {
					if (v[0] == '-') return !s.includes(v.slice(1) || '%%%');
					return s.includes(v);
				})
			}
			ta3.value = `// all mods on shapez.mods.io:\n`
				+ dml.api.modList.map(e => `${e.name_id} (by ${e.submitted_by.username})`).sort()
					.filter(filter)
					.join('\n');
		}
		srch.oninput();

		q('.modsList').prepend(container);
		container.append(ta, ta2, ta3, srch);

		ta.oninput = () => {
			console.log(ta.value)
			this.settings.dml_modListString = ta.value;
			this.saveSettings();
		}

	}


}


class ModApi {
	apiKey = `656f778b10cf1651d8f10e221b8c774c`;
	shapezId = '2978';
	modList = JSON.parse(localStorage.api_modList || '[]');

	import = (1, eval)('s => import(s)');// s => import(s);

	get headers() { return { 'Accept': 'application/json' }; }
	get oHeaders() { return { headers: this.headers }; }
	get modsByName() { return Object.fromEntries(this.modList.map(e => [e.name_id, e])) }

	async fetchGameList() {
		let j = await fetch.cached.json(`https://api.mod.io/v1/games/?api_key=${this.apiKey}`, this.oHeaders);
		this.shapez = j.data.find(e => e.name_id == 'shapez');
		return j.data;
	}

	async fetchShapezMods() {
		this.log(`Downloading mod list...`);
		let j = await fetch.json(`https://api.mod.io/v1/games/${this.shapezId}/mods/?api_key=${this.apiKey}`, this.oHeaders);
		this.modList = j.data;
		localStorage.api_modList = JSON.stringify(j.data);
		return j.data;
	}

	async fetchModZip(modName) {
		this.log(`Downloading mod ${modName}...`);
		let mod = this.modsByName[modName];
		if (!mod) {
			dml.dml_modListString = dml.dml_modListString
				.split('\n')
				.map(e => {
					if ((e.match(/^[\w-_]+/gm) || [])[0] != modName) return e;
					return e.replace(modName, '// ' + modName + ' // does not exist ');
				})
				.join('\n');
			throw new Error(`\nMod with id "${modName}" does not exist!\nPlease remove it from the imported mod pane`);
		}
		let url = mod.modfile.download.binary_url;
		let f = await fetch.cached(url)
		let z = await JSZip.loadAsync(f.blob());
		return z;
	}

	async importMod(modName) {
		let z = await this.fetchModZip(modName);
		let jsList = Object.values(z.files).filter(e => e.name.endsWith('.js'));
		this.modsByName[modName].jsList = jsList;
		if (jsList.length > 1) throw new Error('Multiple JS files in mod!');

		// import(...)
		let import_blob = await jsList[0].async('blob');
		let import_jsBlob = new Blob([import_blob], { type: 'text/javascript' });
		let import_blobUrl = URL.createObjectURL(import_jsBlob);

		// eval(...)
		let eval_raw = await jsList[0].async('string');
		let eval_escaped = eval_raw.replace(/[^\x00-\xff]/g, '');
		let eval_js = eval_escaped + `
			if (typeof Mod !== 'undefined') {
				if (typeof METADATA !== 'object') {
					throw new Error("No METADATA variable found");
				}
				window.$shapez_registerMod(Mod, METADATA);
			}
			return {Mod, METADATA};
		`;

		let hasExport = eval_raw.includes('export');
		let hasRegister = eval_raw.includes('$shapez_registerMod');

		return async () => {
			this.log(`Importing mod ${modName}...`);
			try {
				if (!hasExport) {
					return new Function(eval_js)();
				} else if (!hasRegister) {
					let mod = await this.import(import_blobUrl);
					if (!(mod.default || mod.Mod) || !mod.METADATA) {
						console.error(mod);
						throw new Error('mod with export has bad exports!')
					}
					window.$shapez_registerMod(mod.default || mod.Mod, mod.METADATA);
					return mod;
				} else {
					return await this.import(import_blobUrl);
				}
			} catch (err) {
				console.error({ err });
				return new Function(eval_js)();
			}
		};
	}

	log(s) {
		console.log(s);
		let el = document.querySelector('.prefab_GameHint');
		if (!el) el = document.querySelector('#ll_p div');
		if (el) el.innerText = s;
	}
}


let dml = new class DimavasModLoader {
	$shapez_registerMod = window.$shapez_registerMod;
	initialized = false;
	import = s => import(s);

	dml_modListString = '';

	async init(v) {
		try {
			v = JSON.parse(v);
		} catch (e) {
			return;
		}
		console.log(this, 'initializing DML...', this.dml_modListString, { v })
		if (v.dml_modListString == null) return;
		this.dml_modListString = v.dml_modListString;

		if (this.initialized) return;
		this.initialized = true;

		this.api = new ModApi();

		this.api.log(`Loading libraries... (poopjs)`);
		await this.import('https://unpkg.com/@dimava/poopjs@1.4.1/dist/poop.js');
		console.log({ PoopJs });
		__init__;
		PoopJs.FetchExtension.defaults = {};
		PoopJs.kds['>R'] = () => location.reload();
		this.api.log(`Loading libraries... (jszip)`);
		await this.import('https://unpkg.com/jszip@3.1.5/dist/jszip.min.js');

		this.api.import = this.import;

		await this.api.fetchShapezMods();

		await this.importRequestedMods();

	}

	get modIdList() {
		return this.dml_modListString.match(/^http\S+|^[\w-_]+/gm) || [];
	}

	async importRequestedMods() {
		let mods = this.modIdList;
		// debugger;
		for (let m of mods) {
			try {
				await this.importMod(m);
			} catch (err) {
				console.error(err);
				alert(`failed to load mod ${m}: ${err}`);
			}
		}
	}

	async importMod(modName = "wires-plus") {
		let z = modName.startsWith('http') ? () => this.importHttpMod(modName)
			: await this.api.importMod(modName);
		window.$shapez_registerMod = (modClass, meta) => {
			modClass.dmlImported = true;
			meta.dmlImported = true;
			this.$shapez_registerMod(modClass, meta);
		};
		let modInstance = await z();
		console.log({ modName, modInstance });
		delete window.$shapez_registerMod;
	}

	async importHttpMod(url) {
		let mod = await this.import(url);
		if (mod.default && mod.METADATA) {
			$shapez_registerMod(mod.default, mod.METADATA);
		}
	}
}

Object.assign(globalThis, { dml });


for (let proto of [
	shapez.StorageImplBrowserIndexedDB.prototype,
	shapez.StorageImplElectron.prototype,
]) {
	proto._readFileAsync = proto.readFileAsync;
	proto.readFileAsync = async function (...a) {
		let v = await this._readFileAsync(...a);
		await dml.init(v);
		return v;
	}
}

// this does not work dunno why
for (let proto of [
	shapez.MainMenuState.prototype
]) {
	proto._checkForModDifferences = proto.checkForModDifferences;
	proto.checkForModDifferences = function (save) {
		requestAnimationFrame(() => {
			let ta = document.createElement('textarea');
			q('.dialogModsMod')?.before(ta);
			ta.value = `// missing mods:\n`
				+ save.currentData.mods.map(e => e.id)
					.filter(e => !dml.modIdList.includes(e))
					.join('\n');
			ta.style = 'width: 100%; height: 10em;'
		});
		console.log({ save });
		return this._checkForModDifferences(save);
	}
	console.log(proto, proto.checkForModDifferences)
	setTimeout(() => console.log(proto.checkForModDifferences), 10000)
}
