import { RandomNumberGenerator } from "shapez/core/rng";
import { findNiceIntegerValue } from "shapez/core/utils";
import { GameMode } from "shapez/game/game_mode";
import { RegularGameMode } from "shapez/game/modes/regular";
import { GameRoot } from "shapez/game/root";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { Mod } from "shapez/mods/mod";
import { SzDefinition } from "../shapest/definition";
import { SzShapeItem } from "../shapest/item";
import { SzLayer } from "../shapest/layer";


export const namedShapes = {
	circle: "6CuCuCuCuCuCu",
	circleHalf: "6------CuCuCu",
	rect: "6RuRuRuRuRuRu",
	rectHalf: "6RuRuRu------",
	circleHalfRotated: "6Cu------CuCu",
	circleQuad: "6CuCu--------",
	circleRed: "6CrCrCrCrCrCr",
	rectHalfBlue: "6RbRbRb------",
	circlePurple: "6CpCpCpCpCpCp",
	starCyan: "6ScScScScScSc",
	fish: "6CgCgScScCgCg",
	blueprint: "6CbCbCbCbCbRb:6CwCwCwCwCwCw",
	rectCircle: "6RpRpRpRpRpRp:6CwCwCwCwCwCw",
	watermelon: "6--CgCg------:6--CrCr------",
	starCircle: "6SrSrSrSrSrSr:6CyCyCyCyCyCy",
	starCircleStar: "6SrSrSrSrSrSr:6CyCyCyCyCyCy:6SwSwSwSwSwSw",
	fan: "6CbCbRbRbCbCb:6CwCwCwCwCwCw:6WbWbWbWbWbWb",
	monster: "6Sg--------Sg:6CgCgCgCgCgCg:6--CyCyCyCy--",
	bouquet: "6CpCpRpCpCp--:6SwSwSwSwSwSw",
	logo: "6RwCuCw--CwCu:6------Ru----",
	target: "6CrCwCrCwCrCw:6CwCrCwCrCwCr:6CrCwCrCwCrCw:6CwCrCwCrCwCr",
	speedometer: "6CgCb----CrCy:6CwCw----CwCw:6Sc----------:6CyCy----CyCy",
	spikedBall: "6CcSyCcSyCcSy:6SyCcSyCcSyCc:6CcSyCcSyCcSy:6SyCcSyCcSyCc",
	compass: "6CcRcRcCcRcRc:6RwCwCwRwCwCw:6----Sr----Sb:6CyCyCyCyCyCy",
	plant: "6Rg--Rg--Rg--:6CwRwCwRwCwRw:6--Rg--Rg--Rg",
	rocket: "6CbCuCbCuCbCu:6Sr----------:6--CrCrSrCrCr:6CwCwCwCwCwCw",

	mill: "6CwCwCwCwCwCw:6WbWbWbWbWbWb",
	star: "6SuSuSuSuSuSu",
	circleStar: "6CwCrCwCrCwCr:6SgSgSgSgSgSg",
	clown: "6WrRgWrRgWrRg:6CwCrCwCrCwCr:6SgSgSgSgSgSg",
	windmillRed: "6WrWrWrWrWrWr",
	fanTriple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp",
	fanQuadruple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp:6CwCwCwCwCwCw",

	bird: "6Sr----------:6--CgCg--CgCg:6Sb----Sb----:6--CwCw--CwCw",
	scissors: "6Sr----------:6--CgCgCgCgCg:6----Sb------:6CwCw--CwCwCw",
}

// Tiers need % of the previous tier as requirement too
const tierGrowth = 2.5;

/**
 * Generates all upgrades
 * @returns {Object<string, import("../game_mode").UpgradeTiers>} */
