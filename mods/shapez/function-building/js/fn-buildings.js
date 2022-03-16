import { RESOURCES } from "./common.js";
import { BOOL_FALSE_SINGLETON, BOOL_TRUE_SINGLETON, enumDirection, enumPinSlotType, LogicGateSystem, MetaVirtualProcessorBuilding, Vector } from "./types/shapez.js";
const var_call = 'virtual-function-call';
const var_process = 'virtual-function-process';
const STABLE_LIMIT = 20;
export class FnBuilding extends MetaVirtualProcessorBuilding {
    updateVariants(entity, rotationVariant, variant) {
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
    static requests = {};
    static results = {};
    // static results : Map<string, >
    // static cache = new Map<string, (BaseItem | null)[]>();
    static compute_FN_CALL(parameters) {
        let [oName, ...oArgs] = parameters;
        let name = oName?.getAsCopyableKey() ?? 'null';
        let fnResults = FnBuilding.results[name] ??= {};
        let argsStr = oArgs.map(e => e?.getAsCopyableKey() ?? 'null').join(';');
        let result = fnResults[argsStr];
        if (result && result.stability >= STABLE_LIMIT)
            return result.result.concat([BOOL_TRUE_SINGLETON]);
        FnBuilding.requests[name] = {
            hashArgs: argsStr,
            args: oArgs,
        };
        if (result)
            return result.result.concat([BOOL_FALSE_SINGLETON]);
        // console.log('call:', parameters);
        return parameters.slice(1).concat([BOOL_FALSE_SINGLETON]);
    }
    static compute_FN_PROCESS(parameters) {
        let [oName, ...oArgs] = parameters;
        let name = oName?.getAsCopyableKey() ?? 'null';
        let resultStr = oArgs.map(e => e?.getAsCopyableKey() ?? 'null').join(';');
        let fnRequest = FnBuilding.requests[name];
        let fnResults = FnBuilding.results[name] ??= {};
        if (!fnRequest)
            return [null, null, null, null, BOOL_FALSE_SINGLETON];
        let result = fnResults[fnRequest.hashArgs] ??= { hashResult: '', result: [], stability: 0 };
        console.log(result);
        if (result.hashResult == resultStr) {
            result.stability++;
            if (result.stability > STABLE_LIMIT)
                delete FnBuilding.requests[name];
        }
        else {
            result.stability = 0;
            result.hashResult = resultStr;
            result.result = oArgs;
        }
        return fnRequest.args;
    }
    static install(mod) {
        // MOD_ITEM_PROCESSOR_HANDLERS[FnBuilding.variant as any] = FnBuilding.process;
        mod.modInterface.addVariantToExistingBuilding(MetaVirtualProcessorBuilding, var_call, {
            name: 'Function',
            description: 'test_desc',
            tutorialImageBase64: RESOURCES.fn_call,
            regularSpriteBase64: RESOURCES.fn_call,
            blueprintSpriteBase64: RESOURCES.fn_call,
            dimensions: new Vector(4, 1),
            isUnlocked(root) {
                return true;
            },
        });
        mod.modInterface.addVariantToExistingBuilding(MetaVirtualProcessorBuilding, var_process, {
            name: 'Function',
            description: 'test_desc',
            tutorialImageBase64: RESOURCES.fn_process,
            regularSpriteBase64: RESOURCES.fn_process,
            blueprintSpriteBase64: RESOURCES.fn_process,
            dimensions: new Vector(4, 1),
            isUnlocked(root) {
                return true;
            },
        });
        mod.modInterface.extendClass(MetaVirtualProcessorBuilding, ({ $old }) => ({
            updateVariants(entity, rotationVariant, variant) {
                if (variant == var_call || variant == var_process) {
                    return FnBuilding.prototype.updateVariants.call(this, entity, rotationVariant, variant);
                }
                return $old.updateVariants.call(this, entity, rotationVariant, variant);
            }
        }));
        mod.modInterface.extendClass(LogicGateSystem, ({ $old }) => ({
            update() {
                this.boundOperations[var_call] ??= FnBuilding.compute_FN_CALL.bind(this);
                this.boundOperations[var_process] ??= FnBuilding.compute_FN_PROCESS.bind(this);
                return $old.update.call(this);
            }
        }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm4tYnVpbGRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvZm4tYnVpbGRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFZLG9CQUFvQixFQUFFLG1CQUFtQixFQUFrQyxhQUFhLEVBQXlDLGVBQWUsRUFBZ0MsZUFBZSxFQUFtRyw0QkFBNEIsRUFBb0UsTUFBTSxFQUFzQixNQUFNLG1CQUFtQixDQUFDO0FBRzNjLE1BQU0sUUFBUSxHQUFHLHVCQUF1QixDQUFDO0FBQ3pDLE1BQU0sV0FBVyxHQUFHLDBCQUEwQixDQUFDO0FBQy9DLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUt4QixNQUFNLE9BQU8sVUFBVyxTQUFRLDRCQUE0QjtJQUUzRCxjQUFjLENBQUMsTUFBYyxFQUFFLGVBQXVCLEVBQUUsT0FBZTtRQUN0RSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDekIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUM1QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUM1QyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2hCLE9BQU87WUFDUCxFQUFFLEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUU7WUFDL0YsWUFBWTtZQUNaLEVBQUUsR0FBRyxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRTtZQUNqRyxFQUFFLEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FB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QUF5QztBQUN6QywrQ0FBK0M7QUFDL0MsVUFBVTtBQUNWLFVBQVU7QUFDVixhQUFhO0FBQ2IsT0FBTztBQUNQLHFDQUFxQztBQUNyQyx1Q0FBdUM7QUFDdkMseUJBQXlCO0FBQ3pCLFNBQVM7QUFDVCwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLDhDQUE4QztBQUM5QyxVQUFVO0FBQ1YsU0FBUztBQUNULCtCQUErQjtBQUMvQix5Q0FBeUM7QUFDekMsK0NBQStDO0FBQy9DLFVBQVU7QUFDVixTQUFTO0FBQ1QsK0JBQStCO0FBQy9CLHdDQUF3QztBQUN4QywrQ0FBK0M7QUFDL0MsVUFBVTtBQUNWLFVBQVU7QUFDVixhQUFhO0FBQ2IsT0FBTztBQUNQLGNBQWM7QUFDZCw0REFBNEQ7QUFDNUQsTUFBTTtBQUNOLEtBQUs7QUFFTCxPQUFPO0FBQ1AsK0NBQStDO0FBQy9DLDZCQUE2QjtBQUM3QixPQUFPO0FBQ1AsMkNBQTJDO0FBQzNDLHlCQUF5QjtBQUN6Qiw4QkFBOEI7QUFDOUIsaUJBQWlCO0FBQ2pCLFFBQVE7QUFDUixPQUFPO0FBRVAscURBQXFEO0FBQ3JELEtBQUs7QUFDTCxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUkVTT1VSQ0VTIH0gZnJvbSBcIi4vY29tbW9uLmpzXCI7XHJcbmltcG9ydCB7IEJhc2VJdGVtLCBCT09MX0ZBTFNFX1NJTkdMRVRPTiwgQk9PTF9UUlVFX1NJTkdMRVRPTiwgZGVmYXVsdEJ1aWxkaW5nVmFyaWFudCwgRW50aXR5LCBlbnVtRGlyZWN0aW9uLCBlbnVtSHViR29hbFJld2FyZHMsIGVudW1Mb2dpY0dhdGVUeXBlLCBlbnVtUGluU2xvdFR5cGUsIEdhbWVSb290LCBMb2dpY0dhdGVDb21wb25lbnQsIExvZ2ljR2F0ZVN5c3RlbSwgTWV0YUJ1aWxkaW5nLCBNZXRhQ3V0dGVyQnVpbGRpbmcsIE1ldGFQYWludGVyQnVpbGRpbmcsIE1ldGFSb3RhdGVyQnVpbGRpbmcsIE1ldGFTdGFja2VyQnVpbGRpbmcsIE1ldGFWaXJ0dWFsUHJvY2Vzc29yQnVpbGRpbmcsIE1vZCwgTU9EX0lURU1fUFJPQ0VTU09SX0hBTkRMRVJTLCBQcm9jZXNzb3JJbXBsZW1lbnRhdGlvblBheWxvYWQsIFZlY3RvciwgV2lyZWRQaW5zQ29tcG9uZW50IH0gZnJvbSBcIi4vdHlwZXMvc2hhcGV6LmpzXCI7XHJcblxyXG5cclxuY29uc3QgdmFyX2NhbGwgPSAndmlydHVhbC1mdW5jdGlvbi1jYWxsJztcclxuY29uc3QgdmFyX3Byb2Nlc3MgPSAndmlydHVhbC1mdW5jdGlvbi1wcm9jZXNzJztcclxuY29uc3QgU1RBQkxFX0xJTUlUID0gMjA7XHJcblxyXG50eXBlIGhhc2hGbmFtZSA9IHN0cmluZztcclxudHlwZSBoYXNoQXJncyA9IHN0cmluZztcclxuXHJcbmV4cG9ydCBjbGFzcyBGbkJ1aWxkaW5nIGV4dGVuZHMgTWV0YVZpcnR1YWxQcm9jZXNzb3JCdWlsZGluZyB7XHJcblxyXG5cdHVwZGF0ZVZhcmlhbnRzKGVudGl0eTogRW50aXR5LCByb3RhdGlvblZhcmlhbnQ6IG51bWJlciwgdmFyaWFudDogc3RyaW5nKSB7XHJcblx0XHRjb25zdCBnYXRlVHlwZSA9IHZhcmlhbnQ7XHJcblx0XHRlbnRpdHkuY29tcG9uZW50cy5Mb2dpY0dhdGUudHlwZSA9IGdhdGVUeXBlO1xyXG5cdFx0Y29uc3QgcGluQ29tcCA9IGVudGl0eS5jb21wb25lbnRzLldpcmVkUGlucztcclxuXHRcdHBpbkNvbXAuc2V0U2xvdHMoW1xyXG5cdFx0XHQvLyBuYW1lXHJcblx0XHRcdHsgcG9zOiBuZXcgVmVjdG9yKDAsIDApLCBkaXJlY3Rpb246IGVudW1EaXJlY3Rpb24ubGVmdCwgdHlwZTogZW51bVBpblNsb3RUeXBlLmxvZ2ljYWxBY2NlcHRvciB9LFxyXG5cdFx0XHQvLyBhcmd1bWVudHNcclxuXHRcdFx0eyBwb3M6IG5ldyBWZWN0b3IoMCwgMCksIGRpcmVjdGlvbjogZW51bURpcmVjdGlvbi5ib3R0b20sIHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsQWNjZXB0b3IgfSxcclxuXHRcdFx0eyBwb3M6IG5ldyBWZWN0b3IoMSwgMCksIGRpcmVjdGlvbjogZW51bURpcmVjdGlvbi5ib3R0b20sIHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsQWNjZXB0b3IgfSxcclxuXHRcdFx0eyBwb3M6IG5ldyBWZWN0b3IoMiwgMCksIGRpcmVjdGlvbjogZW51bURpcmVjdGlvbi5ib3R0b20sIHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsQWNjZXB0b3IgfSxcclxuXHRcdFx0eyBwb3M6IG5ldyBWZWN0b3IoMywgMCksIGRpcmVjdGlvbjogZW51bURpcmVjdGlvbi5ib3R0b20sIHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsQWNjZXB0b3IgfSxcclxuXHRcdFx0Ly8gcmV0dXJuXHJcblx0XHRcdHsgcG9zOiBuZXcgVmVjdG9yKDAsIDApLCBkaXJlY3Rpb246IGVudW1EaXJlY3Rpb24udG9wLCB0eXBlOiBlbnVtUGluU2xvdFR5cGUubG9naWNhbEVqZWN0b3IgfSxcclxuXHRcdFx0eyBwb3M6IG5ldyBWZWN0b3IoMSwgMCksIGRpcmVjdGlvbjogZW51bURpcmVjdGlvbi50b3AsIHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsRWplY3RvciB9LFxyXG5cdFx0XHR7IHBvczogbmV3IFZlY3RvcigyLCAwKSwgZGlyZWN0aW9uOiBlbnVtRGlyZWN0aW9uLnRvcCwgdHlwZTogZW51bVBpblNsb3RUeXBlLmxvZ2ljYWxFamVjdG9yIH0sXHJcblx0XHRcdHsgcG9zOiBuZXcgVmVjdG9yKDMsIDApLCBkaXJlY3Rpb246IGVudW1EaXJlY3Rpb24udG9wLCB0eXBlOiBlbnVtUGluU2xvdFR5cGUubG9naWNhbEVqZWN0b3IgfSxcclxuXHRcdF0pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIHJlcXVlc3RzOiBSZWNvcmQ8XHJcblx0XHRoYXNoRm5hbWUsXHJcblx0XHR7IGhhc2hBcmdzOiBoYXNoQXJncywgYXJnczogKEJhc2VJdGVtIHwgbnVsbClbXSB9XHJcblx0PiA9IHt9O1xyXG5cdHN0YXRpYyByZXN1bHRzOiBSZWNvcmQ8XHJcblx0XHRoYXNoRm5hbWUsXHJcblx0XHRSZWNvcmQ8aGFzaEFyZ3MsXHJcblx0XHRcdHsgaGFzaFJlc3VsdDogaGFzaEFyZ3MsIHJlc3VsdDogKEJhc2VJdGVtIHwgbnVsbClbXSwgc3RhYmlsaXR5OiBudW1iZXIgfVxyXG5cdFx0Pj4gPSB7fTtcclxuXHQvLyBzdGF0aWMgcmVzdWx0cyA6IE1hcDxzdHJpbmcsID5cclxuXHQvLyBzdGF0aWMgY2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKEJhc2VJdGVtIHwgbnVsbClbXT4oKTtcclxuXHJcblx0c3RhdGljIGNvbXB1dGVfRk5fQ0FMTChwYXJhbWV0ZXJzOiBBcnJheTxCYXNlSXRlbSB8IG51bGw+KSB7XHJcblx0XHRsZXQgW29OYW1lLCAuLi5vQXJnc10gPSBwYXJhbWV0ZXJzO1xyXG5cdFx0bGV0IG5hbWUgPSBvTmFtZT8uZ2V0QXNDb3B5YWJsZUtleSgpID8/ICdudWxsJztcclxuXHRcdGxldCBmblJlc3VsdHMgPSBGbkJ1aWxkaW5nLnJlc3VsdHNbbmFtZV0gPz89IHt9O1xyXG5cdFx0bGV0IGFyZ3NTdHIgPSBvQXJncy5tYXAoZSA9PiBlPy5nZXRBc0NvcHlhYmxlS2V5KCkgPz8gJ251bGwnKS5qb2luKCc7Jyk7XHJcblxyXG5cdFx0bGV0IHJlc3VsdCA9IGZuUmVzdWx0c1thcmdzU3RyXTtcclxuXHRcdGlmIChyZXN1bHQgJiYgcmVzdWx0LnN0YWJpbGl0eSA+PSBTVEFCTEVfTElNSVQpIHJldHVybiByZXN1bHQucmVzdWx0LmNvbmNhdChbQk9PTF9UUlVFX1NJTkdMRVRPTl0pO1xyXG5cclxuXHRcdEZuQnVpbGRpbmcucmVxdWVzdHNbbmFtZV0gPSB7XHJcblx0XHRcdGhhc2hBcmdzOiBhcmdzU3RyLFxyXG5cdFx0XHRhcmdzOiBvQXJncyxcclxuXHRcdH07XHJcblx0XHRpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0LnJlc3VsdC5jb25jYXQoW0JPT0xfRkFMU0VfU0lOR0xFVE9OXSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2NhbGw6JywgcGFyYW1ldGVycyk7XHJcblx0XHRyZXR1cm4gcGFyYW1ldGVycy5zbGljZSgxKS5jb25jYXQoW0JPT0xfRkFMU0VfU0lOR0xFVE9OXSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY29tcHV0ZV9GTl9QUk9DRVNTKHBhcmFtZXRlcnM6IEFycmF5PEJhc2VJdGVtIHwgbnVsbD4pIHtcclxuXHRcdGxldCBbb05hbWUsIC4uLm9BcmdzXSA9IHBhcmFtZXRlcnM7XHJcblx0XHRsZXQgbmFtZSA9IG9OYW1lPy5nZXRBc0NvcHlhYmxlS2V5KCkgPz8gJ251bGwnO1xyXG5cdFx0bGV0IHJlc3VsdFN0ciA9IG9BcmdzLm1hcChlID0+IGU/LmdldEFzQ29weWFibGVLZXkoKSA/PyAnbnVsbCcpLmpvaW4oJzsnKTtcclxuXHJcblx0XHRsZXQgZm5SZXF1ZXN0ID0gRm5CdWlsZGluZy5yZXF1ZXN0c1tuYW1lXTtcclxuXHRcdGxldCBmblJlc3VsdHMgPSBGbkJ1aWxkaW5nLnJlc3VsdHNbbmFtZV0gPz89IHt9O1xyXG5cclxuXHRcdGlmICghZm5SZXF1ZXN0KSByZXR1cm4gW251bGwsIG51bGwsIG51bGwsIG51bGwsIEJPT0xfRkFMU0VfU0lOR0xFVE9OXTtcclxuXHJcblx0XHRsZXQgcmVzdWx0ID0gZm5SZXN1bHRzW2ZuUmVxdWVzdC5oYXNoQXJnc10gPz89IHsgaGFzaFJlc3VsdDogJycsIHJlc3VsdDogW10sIHN0YWJpbGl0eTogMCB9O1xyXG5cdFx0Y29uc29sZS5sb2cocmVzdWx0KTtcclxuXHRcdGlmIChyZXN1bHQuaGFzaFJlc3VsdCA9PSByZXN1bHRTdHIpIHtcclxuXHRcdFx0cmVzdWx0LnN0YWJpbGl0eSsrO1xyXG5cdFx0XHRpZiAocmVzdWx0LnN0YWJpbGl0eSA+IFNUQUJMRV9MSU1JVCkgZGVsZXRlIEZuQnVpbGRpbmcucmVxdWVzdHNbbmFtZV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXN1bHQuc3RhYmlsaXR5ID0gMDtcclxuXHRcdFx0cmVzdWx0Lmhhc2hSZXN1bHQgPSByZXN1bHRTdHI7XHJcblx0XHRcdHJlc3VsdC5yZXN1bHQgPSBvQXJncztcclxuXHRcdH1cclxuXHRcdHJldHVybiBmblJlcXVlc3QuYXJncztcclxuXHR9XHJcblxyXG5cclxuXHRzdGF0aWMgaW5zdGFsbChtb2Q6IE1vZCkge1xyXG5cdFx0Ly8gTU9EX0lURU1fUFJPQ0VTU09SX0hBTkRMRVJTW0ZuQnVpbGRpbmcudmFyaWFudCBhcyBhbnldID0gRm5CdWlsZGluZy5wcm9jZXNzO1xyXG5cdFx0bW9kLm1vZEludGVyZmFjZS5hZGRWYXJpYW50VG9FeGlzdGluZ0J1aWxkaW5nKFxyXG5cdFx0XHRNZXRhVmlydHVhbFByb2Nlc3NvckJ1aWxkaW5nIGFzIGFueSxcclxuXHRcdFx0dmFyX2NhbGwsXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnRnVuY3Rpb24nLFxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAndGVzdF9kZXNjJyxcclxuXHJcblx0XHRcdFx0dHV0b3JpYWxJbWFnZUJhc2U2NDogUkVTT1VSQ0VTLmZuX2NhbGwsXHJcblx0XHRcdFx0cmVndWxhclNwcml0ZUJhc2U2NDogUkVTT1VSQ0VTLmZuX2NhbGwsXHJcblx0XHRcdFx0Ymx1ZXByaW50U3ByaXRlQmFzZTY0OiBSRVNPVVJDRVMuZm5fY2FsbCxcclxuXHJcblx0XHRcdFx0ZGltZW5zaW9uczogbmV3IFZlY3Rvcig0LCAxKSxcclxuXHRcdFx0XHRpc1VubG9ja2VkKHJvb3QpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlIGFzIGFueTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cdFx0bW9kLm1vZEludGVyZmFjZS5hZGRWYXJpYW50VG9FeGlzdGluZ0J1aWxkaW5nKFxyXG5cdFx0XHRNZXRhVmlydHVhbFByb2Nlc3NvckJ1aWxkaW5nIGFzIGFueSxcclxuXHRcdFx0dmFyX3Byb2Nlc3MsXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnRnVuY3Rpb24nLFxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAndGVzdF9kZXNjJyxcclxuXHJcblx0XHRcdFx0dHV0b3JpYWxJbWFnZUJhc2U2NDogUkVTT1VSQ0VTLmZuX3Byb2Nlc3MsXHJcblx0XHRcdFx0cmVndWxhclNwcml0ZUJhc2U2NDogUkVTT1VSQ0VTLmZuX3Byb2Nlc3MsXHJcblx0XHRcdFx0Ymx1ZXByaW50U3ByaXRlQmFzZTY0OiBSRVNPVVJDRVMuZm5fcHJvY2VzcyxcclxuXHJcblx0XHRcdFx0ZGltZW5zaW9uczogbmV3IFZlY3Rvcig0LCAxKSxcclxuXHRcdFx0XHRpc1VubG9ja2VkKHJvb3QpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlIGFzIGFueTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cdFx0bW9kLm1vZEludGVyZmFjZS5leHRlbmRDbGFzcyhcclxuXHRcdFx0TWV0YVZpcnR1YWxQcm9jZXNzb3JCdWlsZGluZyxcclxuXHRcdFx0KHsgJG9sZCB9KSA9PiAoe1xyXG5cdFx0XHRcdHVwZGF0ZVZhcmlhbnRzKGVudGl0eTogRW50aXR5LCByb3RhdGlvblZhcmlhbnQ6IG51bWJlciwgdmFyaWFudDogc3RyaW5nKSB7XHJcblx0XHRcdFx0XHRpZiAodmFyaWFudCA9PSB2YXJfY2FsbCB8fCB2YXJpYW50ID09IHZhcl9wcm9jZXNzKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBGbkJ1aWxkaW5nLnByb3RvdHlwZS51cGRhdGVWYXJpYW50cy5jYWxsKHRoaXMsIGVudGl0eSwgcm90YXRpb25WYXJpYW50LCB2YXJpYW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiAkb2xkLnVwZGF0ZVZhcmlhbnRzLmNhbGwodGhpcywgZW50aXR5LCByb3RhdGlvblZhcmlhbnQsIHZhcmlhbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHRtb2QubW9kSW50ZXJmYWNlLmV4dGVuZENsYXNzKFxyXG5cdFx0XHRMb2dpY0dhdGVTeXN0ZW0sXHJcblx0XHRcdCh7ICRvbGQgfSkgPT4gKHtcclxuXHRcdFx0XHR1cGRhdGUodGhpczogTG9naWNHYXRlU3lzdGVtKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJvdW5kT3BlcmF0aW9uc1t2YXJfY2FsbF0gPz89IEZuQnVpbGRpbmcuY29tcHV0ZV9GTl9DQUxMLmJpbmQodGhpcyk7XHJcblx0XHRcdFx0XHR0aGlzLmJvdW5kT3BlcmF0aW9uc1t2YXJfcHJvY2Vzc10gPz89IEZuQnVpbGRpbmcuY29tcHV0ZV9GTl9QUk9DRVNTLmJpbmQodGhpcyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gJG9sZC51cGRhdGUuY2FsbCh0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuLy8gdmlydHVhbC1mdW5jdGlvblxyXG5cclxuXHJcbi8vIGNsYXNzIE1vZGFzZCBleHRlbmRzIHNoYXBlei5Nb2Qge1xyXG4vLyBcdGluaXQoKSB7XHJcbi8vIFx0XHRzaGFwZXouZW51bUN1dHRlclZhcmlhbnRzLm1pcnJvcmVkID0gXCJtaXJyb3JlZFwiO1xyXG5cclxuLy8gXHRcdHRoaXMubW9kSW50ZXJmYWNlLmFkZFZhcmlhbnRUb0V4aXN0aW5nQnVpbGRpbmcoXHJcbi8vIFx0XHRcdHNoYXBlei5NZXRhQ3V0dGVyQnVpbGRpbmcsXHJcbi8vIFx0XHRcdHNoYXBlei5lbnVtQ3V0dGVyVmFyaWFudHMubWlycm9yZWQsXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRuYW1lOiBcIkN1dHRlciAoTWlycm9yZWQpXCIsXHJcbi8vIFx0XHRcdFx0ZGVzY3JpcHRpb246IFwiQSBtaXJyb3JlZCBjdXR0ZXJcIixcclxuXHJcbi8vIFx0XHRcdFx0dHV0b3JpYWxJbWFnZUJhc2U2NDogUkVTT1VSQ0VTW1wiY3V0dGVyLW1pcnJvcmVkLnBuZ1wiXSxcclxuLy8gXHRcdFx0XHRyZWd1bGFyU3ByaXRlQmFzZTY0OiBSRVNPVVJDRVNbXCJjdXR0ZXItbWlycm9yZWQucG5nXCJdLFxyXG4vLyBcdFx0XHRcdGJsdWVwcmludFNwcml0ZUJhc2U2NDogUkVTT1VSQ0VTW1wiY3V0dGVyLW1pcnJvcmVkLnBuZ1wiXSxcclxuXHJcbi8vIFx0XHRcdFx0ZGltZW5zaW9uczogbmV3IHNoYXBlei5WZWN0b3IoMiwgMSksXHJcblxyXG4vLyBcdFx0XHRcdGFkZGl0aW9uYWxTdGF0aXN0aWNzKHJvb3QpIHtcclxuLy8gXHRcdFx0XHRcdGNvbnN0IHNwZWVkID0gcm9vdC5odWJHb2Fscy5nZXRQcm9jZXNzb3JCYXNlU3BlZWQoc2hhcGV6LmVudW1JdGVtUHJvY2Vzc29yVHlwZXMuY3V0dGVyKTtcclxuLy8gXHRcdFx0XHRcdHJldHVybiBbXHJcbi8vIFx0XHRcdFx0XHRcdFtcclxuLy8gXHRcdFx0XHRcdFx0XHRzaGFwZXouVC5pbmdhbWUuYnVpbGRpbmdQbGFjZW1lbnQuaW5mb1RleHRzLnNwZWVkLFxyXG4vLyBcdFx0XHRcdFx0XHRcdHNoYXBlei5mb3JtYXRJdGVtc1BlclNlY29uZChzcGVlZCksXHJcbi8vIFx0XHRcdFx0XHRcdF0sXHJcbi8vIFx0XHRcdFx0XHRdO1xyXG4vLyBcdFx0XHRcdH0sXHJcblxyXG4vLyBcdFx0XHRcdGlzVW5sb2NrZWQocm9vdCkge1xyXG4vLyBcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcbi8vIFx0XHRcdFx0fSxcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0KTtcclxuXHJcbi8vIFx0XHQvLyBFeHRlbmQgaW5zdGFuY2UgbWV0aG9kc1xyXG4vLyBcdFx0dGhpcy5tb2RJbnRlcmZhY2UuZXh0ZW5kQ2xhc3Moc2hhcGV6Lk1ldGFDdXR0ZXJCdWlsZGluZywgKHsgJG9sZCB9KSA9PiAoe1xyXG4vLyBcdFx0XHR1cGRhdGVWYXJpYW50cyhlbnRpdHksIHJvdGF0aW9uVmFyaWFudCwgdmFyaWFudCkge1xyXG4vLyBcdFx0XHRcdGlmICh2YXJpYW50ID09PSBzaGFwZXouZW51bUN1dHRlclZhcmlhbnRzLm1pcnJvcmVkKSB7XHJcbi8vIFx0XHRcdFx0XHRlbnRpdHkuY29tcG9uZW50cy5JdGVtRWplY3Rvci5zZXRTbG90cyhbXHJcbi8vIFx0XHRcdFx0XHRcdHsgcG9zOiBuZXcgc2hhcGV6LlZlY3RvcigwLCAwKSwgZGlyZWN0aW9uOiBzaGFwZXouZW51bURpcmVjdGlvbi50b3AgfSxcclxuLy8gXHRcdFx0XHRcdFx0eyBwb3M6IG5ldyBzaGFwZXouVmVjdG9yKDEsIDApLCBkaXJlY3Rpb246IHNoYXBlei5lbnVtRGlyZWN0aW9uLnRvcCB9LFxyXG4vLyBcdFx0XHRcdFx0XSk7XHJcbi8vIFx0XHRcdFx0XHRlbnRpdHkuY29tcG9uZW50cy5JdGVtUHJvY2Vzc29yLnR5cGUgPSBzaGFwZXouZW51bUl0ZW1Qcm9jZXNzb3JUeXBlcy5jdXR0ZXI7XHJcbi8vIFx0XHRcdFx0XHRlbnRpdHkuY29tcG9uZW50cy5JdGVtQWNjZXB0b3Iuc2V0U2xvdHMoW1xyXG4vLyBcdFx0XHRcdFx0XHR7XHJcbi8vIFx0XHRcdFx0XHRcdFx0cG9zOiBuZXcgc2hhcGV6LlZlY3RvcigxLCAwKSxcclxuLy8gXHRcdFx0XHRcdFx0XHRkaXJlY3Rpb246IHNoYXBlei5lbnVtRGlyZWN0aW9uLmJvdHRvbSxcclxuLy8gXHRcdFx0XHRcdFx0XHRmaWx0ZXI6IFwic2hhcGVcIixcclxuLy8gXHRcdFx0XHRcdFx0fSxcclxuLy8gXHRcdFx0XHRcdF0pO1xyXG4vLyBcdFx0XHRcdH0gZWxzZSB7XHJcbi8vIFx0XHRcdFx0XHQvLyBTaW5jZSB3ZSBhcmUgY2hhbmdpbmcgdGhlIEl0ZW1BY2NlcHRvciBzbG90cywgd2Ugc2hvdWxkIHJlc2V0XHJcbi8vIFx0XHRcdFx0XHQvLyBpdCB0byB0aGUgcmVndWxhciBzbG90cyB3aGVuIHdlIGFyZSBub3QgdXNpbmcgb3VyIG1pcnJvcmVkIHZhcmlhbnRcclxuLy8gXHRcdFx0XHRcdGVudGl0eS5jb21wb25lbnRzLkl0ZW1BY2NlcHRvci5zZXRTbG90cyhbXHJcbi8vIFx0XHRcdFx0XHRcdHtcclxuLy8gXHRcdFx0XHRcdFx0XHRwb3M6IG5ldyBzaGFwZXouVmVjdG9yKDAsIDApLFxyXG4vLyBcdFx0XHRcdFx0XHRcdGRpcmVjdGlvbjogc2hhcGV6LmVudW1EaXJlY3Rpb24uYm90dG9tLFxyXG4vLyBcdFx0XHRcdFx0XHRcdGZpbHRlcjogXCJzaGFwZVwiLFxyXG4vLyBcdFx0XHRcdFx0XHR9LFxyXG4vLyBcdFx0XHRcdFx0XSk7XHJcbi8vIFx0XHRcdFx0XHQkb2xkLnVwZGF0ZVZhcmlhbnRzLmJpbmQodGhpcykoZW50aXR5LCByb3RhdGlvblZhcmlhbnQsIHZhcmlhbnQpO1xyXG4vLyBcdFx0XHRcdH1cclxuLy8gXHRcdFx0fSxcclxuLy8gXHRcdH0pKTtcclxuLy8gXHR9XHJcbi8vIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyAvKiogQGVudW0ge3N0cmluZ30gKi9cclxuLy8gZXhwb3J0IGNvbnN0IGVudW1WaXJ0dWFsUHJvY2Vzc29yVmFyaWFudHMgPSB7XHJcbi8vIFx0cm90YXRlcjogXCJyb3RhdGVyXCIsXHJcbi8vIFx0dW5zdGFja2VyOiBcInVuc3RhY2tlclwiLFxyXG4vLyBcdHN0YWNrZXI6IFwic3RhY2tlclwiLFxyXG4vLyBcdHBhaW50ZXI6IFwicGFpbnRlclwiLFxyXG4vLyB9O1xyXG5cclxuLy8gLy8gLyoqIEBlbnVtIHtzdHJpbmd9ICovXHJcbi8vIC8vIGNvbnN0IGVudW1WYXJpYW50VG9HYXRlID0ge1xyXG4vLyAvLyBcdFtkZWZhdWx0QnVpbGRpbmdWYXJpYW50XTogZW51bUxvZ2ljR2F0ZVR5cGUuY3V0dGVyLFxyXG4vLyAvLyBcdFtlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnJvdGF0ZXJdOiBlbnVtTG9naWNHYXRlVHlwZS5yb3RhdGVyLFxyXG4vLyAvLyBcdFtlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnVuc3RhY2tlcl06IGVudW1Mb2dpY0dhdGVUeXBlLnVuc3RhY2tlcixcclxuLy8gLy8gXHRbZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy5zdGFja2VyXTogZW51bUxvZ2ljR2F0ZVR5cGUuc3RhY2tlcixcclxuLy8gLy8gXHRbZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy5wYWludGVyXTogZW51bUxvZ2ljR2F0ZVR5cGUucGFpbnRlcixcclxuLy8gLy8gfTtcclxuXHJcbi8vIC8vIGNvbnN0IGNvbG9ycyA9IHtcclxuLy8gLy8gXHRbZGVmYXVsdEJ1aWxkaW5nVmFyaWFudF06IG5ldyBNZXRhQ3V0dGVyQnVpbGRpbmcoKS5nZXRTaWxob3VldHRlQ29sb3IoKSxcclxuLy8gLy8gXHRbZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy5yb3RhdGVyXTogbmV3IE1ldGFSb3RhdGVyQnVpbGRpbmcoKS5nZXRTaWxob3VldHRlQ29sb3IoKSxcclxuLy8gLy8gXHRbZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy51bnN0YWNrZXJdOiBuZXcgTWV0YVN0YWNrZXJCdWlsZGluZygpLmdldFNpbGhvdWV0dGVDb2xvcigpLFxyXG4vLyAvLyBcdFtlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnN0YWNrZXJdOiBuZXcgTWV0YVN0YWNrZXJCdWlsZGluZygpLmdldFNpbGhvdWV0dGVDb2xvcigpLFxyXG4vLyAvLyBcdFtlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnBhaW50ZXJdOiBuZXcgTWV0YVBhaW50ZXJCdWlsZGluZygpLmdldFNpbGhvdWV0dGVDb2xvcigpLFxyXG4vLyAvLyB9O1xyXG5cclxuLy8gZXhwb3J0IGNsYXNzIE1ldGFWaXJ0dWFsUHJvY2Vzc29yQnVpbGRpbmdfRm4gZXh0ZW5kcyBNZXRhVmlydHVhbFByb2Nlc3NvckJ1aWxkaW5nIHtcclxuLy8gXHRjb25zdHJ1Y3RvcigpIHtcclxuLy8gXHRcdHN1cGVyKFwidmlydHVhbF9wcm9jZXNzb3JcIik7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHRzdGF0aWMgZ2V0QWxsVmFyaWFudENvbWJpbmF0aW9ucygpIHtcclxuLy8gXHRcdHJldHVybiBbXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRpbnRlcm5hbElkOiA0MixcclxuLy8gXHRcdFx0XHR2YXJpYW50OiBkZWZhdWx0QnVpbGRpbmdWYXJpYW50LFxyXG4vLyBcdFx0XHR9LFxyXG4vLyBcdFx0XHR7XHJcbi8vIFx0XHRcdFx0aW50ZXJuYWxJZDogNDQsXHJcbi8vIFx0XHRcdFx0dmFyaWFudDogZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy5yb3RhdGVyLFxyXG4vLyBcdFx0XHR9LFxyXG4vLyBcdFx0XHR7XHJcbi8vIFx0XHRcdFx0aW50ZXJuYWxJZDogNDUsXHJcbi8vIFx0XHRcdFx0dmFyaWFudDogZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy51bnN0YWNrZXIsXHJcbi8vIFx0XHRcdH0sXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRpbnRlcm5hbElkOiA1MCxcclxuLy8gXHRcdFx0XHR2YXJpYW50OiBlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnN0YWNrZXIsXHJcbi8vIFx0XHRcdH0sXHJcbi8vIFx0XHRcdHtcclxuLy8gXHRcdFx0XHRpbnRlcm5hbElkOiA1MSxcclxuLy8gXHRcdFx0XHR2YXJpYW50OiBlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnBhaW50ZXIsXHJcbi8vIFx0XHRcdH0sXHJcbi8vIFx0XHRdO1xyXG4vLyBcdH1cclxuXHJcbi8vIFx0Z2V0U2lsaG91ZXR0ZUNvbG9yKHZhcmlhbnQ6IHN0cmluZykge1xyXG4vLyBcdFx0cmV0dXJuIGNvbG9yc1t2YXJpYW50XTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdC8qKlxyXG4vLyBcdCAqIEBwYXJhbSB7R2FtZVJvb3R9IHJvb3RcclxuLy8gXHQgKi9cclxuLy8gXHRnZXRJc1VubG9ja2VkKHJvb3Q6IEdhbWVSb290KSB7XHJcbi8vIFx0XHRyZXR1cm4gcm9vdC5odWJHb2Fscy5pc1Jld2FyZFVubG9ja2VkKGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfdmlydHVhbF9wcm9jZXNzaW5nKTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdC8qKiBAcmV0dXJucyB7XCJ3aXJlc1wifSAqKi9cclxuLy8gXHRnZXRMYXllcigpIHtcclxuLy8gXHRcdHJldHVybiBcIndpcmVzXCI7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHRnZXREaW1lbnNpb25zKCkge1xyXG4vLyBcdFx0cmV0dXJuIG5ldyBWZWN0b3IoMSwgMSk7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHRnZXRBdmFpbGFibGVWYXJpYW50cygpIHtcclxuLy8gXHRcdHJldHVybiBbXHJcbi8vIFx0XHRcdGRlZmF1bHRCdWlsZGluZ1ZhcmlhbnQsXHJcbi8vIFx0XHRcdGVudW1WaXJ0dWFsUHJvY2Vzc29yVmFyaWFudHMucm90YXRlcixcclxuLy8gXHRcdFx0ZW51bVZpcnR1YWxQcm9jZXNzb3JWYXJpYW50cy5zdGFja2VyLFxyXG4vLyBcdFx0XHRlbnVtVmlydHVhbFByb2Nlc3NvclZhcmlhbnRzLnBhaW50ZXIsXHJcbi8vIFx0XHRcdGVudW1WaXJ0dWFsUHJvY2Vzc29yVmFyaWFudHMudW5zdGFja2VyLFxyXG4vLyBcdFx0XTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdGdldFJlbmRlclBpbnMoKSB7XHJcbi8vIFx0XHQvLyBXZSBhbHJlYWR5IGhhdmUgaXQgaW5jbHVkZWRcclxuLy8gXHRcdHJldHVybiBmYWxzZTtcclxuLy8gXHR9XHJcblxyXG4vLyBcdC8qKlxyXG4vLyBcdCAqXHJcbi8vIFx0ICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eVxyXG4vLyBcdCAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvblZhcmlhbnRcclxuLy8gXHQgKi9cclxuLy8gXHR1cGRhdGVWYXJpYW50cyhlbnRpdHk6IEVudGl0eSwgcm90YXRpb25WYXJpYW50OiBudW1iZXIsIHZhcmlhbnQ6IHN0cmluZykge1xyXG4vLyBcdFx0Y29uc3QgZ2F0ZVR5cGUgPSBlbnVtVmFyaWFudFRvR2F0ZVt2YXJpYW50XTtcclxuLy8gXHRcdGVudGl0eS5jb21wb25lbnRzLkxvZ2ljR2F0ZS50eXBlID0gZ2F0ZVR5cGU7XHJcbi8vIFx0XHRjb25zdCBwaW5Db21wID0gZW50aXR5LmNvbXBvbmVudHMuV2lyZWRQaW5zO1xyXG4vLyBcdFx0c3dpdGNoIChnYXRlVHlwZSkge1xyXG4vLyBcdFx0XHRjYXNlIGVudW1Mb2dpY0dhdGVUeXBlLmN1dHRlcjpcclxuLy8gXHRcdFx0Y2FzZSBlbnVtTG9naWNHYXRlVHlwZS51bnN0YWNrZXI6IHtcclxuLy8gXHRcdFx0XHRwaW5Db21wLnNldFNsb3RzKFtcclxuLy8gXHRcdFx0XHRcdHtcclxuLy8gXHRcdFx0XHRcdFx0cG9zOiBuZXcgVmVjdG9yKDAsIDApLFxyXG4vLyBcdFx0XHRcdFx0XHRkaXJlY3Rpb246IGVudW1EaXJlY3Rpb24ubGVmdCxcclxuLy8gXHRcdFx0XHRcdFx0dHlwZTogZW51bVBpblNsb3RUeXBlLmxvZ2ljYWxFamVjdG9yLFxyXG4vLyBcdFx0XHRcdFx0fSxcclxuLy8gXHRcdFx0XHRcdHtcclxuLy8gXHRcdFx0XHRcdFx0cG9zOiBuZXcgVmVjdG9yKDAsIDApLFxyXG4vLyBcdFx0XHRcdFx0XHRkaXJlY3Rpb246IGVudW1EaXJlY3Rpb24ucmlnaHQsXHJcbi8vIFx0XHRcdFx0XHRcdHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsRWplY3RvcixcclxuLy8gXHRcdFx0XHRcdH0sXHJcbi8vIFx0XHRcdFx0XHR7XHJcbi8vIFx0XHRcdFx0XHRcdHBvczogbmV3IFZlY3RvcigwLCAwKSxcclxuLy8gXHRcdFx0XHRcdFx0ZGlyZWN0aW9uOiBlbnVtRGlyZWN0aW9uLmJvdHRvbSxcclxuLy8gXHRcdFx0XHRcdFx0dHlwZTogZW51bVBpblNsb3RUeXBlLmxvZ2ljYWxBY2NlcHRvcixcclxuLy8gXHRcdFx0XHRcdH0sXHJcbi8vIFx0XHRcdFx0XSk7XHJcbi8vIFx0XHRcdFx0YnJlYWs7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdFx0Y2FzZSBlbnVtTG9naWNHYXRlVHlwZS5yb3RhdGVyOiB7XHJcbi8vIFx0XHRcdFx0cGluQ29tcC5zZXRTbG90cyhbXHJcbi8vIFx0XHRcdFx0XHR7XHJcbi8vIFx0XHRcdFx0XHRcdHBvczogbmV3IFZlY3RvcigwLCAwKSxcclxuLy8gXHRcdFx0XHRcdFx0ZGlyZWN0aW9uOiBlbnVtRGlyZWN0aW9uLnRvcCxcclxuLy8gXHRcdFx0XHRcdFx0dHlwZTogZW51bVBpblNsb3RUeXBlLmxvZ2ljYWxFamVjdG9yLFxyXG4vLyBcdFx0XHRcdFx0fSxcclxuLy8gXHRcdFx0XHRcdHtcclxuLy8gXHRcdFx0XHRcdFx0cG9zOiBuZXcgVmVjdG9yKDAsIDApLFxyXG4vLyBcdFx0XHRcdFx0XHRkaXJlY3Rpb246IGVudW1EaXJlY3Rpb24uYm90dG9tLFxyXG4vLyBcdFx0XHRcdFx0XHR0eXBlOiBlbnVtUGluU2xvdFR5cGUubG9naWNhbEFjY2VwdG9yLFxyXG4vLyBcdFx0XHRcdFx0fSxcclxuLy8gXHRcdFx0XHRdKTtcclxuLy8gXHRcdFx0XHRicmVhaztcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRjYXNlIGVudW1Mb2dpY0dhdGVUeXBlLnN0YWNrZXI6XHJcbi8vIFx0XHRcdGNhc2UgZW51bUxvZ2ljR2F0ZVR5cGUucGFpbnRlcjoge1xyXG4vLyBcdFx0XHRcdHBpbkNvbXAuc2V0U2xvdHMoW1xyXG4vLyBcdFx0XHRcdFx0e1xyXG4vLyBcdFx0XHRcdFx0XHRwb3M6IG5ldyBWZWN0b3IoMCwgMCksXHJcbi8vIFx0XHRcdFx0XHRcdGRpcmVjdGlvbjogZW51bURpcmVjdGlvbi50b3AsXHJcbi8vIFx0XHRcdFx0XHRcdHR5cGU6IGVudW1QaW5TbG90VHlwZS5sb2dpY2FsRWplY3RvcixcclxuLy8gXHRcdFx0XHRcdH0sXHJcbi8vIFx0XHRcdFx0XHR7XHJcbi8vIFx0XHRcdFx0XHRcdHBvczogbmV3IFZlY3RvcigwLCAwKSxcclxuLy8gXHRcdFx0XHRcdFx0ZGlyZWN0aW9uOiBlbnVtRGlyZWN0aW9uLmJvdHRvbSxcclxuLy8gXHRcdFx0XHRcdFx0dHlwZTogZW51bVBpblNsb3RUeXBlLmxvZ2ljYWxBY2NlcHRvcixcclxuLy8gXHRcdFx0XHRcdH0sXHJcbi8vIFx0XHRcdFx0XHR7XHJcbi8vIFx0XHRcdFx0XHRcdHBvczogbmV3IFZlY3RvcigwLCAwKSxcclxuLy8gXHRcdFx0XHRcdFx0ZGlyZWN0aW9uOiBlbnVtRGlyZWN0aW9uLnJpZ2h0LFxyXG4vLyBcdFx0XHRcdFx0XHR0eXBlOiBlbnVtUGluU2xvdFR5cGUubG9naWNhbEFjY2VwdG9yLFxyXG4vLyBcdFx0XHRcdFx0fSxcclxuLy8gXHRcdFx0XHRdKTtcclxuLy8gXHRcdFx0XHRicmVhaztcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0XHRkZWZhdWx0OlxyXG4vLyBcdFx0XHRcdGFzc2VydEFsd2F5cyhcInVua25vd24gbG9naWMgZ2F0ZSB0eXBlOiBcIiArIGdhdGVUeXBlKTtcclxuLy8gXHRcdH1cclxuLy8gXHR9XHJcblxyXG4vLyBcdC8qKlxyXG4vLyBcdCAqIENyZWF0ZXMgdGhlIGVudGl0eSBhdCB0aGUgZ2l2ZW4gbG9jYXRpb25cclxuLy8gXHQgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5XHJcbi8vIFx0ICovXHJcbi8vIFx0c2V0dXBFbnRpdHlDb21wb25lbnRzKGVudGl0eTogRW50aXR5KSB7XHJcbi8vIFx0XHRlbnRpdHkuYWRkQ29tcG9uZW50KFxyXG4vLyBcdFx0XHRuZXcgV2lyZWRQaW5zQ29tcG9uZW50KHtcclxuLy8gXHRcdFx0XHRzbG90czogW10sXHJcbi8vIFx0XHRcdH0pXHJcbi8vIFx0XHQpO1xyXG5cclxuLy8gXHRcdGVudGl0eS5hZGRDb21wb25lbnQobmV3IExvZ2ljR2F0ZUNvbXBvbmVudCh7fSkpO1xyXG4vLyBcdH1cclxuLy8gfVxyXG4iXX0=