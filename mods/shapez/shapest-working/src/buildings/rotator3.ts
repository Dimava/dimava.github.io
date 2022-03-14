import { SzDefinition } from "../shapest/definition.js";
import { SzShapeItem } from "../shapest/item.js";
import { defaultBuildingVariant, enumItemProcessorTypes, enumRotaterVariants, formatItemsPerSecond, GameRoot, MetaRotaterBuilding, Mod, MOD_ITEM_PROCESSOR_HANDLERS, MOD_ITEM_PROCESSOR_SPEEDS, ProcessorImplementationPayload, ShapeDefinition, ShapeItem, T, Vector } from "../shapez.js";
import { RESOURCES } from "../types/common.js";


const var41 = defaultBuildingVariant;
const var42 = enumRotaterVariants.ccw;
const var180 = enumRotaterVariants.rotate180;

const var31 = 'rotator-three-right';
const var32 = 'rotator-three-left';

export class Rotator3 {


	static process_rotate31_cache = new Map<string, SzDefinition>();
	static process_rotate32_cache = new Map<string, SzDefinition>();
	static processOrCached(cache: Map<string, SzDefinition>, hash: string, process: () => SzDefinition): SzDefinition {
		let v = cache.get(hash);
		if (!v) cache.set(hash, v = process());
		return v;
	}


	static process_31(payload: ProcessorImplementationPayload) {
		const push = (d: ShapeDefinition) => payload.outItems.push({ item: payload.entity.root.shapeDefinitionMgr.getShapeItemFromDefinition(d) });
		let item = payload.items.get(0) as ShapeItem | SzShapeItem;
		let def = () => item.definition instanceof SzDefinition ? item.definition
			: SzDefinition.fromRawShape(item.definition);
		push(
			Rotator3.processOrCached(
				Rotator3.process_rotate31_cache,
				item.definition.getHash(),
				() => def().cloneRotate24(8),
			)
		);
	}

	static process_32(payload: ProcessorImplementationPayload) {
		const push = (d: ShapeDefinition) => payload.outItems.push({ item: payload.entity.root.shapeDefinitionMgr.getShapeItemFromDefinition(d) });
		let item = payload.items.get(0) as ShapeItem | SzShapeItem;
		let def = () => item.definition instanceof SzDefinition ? item.definition
			: SzDefinition.fromRawShape(item.definition);
		push(
			Rotator3.processOrCached(
				Rotator3.process_rotate31_cache,
				item.definition.getHash(),
				() => def().cloneRotate24(24 - 8),
			)
		);
	}



	static install(mod: Mod) {

		Object.assign(enumRotaterVariants, {
			[var31]: var31,
			[var32]: var32,
		});

		mod.modInterface.addVariantToExistingBuilding(
			// @ts-ignore
			MetaRotaterBuilding,
			var31,
			{
				name: "Cutter (Mirrored)",
				description: "A mirrored cutter",

				tutorialImageBase64: RESOURCES.rotate31,
				regularSpriteBase64: RESOURCES.rotate31,
				blueprintSpriteBase64: RESOURCES.rotate31,

				dimensions: new Vector(1, 1),

				additionalStatistics(root) {
					const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.rotater);
					return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed),],
					];
				},
				// isUnlocked(root) {
				// 	return true;
				// },
			}
		);
		mod.modInterface.addVariantToExistingBuilding(
			// @ts-ignore
			MetaRotaterBuilding,
			var32,
			{
				name: "Cutter (Mirrored)",
				description: "A mirrored cutter",

				tutorialImageBase64: RESOURCES.rotate32,
				regularSpriteBase64: RESOURCES.rotate32,
				blueprintSpriteBase64: RESOURCES.rotate32,

				dimensions: new Vector(1, 1),

				additionalStatistics(root) {
					const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.rotater);
					return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed),],
					];
				},
				// isUnlocked(root) {
				// 	return true;
				// },
			}
		);

		// Extend instance methods
		mod.modInterface.extendClass(MetaRotaterBuilding, ({ $old }) => ({
			updateVariants(entity: { components: { ItemProcessor: { type: string; }; }; }, rotationVariant: any, variant: string) {
				if (variant === var31) {
					entity.components.ItemProcessor.type = var31;
				} else if (variant === var32) {
					entity.components.ItemProcessor.type = var32;
				} else {
					$old.updateVariants.call(this, entity, rotationVariant, variant);
				}
			},
			getAvailableVariants(root: GameRoot) {
				let vars = [];
				if (root.hubGoals.isRewardUnlocked('reward_rotater')) {
					vars.push(var41, var42);
				}
				if (root.hubGoals.isRewardUnlocked('reward_rotater_ccw')) {
					vars.push(var31, var32);
				}
				if (root.hubGoals.isRewardUnlocked('reward_rotater_180')) {
					vars.push(var180);
				}
				return vars;
			},
		}));


		function registerProcessor(variant: string, speed: keyof enumItemProcessorTypes, processor: (payload: ProcessorImplementationPayload) => void) {
			Object.assign(enumItemProcessorTypes, {
				[variant]: variant
			});
			Object.assign(MOD_ITEM_PROCESSOR_SPEEDS, {
				[variant]: (root: GameRoot) => root.hubGoals.getProcessorBaseSpeed(speed)
			});
			Object.assign(MOD_ITEM_PROCESSOR_HANDLERS, {
				[variant]: processor
			})
		}

		registerProcessor(var31, 'rotater', Rotator3.process_31);
		registerProcessor(var32, 'rotater', Rotator3.process_32);





	}
}
