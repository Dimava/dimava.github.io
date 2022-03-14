

import { Entity, enumBalancerVariants, enumDirection, enumItemProcessorTypes, formatItemsPerSecond, GameRoot, MetaBalancerBuilding, Mod, T, Vector } from '../shapez.js';
import { RESOURCES } from '../types/common.js';

const var22 = 'two-two-balancer';

export class Balancer22 {
	static install(mod: Mod) {
		// @ts-ignore
		enumBalancerVariants[var22] = var22;

		mod.modInterface.addVariantToExistingBuilding(
			// @ts-ignore
			MetaBalancerBuilding,
			var22,
			{
				name: "2-2 balancer",
				description: "...The only balancer you ever need",

				tutorialImageBase64: RESOURCES.splitter1,
				regularSpriteBase64: RESOURCES.splitter1,
				blueprintSpriteBase64: RESOURCES.splitter1,

				dimensions: new Vector(1, 1),

				additionalStatistics(root) {
					const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.balancer);
					return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
				},

				isUnlocked(root) {
					return true;
				},
			}
		);

		// Extend instance methods
		mod.modInterface.extendClass(MetaBalancerBuilding, ({ $old }) => ({
			updateVariants(entity: Entity, rotationVariant: any, variant: string) {
				if (variant === var22) {
					entity.components.ItemEjector.setSlots([
						{ pos: new Vector(0, 0), direction: enumDirection.top },
						{ pos: new Vector(0, 0), direction: enumDirection.right },
					]);
					entity.components.ItemAcceptor.setSlots([
						{ pos: new Vector(0, 0), direction: enumDirection.bottom },
						{ pos: new Vector(0, 0), direction: enumDirection.left },
					]);
				} else {
					$old.updateVariants.call(this, entity, rotationVariant, variant);
				}
			},
			getAvailableVariants(root: GameRoot) {
				return [var22];
			},
		}));
	}
}
