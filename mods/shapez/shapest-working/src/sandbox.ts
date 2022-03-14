import { Blueprint, HubGoals, Mod } from "./shapez.js";


export class SandboxMode {
	static install(mod: Mod) {
		mod.modInterface.replaceMethod(Blueprint, "getCost", function () {
			return 0;
		});
		mod.modInterface.replaceMethod(HubGoals, "isRewardUnlocked", function () {
			return true;
		});

		// mod.signals.modifyLevelDefinitions.add((
		// 	levels: {
		// 		shape: string;
		// 		required: number;
		// 		reward: string;
		// 		throughputOnly: boolean;
		// 	}[]
		// ) => {
		// 	levels.map(e => e.required = 1);
		// });


		// mod.signals.modifyUpgrades.add((
		// 	upgrades: Record<string, {
		// 		required: {
		// 			shape: string;
		// 			amount: number;
		// 		}[];
		// 		excludePrevious?: boolean;
		// 	}[]>
		// ) => {
		// 	Object.values(upgrades).flat().flatMap(e => e.required).map(e => e.amount = 1);
		// });
	}
}