function generateUpgrades(limitedVersion = false) {
	//                         1 2  3  4  6  8
	const fixedImprovementsT1 = [1, 1, 1, 2, 2];
	//                         6 7  8  9  10 12
	const fixedImprovementsT2 = [1, 1, 1, 1, 2];
	const maxSpeed = 30;

	const fixedImprovements = fixedImprovementsT1.concat(fixedImprovementsT2);

	while (fixedImprovements.reduce((v, e) => v + 1, 1) < maxSpeed) {
		fixedImprovements.push(0.5)
	}

	const numEndgameUpgrades = limitedVersion ? 0 : 1000 - fixedImprovements.length - 1;

	const upgrades: Record<string, {
		improvement?: number;
		excludePrevious?: boolean;
		required: {
			shape: string;
			amount: number;
		}[];
	}[]> = {
		belt: [
			{ required: [{ shape: namedShapes.circle, amount: 30 }], },
			{ required: [{ shape: namedShapes.circleHalfRotated, amount: 500 }], },
			{ required: [{ shape: namedShapes.circlePurple, amount: 1000 }], },
			{ required: [{ shape: namedShapes.starCircle, amount: 6000 }], },
			{ required: [{ shape: namedShapes.starCircleStar, amount: 25000 }], },
		],
		miner: [
			{ required: [{ shape: namedShapes.rect, amount: 300 }], },
			{ required: [{ shape: namedShapes.circleQuad, amount: 800 }], },
			{ required: [{ shape: namedShapes.starCyan, amount: 3500 }], },
			{ required: [{ shape: namedShapes.mill, amount: 23000 }], },
			{ required: [{ shape: namedShapes.fan, amount: 50000 }], },
		],
		processors: [
			{ required: [{ shape: namedShapes.star, amount: 500 }], },
			{ required: [{ shape: namedShapes.rectHalf, amount: 600 }], },
			{ required: [{ shape: namedShapes.fish, amount: 3500 }], },
			{ required: [{ shape: namedShapes.circleStar, amount: 25000 }], },
			{ required: [{ shape: namedShapes.clown, amount: 50000 }], },
		],
		painting: [
			{ required: [{ shape: namedShapes.rectHalfBlue, amount: 600 }], },
			{ required: [{ shape: namedShapes.windmillRed, amount: 3800 }], },
			{ required: [{ shape: namedShapes.rectCircle, amount: 6500 }], },
			{ required: [{ shape: namedShapes.fanTriple, amount: 25000 }], },
			{ required: [{ shape: namedShapes.fanQuadruple, amount: 50000 }], },
		],
	};

	// Automatically generate tier levels
	for (const upgradeId in upgrades) {
		const upgradeTiers = upgrades[upgradeId];

		let currentTierRequirements = [];
		for (let i = 0; i < upgradeTiers.length; ++i) {
			const tierHandle = upgradeTiers[i];
			tierHandle.improvement = fixedImprovements[i];
			const originalRequired = tierHandle.required.slice();

			for (let k = currentTierRequirements.length - 1; k >= 0; --k) {
				const oldTierRequirement = currentTierRequirements[k];
				if (!tierHandle.excludePrevious) {
					tierHandle.required.unshift({
						shape: oldTierRequirement.shape,
						amount: oldTierRequirement.amount,
					});
				}
			}
			currentTierRequirements.push(
				...originalRequired.map(req => ({
					amount: req.amount,
					shape: req.shape,
				}))
			);
			currentTierRequirements.forEach(tier => {
				tier.amount = findNiceIntegerValue(tier.amount * tierGrowth);
			});
		}
	}

	upgrades.global = [];
	const globalShapes = [
		namedShapes.bouquet,
		namedShapes.logo,
		namedShapes.rocket,
		namedShapes.bird,
		namedShapes.scissors,
	];
	for (let i = 0; i < 8; i++) {
		let upgrade: typeof upgrades.global[0] = {
			required: [],
			improvement: 1 / 16,
		};
		for (let j = 0; j <= i && j < globalShapes.length; j++) {
			upgrade.required.push({
				shape: globalShapes[j],
				amount: 1000 * (5 + i) * (5 + j),
			});
		}
		upgrades.global.push(upgrade);
	}
	return upgrades;
}

/**
 * Generates the level definitions
 * @param {boolean} limitedVersion
 */
