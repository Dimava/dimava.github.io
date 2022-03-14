import { Balancer22 } from "./buildings/balancer22.js";
import { PainterOverride } from "./buildings/painterOverride.js";
import { Rotator3 } from "./buildings/rotator3.js";
import { SzLevel } from "./levels/levels.js";
import { SandboxMode } from "./sandbox.js";
import { SzColorItem } from "./shapest/color.js";
import { SzDefinition } from "./shapest/definition.js";
import { SzShapeItem } from "./shapest/item.js";
import { SzInfo } from "./shapest/layer.js";
import { Mod, ModMetadata } from "./shapez.js";
import { SpawnOwerride } from "./SpawnOverride.js";


export const METADATA: ModMetadata = {
	website: "",
	author: "Dimava",
	name: "TS test +1",
	version: "1.0.0",
	id: "dimavas-ts-test",
	description: "test!",
	minimumGameVersion: ">=1.5.0",

	doesNotAffectSavegame: false,

	settings: {},
};

export default class ModImpl extends Mod {
	init() {
		this.use(SandboxMode);

		this.use(SzDefinition);
		this.use(SzShapeItem);
		this.use(SzColorItem);

		this.use(PainterOverride);
		this.use(Balancer22);

		this.use(Rotator3);

		this.use(SpawnOwerride);

		this.use(SzLevel);


	}


	use(module: { install(mod: Mod): void }) {
		module.install(this);
		return this;
	}
}
