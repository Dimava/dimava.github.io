import { RESOURCES } from "./common.js";
import { BaseItem, BOOL_FALSE_SINGLETON, BOOL_TRUE_SINGLETON, defaultBuildingVariant, Entity, enumDirection, enumHubGoalRewards, enumLogicGateType, enumPinSlotType, GameRoot, LogicGateComponent, LogicGateSystem, MetaBuilding, MetaCutterBuilding, MetaPainterBuilding, MetaRotaterBuilding, MetaStackerBuilding, MetaVirtualProcessorBuilding, Mod, MOD_ITEM_PROCESSOR_HANDLERS, ProcessorImplementationPayload, Vector, WiredPinsComponent } from "./types/shapez.js";


const var_call = 'virtual-function-call';
const var_process = 'virtual-function-process';
const STABLE_LIMIT = 20;

type hashFname = string;
type hashArgs = string;

export class FnBuilding extends MetaVirtualProcessorBuilding {

	updateVariants(entity: Entity, rotationVariant: number, variant: string) {
		const gateType = variant;
		entity.components.LogicGate.type = gateType;
		const pinComp = entity.components.WiredPins;
		pinComp.setSlots([
			// name
			{ pos: new Vector(0, 0), direction: enumDirection.left, type: enumPinSlotType.logicalAcceptor },
			// arguments
			{ pos: new Vector(0, 0), direction: enumDirection.bottom, type: enumPinSlotType.logicalAcceptor },
			{ pos: new Vector(1, 0), direction: enumDirection.bottom, type: enumPinSlotType.logicalAcceptor },
			{ pos: new Vector(2, 0), direction: enumDirection.bottom, type: enumPinSlotType.logicalAcceptor },
			{ pos: new Vector(3, 0), direction: enumDirection.bottom, type: enumPinSlotType.logicalAcceptor },
			// return
			{ pos: new Vector(0, 0), direction: enumDirection.top, type: enumPinSlotType.logicalEjector },
			{ pos: new Vector(1, 0), direction: enumDirection.top, type: enumPinSlotType.logicalEjector },
			{ pos: new Vector(2, 0), direction: enumDirection.top, type: enumPinSlotType.logicalEjector },
			{ pos: new Vector(3, 0), direction: enumDirection.top, type: enumPinSlotType.logicalEjector },
		]);
	}

	static requests: Record<
		hashFname,
		{ hashArgs: hashArgs, args: (BaseItem | null)[] }
	> = {};
	static results: Record<
		hashFname,
		Record<hashArgs,
			{ hashResult: hashArgs, result: (BaseItem | null)[], stability: number }
		>> = {};
	// static results : Map<string, >
	// static cache = new Map<string, (BaseItem | null)[]>();

	static compute_FN_CALL(parameters: Array<BaseItem | null>) {
		let [oName, ...oArgs] = parameters;
		let name = oName?.getAsCopyableKey() ?? 'null';
		let fnResults = FnBuilding.results[name] ??= {};
		let argsStr = oArgs.map(e => e?.getAsCopyableKey() ?? 'null').join(';');

		let result = fnResults[argsStr];
		if (result && result.stability >= STABLE_LIMIT) return result.result.concat([BOOL_TRUE_SINGLETON]);

		FnBuilding.requests[name] = {
			hashArgs: argsStr,
			args: oArgs,
		};
		if (result) return result.result.concat([BOOL_FALSE_SINGLETON]);

		// console.log('call:', parameters);
		return parameters.slice(1).concat([BOOL_FALSE_SINGLETON]);
	}

	static compute_FN_PROCESS(parameters: Array<BaseItem | null>) {
		let [oName, ...oArgs] = parameters;
		let name = oName?.getAsCopyableKey() ?? 'null';
		let resultStr = oArgs.map(e => e?.getAsCopyableKey() ?? 'null').join(';');

		let fnRequest = FnBuilding.requests[name];
		let fnResults = FnBuilding.results[name] ??= {};

		if (!fnRequest) return [null, null, null, null, BOOL_FALSE_SINGLETON];

		let result = fnResults[fnRequest.hashArgs] ??= { hashResult: '', result: [], stability: 0 };
		console.log(result);
		if (result.hashResult == resultStr) {
			result.stability++;
			if (result.stability > STABLE_LIMIT) delete FnBuilding.requests[name];
		} else {
			result.stability = 0;
			result.hashResult = resultStr;
			result.result = oArgs;
		}
		return fnRequest.args;
	}