export function generateLevelDefinitions(limitedVersion = false) {
	const levelDefinitions = [
		// 1: Circle
		{
			shape: namedShapes.circle, // belts t1
			required: 30,
			reward: enumHubGoalRewards.reward_cutter_and_trash,
		},
		// 2: Cutter
		{
			shape: namedShapes.circleHalf, //
			required: 40,
			reward: enumHubGoalRewards.no_reward,
		},
		// 3: Rectangle
		{
			shape: namedShapes.rect, // miners t1
			required: 70,
			reward: enumHubGoalRewards.reward_balancer,
		},
		// 4
		{
			shape: namedShapes.rectHalf, // processors t2
			required: 70,
			reward: enumHubGoalRewards.reward_rotater,
		},
		// 5: Rotater
		{
			shape: namedShapes.circleHalfRotated, // belts t2
			required: 170,
			reward: enumHubGoalRewards.reward_tunnel,
		},
		// 6
		{
			shape: namedShapes.circleQuad, // miners t2
			required: 270,
			reward: enumHubGoalRewards.reward_painter,
		},
		// 7: Painter
		{
			shape: namedShapes.circleRed, // unused
			required: 300,
			reward: enumHubGoalRewards.reward_rotater_ccw,
		},
		// 8:
		{
			shape: namedShapes.rectHalfBlue, // painter t2
			required: 480,
			reward: enumHubGoalRewards.reward_mixer,
		},
		// 9: Mixing (purple)
		{
			shape: namedShapes.circlePurple, // belts t3
			required: 600,
			reward: enumHubGoalRewards.reward_merger,
		},
		// 10: STACKER: Star shape + cyan
		{
			shape: namedShapes.starCyan, // miners t3
			required: 800,
			reward: enumHubGoalRewards.reward_stacker,
		},
		// 11: Chainable miner
		{
			shape: namedShapes.fish, // processors t3
			required: 1000,
			reward: enumHubGoalRewards.reward_miner_chainable,
		},
		// 12: Blueprints
		{
			shape: namedShapes.blueprint,
			required: 1000,
			reward: enumHubGoalRewards.reward_blueprints,
		},
		// 13: Tunnel Tier 2
		{
			shape: namedShapes.rectCircle, // painting t3
			required: 3800,
			reward: enumHubGoalRewards.reward_underground_belt_tier_2,
		},
		// 14: Belt reader
		{
			shape: namedShapes.watermelon, // unused
			required: 8, // Per second!
			reward: enumHubGoalRewards.reward_belt_reader,
			throughputOnly: true,
		},
		// 15: Storage
		{
			shape: namedShapes.starCircle, // unused
			required: 10000,
			reward: enumHubGoalRewards.reward_storage,
		},
		// 16: Quad Cutter
		{
			shape: namedShapes.starCircleStar, // belts t4 (two variants)
			required: 6000,
			reward: enumHubGoalRewards.reward_cutter_quad,
		},
		// 17: Double painter
		{
			shape: namedShapes.fan, // miner t4 (two variants)
			required: 20000,
			reward: enumHubGoalRewards.reward_painter_double,
		},
		// 18: Rotater (180deg)
		{
			shape: namedShapes.monster, // unused
			required: 20000,
			reward: enumHubGoalRewards.reward_rotater_180,
		},
		// 19: Compact splitter
		{
			shape: namedShapes.bouquet,
			required: 25000,
			reward: enumHubGoalRewards.reward_splitter,
		},
		// 20: WIRES
		{
			shape: namedShapes.logo,
			required: 25000,
			reward: enumHubGoalRewards.reward_wires_painter_and_levers,
		},
		// 21: Filter
		{
			shape: namedShapes.target,
			required: 25000,
			reward: enumHubGoalRewards.reward_filter,
		},
		// 22: Constant signal
		{
			shape: namedShapes.speedometer,
			required: 25000,
			reward: enumHubGoalRewards.reward_constant_signal,
		},
		// 23: Display
		{
			shape: namedShapes.spikedBall,
			required: 25000,
			reward: enumHubGoalRewards.reward_display,
		},
		// 24: Logic gates
		{
			shape: namedShapes.compass,
			required: 25000,
			reward: enumHubGoalRewards.reward_logic_gates,
		},
		// 25: Virtual Processing
		{
			shape: namedShapes.plant,
			required: 25000,
			reward: enumHubGoalRewards.reward_virtual_processing,
		},
		// 26: Freeplay
		{
			shape: namedShapes.rocket,
			required: 50000,
			reward: enumHubGoalRewards.reward_freeplay,
		},
	];

	return levelDefinitions;
}

export const hexa_fullVersionUpgrades = generateUpgrades(false);

export const hexa_fullVersionLevels = generateLevelDefinitions(false);

export class HexagonalGameMode extends GameMode {
	adjustZone(w?: number, h?: number): void {
		throw new Error("Method not implemented.");
	}
	constructor(root: GameRoot) {
		super(root);
	}

	getName() {
		return "Hexagonal";
	}

