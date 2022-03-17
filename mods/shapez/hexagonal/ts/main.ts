import { SzLevel } from "./levels/levels.js";
import { SzDefinition } from "./shapest/definition.js";
import { SzShapeItem } from "./shapest/item.js";
import { SzInfo } from "./shapest/layer.js";
import { SpawnOwerride } from "./SpawnOverride.js";
import { Blueprint, enumColorsToHexCode, enumShortcodeToColor, HubGoals, Mod as ModBase, ModMetadata } from "./types/shapez.js";

export const METADATA: ModMetadata = {
    "id": "hexagonal",
    "version": "1.3.0",
    "name": "hexagonal",
    "author": "Dimava",
    "description": "Hexagonal shapes",
    "website": "",
    "settings": {} as any,
}

class TestMode {
	static install(mod: ModBase) {
		mod.modInterface.replaceMethod(Blueprint, "getCost", function () {
			return 0;
		});
		mod.modInterface.replaceMethod(HubGoals, "isRewardUnlocked", function () {
			return true;
		});

		mod.signals.modifyLevelDefinitions.add((
			levels: {
				shape: string;
				required: number;
				reward: string;
				throughputOnly: boolean;
			}[]
		) => {
			levels.map(e => e.required = 1);
		});


		mod.signals.modifyUpgrades.add((
			upgrades: Record<string, {
				required: {
					shape: string;
					amount: number;
				}[];
				excludePrevious?: boolean;
			}[]>
		) => {
			Object.values(upgrades).flat().flatMap(e => e.required).map(e => e.amount = 0);
		});


	}
}


export default class Mod extends ModBase {
	init() {

		// return;

		this.use(SzDefinition);
		this.use(SzShapeItem);
		// this.use(SzColorItem);

		// this.use(PainterOverride);
		// this.use(Balancer22);

		// this.use(Rotator3);

		this.use(SpawnOwerride);

		this.use(SzLevel);


		// this.use(TestMode);


		for (let c in enumShortcodeToColor) {
			// @ts-ignore
			SzInfo.color.byChar[c].style = enumColorsToHexCode[enumShortcodeToColor[c]];
		}
		


	}

	use(module: { install(mod: ModBase): void }) {
		module.install(this);
		return this;
	}
}