	static install(mod: Mod) {
		// MOD_ITEM_PROCESSOR_HANDLERS[FnBuilding.variant as any] = FnBuilding.process;
		mod.modInterface.addVariantToExistingBuilding(
			MetaVirtualProcessorBuilding as any,
			var_call,
			{
				name: 'Function',
				description: 'test_desc',

				tutorialImageBase64: RESOURCES.fn_call,
				regularSpriteBase64: RESOURCES.fn_call,
				blueprintSpriteBase64: RESOURCES.fn_call,

				dimensions: new Vector(4, 1),
				isUnlocked(root) {
					return true as any;
				},
			}
		);
		mod.modInterface.addVariantToExistingBuilding(
			MetaVirtualProcessorBuilding as any,
			var_process,
			{
				name: 'Function',
				description: 'test_desc',

				tutorialImageBase64: RESOURCES.fn_process,
				regularSpriteBase64: RESOURCES.fn_process,
				blueprintSpriteBase64: RESOURCES.fn_process,

				dimensions: new Vector(4, 1),
				isUnlocked(root) {
					return true as any;
				},
			}
		);
		mod.modInterface.extendClass(
			MetaVirtualProcessorBuilding,
			({ $old }) => ({
				updateVariants(entity: Entity, rotationVariant: number, variant: string) {
					if (variant == var_call || variant == var_process) {
						return FnBuilding.prototype.updateVariants.call(this, entity, rotationVariant, variant);
					}
					return $old.updateVariants.call(this, entity, rotationVariant, variant);
				}
			})
		);
		mod.modInterface.extendClass(
			LogicGateSystem,
			({ $old }) => ({
				update(this: LogicGateSystem) {
					this.boundOperations[var_call] ??= FnBuilding.compute_FN_CALL.bind(this);
					this.boundOperations[var_process] ??= FnBuilding.compute_FN_PROCESS.bind(this);
					return $old.update.call(this);
				}
			})
		);
	}
}

// virtual-function


// class Modasd extends shapez.Mod {
// 	init() {
// 		shapez.enumCutterVariants.mirrored = "mirrored";

// 		this.modInterface.addVariantToExistingBuilding(
// 			shapez.MetaCutterBuilding,
// 			shapez.enumCutterVariants.mirrored,
// 			{
// 				name: "Cutter (Mirrored)",
// 				description: "A mirrored cutter",

// 				tutorialImageBase64: RESOURCES["cutter-mirrored.png"],
// 				regularSpriteBase64: RESOURCES["cutter-mirrored.png"],
// 				blueprintSpriteBase64: RESOURCES["cutter-mirrored.png"],

// 				dimensions: new shapez.Vector(2, 1),

// 				additionalStatistics(root) {
// 					const speed = root.hubGoals.getProcessorBaseSpeed(shapez.enumItemProcessorTypes.cutter);
// 					return [
// 						[
// 							shapez.T.ingame.buildingPlacement.infoTexts.speed,
// 							shapez.formatItemsPerSecond(speed),
// 						],
// 					];
// 				},

// 				isUnlocked(root) {
// 					return true;
// 				},
// 			}
// 		);

// 		// Extend instance methods
// 		this.modInterface.extendClass(shapez.MetaCutterBuilding, ({ $old }) => ({
// 			updateVariants(entity, rotationVariant, variant) {
// 				if (variant === shapez.enumCutterVariants.mirrored) {
// 					entity.components.ItemEjector.setSlots([
// 						{ pos: new shapez.Vector(0, 0), direction: shapez.enumDirection.top },
// 						{ pos: new shapez.Vector(1, 0), direction: shapez.enumDirection.top },
// 					]);
// 					entity.components.ItemProcessor.type = shapez.enumItemProcessorTypes.cutter;
// 					entity.components.ItemAcceptor.setSlots([
// 						{
// 							pos: new shapez.Vector(1, 0),
// 							direction: shapez.enumDirection.bottom,
// 							filter: "shape",
// 						},
// 					]);
// 				} else {
// 					// Since we are changing the ItemAcceptor slots, we should reset
// 					// it to the regular slots when we are not using our mirrored variant
// 					entity.components.ItemAcceptor.setSlots([
// 						{
// 							pos: new shapez.Vector(0, 0),
// 							direction: shapez.enumDirection.bottom,
// 							filter: "shape",
// 						},
// 					]);
// 					$old.updateVariants.bind(this)(entity, rotationVariant, variant);
// 				}
// 			},
// 		}));
// 	}
// }








// /** @enum {string} */
// export const enumVirtualProcessorVariants = {
// 	rotater: "rotater",
// 	unstacker: "unstacker",
// 	stacker: "stacker",
// 	painter: "painter",
// };