	getUpgrades() {
		return hexa_fullVersionUpgrades;
	}

	getIsFreeplayAvailable() {
		return true;
	}

	getBlueprintShapeKey() {
		return namedShapes.blueprint;
	}

	getLevelDefinitions() {
		return hexa_fullVersionLevels;
	}

	generateFreeplayLevel(level: number) {
		const rng = new RandomNumberGenerator(this.root.map.seed + "/" + level);
		let throughputOnly = level % 10 == 0;
		let required = !throughputOnly ? level * 5 : Math.min(320, level * 0.5);
		//Math.min(50, 80 + (level - 27) * 5);
		return {
			definition: computeFreeplayShape(level, rng),
			required,
			reward: enumHubGoalRewards.no_reward_freeplay,
			throughputOnly,
		};
	}

	static install(mod: Mod) {

		// Modify the goal of the first level to add our goal
		mod.signals.modifyLevelDefinitions.add((
			levels: {
				shape: string;
				required: number;
				reward: string;
				throughputOnly: boolean;
			}[]
		) => {
			Object.assign(levels, hexa_fullVersionLevels);
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
			for (let k in upgrades) {
				upgrades[k] = hexa_fullVersionUpgrades[k];
			}
			// Object.assign(upgrades, hexa_fullVersionUpgrades);
			// Object.assign(globalThis.sz, {x: hexa_fullVersionUpgrades});
		});
	}
}


/**
 * @param {number} level
 * @param {RandomNumberGenerator} rng
*/
function computeFreeplayShape(level: number, rng: RandomNumberGenerator) {
	let layerCount = 1;
	if (level >= 50) layerCount = 2;
	if (level >= 75) layerCount = 3;
	if (level >= 100) layerCount = 4;
	if (rng.next() < 0.2) {
		layerCount && layerCount--;
		if (rng.next() < 0.25) {
			layerCount && layerCount--;
		}
	}
	const allowGray = level > 35;
	const allowHoles = level > 60;
	const allowUnstackable = false;
	const allowText = false;
	const allowNumbers = false;
	const allowNumbersInText = false;
	const allowColoredText = false;
	const allowMultiColoredText = false;
	const allow4Shapes = false;
	const allowEmoji = false;

	let choice = (s: string) => rng.choice(s.split(''));

	const shapes = "RCSW";
	const symmetries = [
		"012210", // half-mirror
		"012321", // half-mirror-diaginal
		"012012", // half-rotate
		"010101", // third-rotate
	];
	const colorWheel = "rygcbp".repeat(3);
	const extraColors = level < 50 ? "w" : "wu";
	const colorWheelGroups = [
		"a012", // near
		"a024", // triple
		"ab03", // opposite
		"0134", // opposite pairs
	];

	const symmetryOffset = +choice('012345');
	const cwOffset = +choice('012345');
	const symmetry = rng.choice(symmetries).repeat(3).slice(symmetryOffset, symmetryOffset + 6);
	const colors = rng.choice(colorWheelGroups)
		.replace(/\d/g, n => colorWheel[+n + cwOffset])
		.replace(/[ab]/g, () => choice(extraColors));

	/** @type {ShapestLayer[]} */
	let layers = [];
	for (let layerIndex = 0; layerIndex <= layerCount; layerIndex++) {
		const quads = Array(6).fill('').map(() => choice(shapes) + choice(colors));
		if (allowHoles) {
			quads[+choice('012345')] = '--';
			if (allowUnstackable) {
				quads[+choice('2345')] = '--';
			}
		}
		// const layer = new Shape6Layer('6' + symmetry.replace(/\d/g, n => quads[+n]), layerIndex);
		// if (!allowUnstackable && layers.length && layer.can_fall_through(layers[layers.length - 1])) {
		// 	layerIndex--;
		// } else {
		// 	layers.push(layer);
		// }
		layers.push('6' + symmetry.replace(/\d/g, n => quads[+n]));
	}

	return new SzShapeItem(SzDefinition.fromShortKey(layers.join(':')));
}

// Object.

// Object.getOwnPropertyDescriptors(HexagonalGameMode.prototype).map(e => {
// 	Object.defineProperty(RegularGameMode, e.)
// })

// Object.setPrototypeOf(HexagonalGameMode.prototype, RegularGameMode.prototype)

// RegularGameMode.prototype =  HexagonalGameMode.prototype;