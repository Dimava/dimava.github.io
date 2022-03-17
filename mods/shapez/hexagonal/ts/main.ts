import { Blueprint } from "shapez/game/blueprint";
import { enumColorsToHexCode, enumShortcodeToColor } from "shapez/game/colors";
import { HubGoals } from "shapez/game/hub_goals";
import { Mod } from "shapez/mods/mod";
import { SzLevel } from "./levels/levels";
import { SzDefinition } from "./shapest/definition";
import { SzShapeItem } from "./shapest/item";
import { SzInfo } from "./shapest/layer";
import { SpawnOwerride } from "./SpawnOverride";



class TestMode {
	static install(mod: Mod) {
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


class ModImpl extends Mod {
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

	use(module: { install(mod: Mod): void }) {
		module.install(this);
		return this;
	}
}