// // /** @enum {string} */
// // const enumVariantToGate = {
// // 	[defaultBuildingVariant]: enumLogicGateType.cutter,
// // 	[enumVirtualProcessorVariants.rotater]: enumLogicGateType.rotater,
// // 	[enumVirtualProcessorVariants.unstacker]: enumLogicGateType.unstacker,
// // 	[enumVirtualProcessorVariants.stacker]: enumLogicGateType.stacker,
// // 	[enumVirtualProcessorVariants.painter]: enumLogicGateType.painter,
// // };

// // const colors = {
// // 	[defaultBuildingVariant]: new MetaCutterBuilding().getSilhouetteColor(),
// // 	[enumVirtualProcessorVariants.rotater]: new MetaRotaterBuilding().getSilhouetteColor(),
// // 	[enumVirtualProcessorVariants.unstacker]: new MetaStackerBuilding().getSilhouetteColor(),
// // 	[enumVirtualProcessorVariants.stacker]: new MetaStackerBuilding().getSilhouetteColor(),
// // 	[enumVirtualProcessorVariants.painter]: new MetaPainterBuilding().getSilhouetteColor(),
// // };

// export class MetaVirtualProcessorBuilding_Fn extends MetaVirtualProcessorBuilding {
// 	constructor() {
// 		super("virtual_processor");
// 	}

// 	static getAllVariantCombinations() {
// 		return [
// 			{
// 				internalId: 42,
// 				variant: defaultBuildingVariant,
// 			},
// 			{
// 				internalId: 44,
// 				variant: enumVirtualProcessorVariants.rotater,
// 			},
// 			{
// 				internalId: 45,
// 				variant: enumVirtualProcessorVariants.unstacker,
// 			},
// 			{
// 				internalId: 50,
// 				variant: enumVirtualProcessorVariants.stacker,
// 			},
// 			{
// 				internalId: 51,
// 				variant: enumVirtualProcessorVariants.painter,
// 			},
// 		];
// 	}

// 	getSilhouetteColor(variant: string) {
// 		return colors[variant];
// 	}

// 	/**
// 	 * @param {GameRoot} root
// 	 */
// 	getIsUnlocked(root: GameRoot) {
// 		return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_virtual_processing);
// 	}

// 	/** @returns {"wires"} **/
// 	getLayer() {
// 		return "wires";
// 	}

// 	getDimensions() {
// 		return new Vector(1, 1);
// 	}

// 	getAvailableVariants() {
// 		return [
// 			defaultBuildingVariant,
// 			enumVirtualProcessorVariants.rotater,
// 			enumVirtualProcessorVariants.stacker,
// 			enumVirtualProcessorVariants.painter,
// 			enumVirtualProcessorVariants.unstacker,
// 		];
// 	}

// 	getRenderPins() {
// 		// We already have it included
// 		return false;
// 	}

// 	/**
// 	 *
// 	 * @param {Entity} entity
// 	 * @param {number} rotationVariant
// 	 */
// 	updateVariants(entity: Entity, rotationVariant: number, variant: string) {
// 		const gateType = enumVariantToGate[variant];
// 		entity.components.LogicGate.type = gateType;
// 		const pinComp = entity.components.WiredPins;
// 		switch (gateType) {
// 			case enumLogicGateType.cutter:
// 			case enumLogicGateType.unstacker: {
// 				pinComp.setSlots([
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.left,
// 						type: enumPinSlotType.logicalEjector,
// 					},
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.right,
// 						type: enumPinSlotType.logicalEjector,
// 					},
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.bottom,
// 						type: enumPinSlotType.logicalAcceptor,
// 					},
// 				]);
// 				break;
// 			}
// 			case enumLogicGateType.rotater: {
// 				pinComp.setSlots([
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.top,
// 						type: enumPinSlotType.logicalEjector,
// 					},
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.bottom,
// 						type: enumPinSlotType.logicalAcceptor,
// 					},
// 				]);
// 				break;
// 			}
// 			case enumLogicGateType.stacker:
// 			case enumLogicGateType.painter: {
// 				pinComp.setSlots([
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.top,
// 						type: enumPinSlotType.logicalEjector,
// 					},
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.bottom,
// 						type: enumPinSlotType.logicalAcceptor,
// 					},
// 					{
// 						pos: new Vector(0, 0),
// 						direction: enumDirection.right,
// 						type: enumPinSlotType.logicalAcceptor,
// 					},
// 				]);
// 				break;
// 			}
// 			default:
// 				assertAlways("unknown logic gate type: " + gateType);
// 		}
// 	}

// 	/**
// 	 * Creates the entity at the given location
// 	 * @param {Entity} entity
// 	 */
// 	setupEntityComponents(entity: Entity) {
// 		entity.addComponent(
// 			new WiredPinsComponent({
// 				slots: [],
// 			})
// 		);

// 		entity.addComponent(new LogicGateComponent({}));
// 	}
// }
