import { formatItemsPerSecond } from "shapez/core/utils";
import { enumDirection, Vector } from "shapez/core/vector";
import { ItemAcceptorComponent } from "shapez/game/components/item_acceptor";
import { ItemEjectorComponent } from "shapez/game/components/item_ejector";
import { enumItemProcessorTypes, ItemProcessorComponent } from "shapez/game/components/item_processor";
import { Entity } from "shapez/game/entity";
import { MOD_ITEM_PROCESSOR_SPEEDS } from "shapez/game/hub_goals";
import { ColorItem } from "shapez/game/items/color_item";
import { ShapeItem } from "shapez/game/items/shape_item";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { GameRoot } from "shapez/game/root";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { MOD_ITEM_PROCESSOR_HANDLERS, ProcessorImplementationPayload } from "shapez/game/systems/item_processor";
import { Mod } from "shapez/mods/mod";
import { ModInterface } from "shapez/mods/mod_interface";
import { ModMetaBuilding } from "shapez/mods/mod_meta_building";
import { T } from "shapez/translations";

import flipper_png from '../../res/sprites/flip.png';
import flipper_cover_png from '../../res/sprites/flip_white.png';
import { SzColorItem } from "../shapest/color";
import { SzDefinition } from "../shapest/definition";
import { SzShapeItem } from "../shapest/item";
import { SzLayer } from "../shapest/layer";

const coverVariant = 'sz-flipper-cover';

// Create the building
export default class MetaModFlipperBuilding extends ModMetaBuilding {
	constructor() {
		super("modFlipperBuilding");
	}

	static getAllVariantCombinations() {
		return [
			{
				name: "Flipper",
				description: "Converts raw shapes/colors into Sz shapes/colors",
				variant: defaultBuildingVariant,

				regularImageBase64: flipper_png,
				blueprintImageBase64: flipper_png,
				tutorialImageBase64: flipper_png,
			},
			{
				name: "Cover Cutter",
				description: "Makes Cover shapes out of raw/Sz shapes",
				variant: coverVariant,

				regularImageBase64: flipper_cover_png,
				blueprintImageBase64: flipper_cover_png,
				tutorialImageBase64: flipper_cover_png,
			},
		];
	}

	getAvailableVariants() {
		return [defaultBuildingVariant, coverVariant];
	}

	getSilhouetteColor() {
		return "red";
	}

	getAdditionalStatistics(root: GameRoot): [string, string][] {
		const speed = root.hubGoals.getProcessorBaseSpeed(shapez.enumItemProcessorTypes.flipper);
		return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
	}

	getIsUnlocked(root: GameRoot) {
		return true;
	}

	setupEntityComponents(entity: Entity) {
		// Accept shapes from the bottom
		entity.addComponent(
			new ItemAcceptorComponent({
				slots: [{ pos: new Vector(0, 0), direction: enumDirection.bottom }],
			})
		);
		// Process those shapes with type processor type "flipper" (which we added above)
		entity.addComponent(
			new ItemProcessorComponent({ inputsPerCharge: 1, processorType: 'flipper' })
		);
		// Eject the result to the top
		entity.addComponent(
			new ItemEjectorComponent({
				slots: [{ pos: new Vector(0, 0), direction: enumDirection.top }],
			})
		);
	}

	updateVariants(entity: Entity, rotationVariant: number, variant: string): void {
		if (variant == defaultBuildingVariant) {
			entity.components.ItemProcessor.type = MetaModFlipperBuilding.processorType;
			entity.components.ItemAcceptor.slots[0].filter = undefined;
		} else if (variant == coverVariant) {
			entity.components.ItemProcessor.type = coverVariant;
			entity.components.ItemAcceptor.slots[0].filter = 'shape';
		}
	}



	static install(mod: Mod) {

		// Declare a new type of item processor
		Object.assign(enumItemProcessorTypes, { [this.processorType]: this.processorType });

		// For now, flipper always has the same speed
		Object.assign(MOD_ITEM_PROCESSOR_SPEEDS, { [this.processorType]: () => this.processingSpeed });

		// Declare a handler for the processor so we define the "flip" operation
		Object.assign(MOD_ITEM_PROCESSOR_HANDLERS, {
			[this.processorType]: (payload: ProcessorImplementationPayload) => this.process(payload),
		});

		Object.assign(enumItemProcessorTypes, { [this.processorType2]: this.processorType2 });
		Object.assign(MOD_ITEM_PROCESSOR_SPEEDS, { [this.processorType2]: () => this.processingSpeed });
		Object.assign(MOD_ITEM_PROCESSOR_HANDLERS, {
			[this.processorType2]: (payload: ProcessorImplementationPayload) => this.process_cover(payload),
		});




		// Register the new building
		mod.modInterface.registerNewBuilding({
			metaClass: MetaModFlipperBuilding,
			buildingIconBase64: flipper_png,
		});

		// Add it to the regular toolbar
		mod.modInterface.addNewBuildingToToolbar({
			toolbar: "regular",
			location: "primary",
			metaClass: MetaModFlipperBuilding,
		});
	}


	static get processorType() { return 'flipper'; }
	static get processorType2() { return coverVariant; }
	static get processingSpeed() { return 10; }

	static processCache = new Map<string, ShapeDefinition>();
	static getCachedProcessedOr(hash: string, mapper: () => ShapeDefinition) {
		let value = this.processCache.get(hash);
		if (!value) {
			value = mapper();
			this.processCache.set(hash, value);
		}
		return value;
	}


	static process(payload: ProcessorImplementationPayload) {
		let item = payload.items.get(0);

		if (item instanceof ShapeItem || item instanceof SzShapeItem) {
			const shapeDefinition = item.definition;
			let newDefinition = this.getCachedProcessedOr(
				shapeDefinition.getHash(),
				() => {
					if (shapeDefinition.getHash().startsWith('sz!')) {
						return SzDefinition.createTest()
					} else {
						return new SzDefinition({
							layers: shapeDefinition.getHash().split(':').map(e => SzLayer.fromShortKey(e))
						});
					}
				}
			);

			payload.outItems.push({
				item: payload.entity.root.shapeDefinitionMgr.getShapeItemFromDefinition(newDefinition),
			});
		}
		if (item instanceof ColorItem) {
			payload.outItems.push({
				item: SzColorItem.fromColor(item.color),
			});
		}
		if (item instanceof SzColorItem) {
			payload.outItems.push({
				item,
			});
		}
	}
	static process_cover_cache = new Map<string, SzDefinition>();
	static processOrCached(cache: Map<string, SzDefinition>, hash: string, process: () => SzDefinition): SzDefinition {
		let v = cache.get(hash);
		if (!v) cache.set(hash, v = process());
		return v;
	}
	static process_cover(payload: ProcessorImplementationPayload) {
		const push = (d: ShapeDefinition) => payload.outItems.push({ item: payload.entity.root.shapeDefinitionMgr.getShapeItemFromDefinition(d) });
		let item = payload.items.get(0) as ShapeItem | SzShapeItem;
		let def = () => item.definition instanceof SzDefinition ? item.definition
			: SzDefinition.fromRawShape(item.definition);
		push(
			MetaModFlipperBuilding.processOrCached(
				MetaModFlipperBuilding.process_cover_cache,
				item.definition.getHash(),
				() => def().cloneAndMakeCover(),
			)
		);
	}

}

