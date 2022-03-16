
declare module "shapez/game/components/item_processor" {
	export interface enumItemProcessorTypes {
		balancer: 'balancer';
		cutter: 'cutter';
		cutterQuad: 'cutterQuad';
		rotater: 'rotater';
		rotaterCCW: 'rotaterCCW';
		rotater180: 'rotater180';
		stacker: 'stacker';
		trash: 'trash';
		mixer: 'mixer';
		painter: 'painter';
		painterDouble: 'painterDouble';
		painterQuad: 'painterQuad';
		hub: 'hub';
		filter: 'filter';
		reader: 'reader';
		goal: 'goal';
	}
	export const enumItemProcessorTypes: enumItemProcessorTypes;
}


declare module "shapez/game/hub_goals" {
	import { enumItemProcessorTypes } from "shapez/game/components/item_processor";
	import { GameRoot } from "shapez/game/root";
	export const MOD_ITEM_PROCESSOR_SPEEDS: Record<keyof enumItemProcessorTypes, (root: GameRoot) => number>
}

declare module "*.png" {
	type ImageString = string & { _: ImageString };
	const s: ImageString;
	export default s;
}


declare module "shapez/mods/mod_interface" {
	export type ExtendClass<T> = ({ $super, $old }: {
		$super: T; $old: T
	}) => Partial<T>;
}

declare module "shapez/game/systems/item_processor" {
	/**
	 * @type {Object<string, (ProcessorImplementationPayload) => void>}
	 */
	export const MOD_ITEM_PROCESSOR_HANDLERS: {
		[x: string]: (this: ItemProcessorSystem, payload: ProcessorImplementationPayload) => void;
	};

}

// choice
declare module "shapez/core/rng" {
	export class RandomNumberGenerator {
		/**
		 *
		 * @param {number|string=} seed
		 */
		constructor(seed?: (number | string) | undefined);
		internalRng: {
			(): number;
			exportState(): number[];
			importState(i: any): void;
		};
		/**
		 * Re-seeds the generator
		 * @param {number|string} seed
		 */
		reseed(seed: number | string): void;
		/**
		 * @returns {number} between 0 and 1
		 */
		next(): number;
		/**
		 * Random choice of an array
		 * @param {array} array
		 */
		choice<T>(array: T[]): T;
		/**
		 * @param {number} min
		 * @param {number} max
		 * @returns {number} Integer in range [min, max[
		 */
		nextIntRange(min: number, max: number): number;
		/**
		 * @param {number} min
		 * @param {number} max
		 * @returns {number} Number in range [min, max[
		 */
		nextRange(min: number, max: number): number;
		/**
		 * Updates the seed
		 * @param {number} seed
		 */
		setSeed(seed: number): void;
	}
}

// fixme
type NeverPartial<T> = {
	[P in keyof T]: T[P];
}

// declare module "shapez/core/rng" {
// 	export class RandomNumberGenerator {
// 		choice<T>(array: T[]): T;
// 	}
// }

/*

	export class ItemProcessorComponent extends NonAbstract(Component) {
		 constructor({
			processorType,
			processingRequirement,
			inputsPerCharge,
		}: {
							vvvvv
			processorType?: keyof enumItemProcessorTypes | undefined;
*/


declare module "shapez/game/tutorial_goals" {
	/**
	 * Don't forget to also update tutorial_goals_mappings.js as well as the translations!
	 */
	export interface enumHubGoalRewardsInterface {
		reward_cutter_and_trash: 'reward_cutter_and_trash';
		reward_rotater: 'reward_rotater';
		reward_painter: 'reward_painter';
		reward_mixer: 'reward_mixer';
		reward_stacker: 'reward_stacker';
		reward_balancer: 'reward_balancer';
		reward_tunnel: 'reward_tunnel';
		reward_rotater_ccw: 'reward_rotater_ccw';
		reward_rotater_180: 'reward_rotater_180';
		reward_miner_chainable: 'reward_miner_chainable';
		reward_underground_belt_tier_2: 'reward_underground_belt_tier_2';
		reward_belt_reader: 'reward_belt_reader';
		reward_splitter: 'reward_splitter';
		reward_cutter_quad: 'reward_cutter_quad';
		reward_painter_double: 'reward_painter_double';
		reward_storage: 'reward_storage';
		reward_merger: 'reward_merger';
		reward_wires_painter_and_levers: 'reward_wires_painter_and_levers';
		reward_display: 'reward_display';
		reward_constant_signal: 'reward_constant_signal';
		reward_logic_gates: 'reward_logic_gates';
		reward_virtual_processing: 'reward_virtual_processing';
		reward_filter: 'reward_filter';
		reward_demo_end: 'reward_demo_end';
		reward_blueprints: 'reward_blueprints';
		reward_freeplay: 'reward_freeplay';
		no_reward: 'no_reward';
		no_reward_freeplay: 'no_reward_freeplay';
	}
	export const enumHubGoalRewards: enumHubGoalRewardsInterface;
	export type enumHubGoalRewards = keyof enumHubGoalRewardsInterface;
}