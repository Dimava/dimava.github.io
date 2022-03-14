import { RestrictionManager } from "shapez/core/restriction_manager";
import { Blueprint } from "shapez/game/blueprint";
import { MetaItemProducerBuilding } from "shapez/game/buildings/item_producer";
import { HubGoals } from "shapez/game/hub_goals";
import { HUDSandboxController } from "shapez/game/hud/parts/sandbox_controller";
import { RegularGameMode } from "shapez/game/modes/regular";
import { Mod } from "shapez/mods/mod";
import { Balancer22 } from "./buildings/balancer22";
import { PainterOverride } from "./buildings/painterOverride";
import { Rotator3 } from "./buildings/rotator3";
import { ExtendSuperclass, ExtendSuperclass2 } from "./common";
import { SzLevel } from "./levels/levels";
import { SzColorItem } from "./shapest/color";
import { SzDefinition } from "./shapest/definition";
import { SzShapeItem } from "./shapest/item";
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

shapez.RestrictionManager.prototype.isLimitedVersion = () => false


class ModImpl extends Mod {
	init() {
		return;

		// this.use(SzDefinition);
		// this.use(SzShapeItem);
		// this.use(SzColorItem);

		// this.use(PainterOverride);
		// this.use(Balancer22);

		// this.use(Rotator3);

		// this.use(SpawnOwerride);

		// this.use(SzLevel);


		// this.use(TestMode);

		ExtendSuperclass2(class X extends RestrictionManager {
			isLimitedVersion(): boolean {
				return false;
			}
		})

		ExtendSuperclass(this, RegularGameMode, ({ $old }) => class X extends RegularGameMode {
			// @ts-ignore
			getUpgrades(): any {
				this.additionalHudParts.sandboxController ??= HUDSandboxController;
				if (!this.hiddenBuildings.includes(MetaItemProducerBuilding)) {
					this.hiddenBuildings.push(MetaItemProducerBuilding);
				}
				return $old.getUpgrades.call(this);
			}
		})


		//     // @ts-ignore
		//     if (queryParamOptions.sandboxMode || window.sandboxMode || G_IS_DEV) {
		//         this.additionalHudParts.sandboxController = HUDSandboxController;
		//     }

		//     /** @type {(typeof MetaBuilding)[]} */
		//     this.hiddenBuildings = [MetaConstantProducerBuilding, MetaGoalAcceptorBuilding, MetaBlockBuilding];

		//     // @ts-ignore
		//     if (!(G_IS_DEV || window.sandboxMode || queryParamOptions.sandboxMode)) {
		//         this.hiddenBuildings.push(MetaItemProducerBuilding);
		//     }
		// }

		this.modInterface.registerSubShapeType({
			id: "line",
			shortCode: "L",

			// Make it spawn on the map
			weightComputation: distanceToOriginInChunks =>
				Math.round(20 + Math.max(Math.min(distanceToOriginInChunks, 30), 0)),

			// This defines how to draw it
			draw: ({ context, quadrantSize, layerScale }) => {
				let quadrantHalfSize = quadrantSize / 2;
				context.beginPath();
				context.save();

				context.translate(-quadrantHalfSize, quadrantHalfSize);
				context.scale(quadrantHalfSize * 2, quadrantHalfSize * 2);
				context.scale(layerScale, layerScale);

				const pi12 = Math.PI / 12;
				context.rotate(-6 * pi12);

				context.lineWidth = 0.05;
				// ^^^ MAGIC ^^^

				// actual drawing
				let path = new Path2D('M 0.2 0.2 L 0.5 0.2 L 0.2 0.7 Z');

				// vvv MAGIC vvv
				context.fill(path);
				context.stroke(path);

				context.restore();
				// context.closePath();
				// context.fill();
				// context.stroke();
			},
		});

		// Modify the goal of the first level to add our goal
		this.signals.modifyLevelDefinitions.add((definitions: any) => {
			definitions[0].shape = "LuLuLuLu";
		});



	}

	use(module: { install(mod: Mod): void }) {
		module.install(this);
		return this;
	}
}


