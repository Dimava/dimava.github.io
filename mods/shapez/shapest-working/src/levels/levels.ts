import { SzDefinition } from "../shapest/definition.js";
import { SzInfo } from "../shapest/layer.js";
import { szShapeHash } from "../shapest/SzContext2D.js";
import { enumHubGoalRewards, Mod, T } from "../shapez.js";


export class SzLevel {
	index: number;
	shapeName?: keyof typeof SzInfo.quad.named;
	shape: szShapeHash;
	required: number;
	reward: enumHubGoalRewards;
	throughputOnly = false;
	constructor(index: number, required: number, shape: szShapeHash | keyof typeof SzInfo.quad.named, reward: enumHubGoalRewards) {
		this.index = index;
		if (named[shape as keyof typeof SzInfo.quad.named]) {
			this.shapeName = shape as keyof typeof SzInfo.quad.named;
			shape = named[shape as keyof typeof SzInfo.quad.named];
		}
		this.shape = shape as szShapeHash;
		this.required = required;
		this.reward = reward;
	}

	static modifyLevelDefinitions(levels: {
		shape: string;
		required: number;
		reward: string;
		throughputOnly: boolean;
	}[]) {
		Object.assign(levels, levelDefinitions);

		levels.map(d => {
			d.shape = SzDefinition.getHashfromRawHash(d.shape);
			d.required = ~~(d.required / 3);
		});

	}

	static modifyUpgrades(
		upgrades: Record<string, {
			required: {
				shape: string;
				amount: number;
			}[];
			excludePrevious?: boolean;
		}[]>) {

		const map: Record<string, string> = {
			'sz!l!z|q!C-06,C-6c,C-ci,C-io|a!su0o|c!': 'sz!l!z|q!C-0o|a!su0o|c!',
			'sz!l!z|q!R-06,R-6c,R-ci,R-io|a!su0o|c!': 'sz!l!z|q!R-0c,R-co|a!su0o|c!',
			'sz!l!z|q!S-06,S-6c,S-ci,S-io|a!su0o|c!': 'sz!l!z|q!S-4c,S-ck,S-ks|a!su0o|c!',
		}

		Object.values(upgrades).flat().flatMap(e => e.required)
			.map(e => {
				e.shape = SzDefinition.getHashfromRawHash(e.shape);
				if (map[e.shape]) e.shape = map[e.shape];
				e.amount = ~~(e.amount / 10);
			});

		Object.assign(globalThis, { upgrades })


	}

	static install(mod: Mod) {

		mod.signals.modifyLevelDefinitions.add(SzLevel.modifyLevelDefinitions);
		mod.signals.modifyUpgrades.add(SzLevel.modifyUpgrades);

		let r: enumHubGoalRewards = 'reward_painter_double';
		T.storyRewards[r] = {
			title: 'Multicolor painter',
			desc: `
				You have unlocked <strong>Double Painter</strong>.<br>
				It can use more then a single paint at once to paint shapes in 7 combined colors
			`,
		} as any;

		// const rewardName = T.storyRewards[reward].title;

		// let html = `
		// <div class="rewardName">
		//     ${T.ingame.levelCompleteNotification.unlockText.replace("<reward>", rewardName)}
		// </div>

		// <div class="rewardDesc">
		//     ${T.storyRewards[reward].desc}
		// </div>


	}

}

const named = SzInfo.quad.named;




export const levelDefinitions = [
	new SzLevel(1, 30, 'circle1', 'reward_cutter_and_trash'),
	new SzLevel(2, 40, 'circleHalfLeft', 'no_reward'),
	new SzLevel(3, 70, 'square2', 'reward_balancer'),
	new SzLevel(4, 70, 'squareHalfRight', 'reward_rotater'),
	new SzLevel(5, 170, 'circleHalfTop2', 'reward_tunnel'),
	new SzLevel(6, 270, 'squareHalfTop2', 'reward_painter'),
	new SzLevel(7, 300, 'circleRed', 'reward_rotater_ccw'),

	new SzLevel(8, 480, 'square3TopBlue', 'reward_painter_double'),

	new SzLevel(9, 600, 'star3Cyan', 'reward_blueprints'),

	new SzLevel(10, 800, 'diamond', 'reward_stacker'),

	new SzLevel(11, 1000, 'squid', 'no_reward'),

	// new SzLevel(12, 1000, 'splikeball48', 'no_reward'),



	// // @ts-expect-error
	// new SzLevel(8, 480, "RbRb----", 'reward_mixer'),
	// // @ts-expect-error
	// new SzLevel(9, 600, "CpCpCpCp", 'reward_merger'),
	// // @ts-expect-error
	// new SzLevel(10, 800, "ScScScSc", 'reward_stacker'),
	// // @ts-expect-error
	// new SzLevel(11, 1000, "CgScScCg", 'reward_miner_chainable'),
	// // @ts-expect-error
	// new SzLevel(12, 1000, "CbCbCbRb:CwCwCwCw", 'reward_blueprints'),

];



// 	// Tunnel Tier 2
// 	{
// 		shape: chinaShapes ? "CuCuCuCu:CwCwCwCw:Sb--Sr--" : "RpRpRpRp:CwCwCwCw", // painting t3
// 		required: 3800,
// 		reward: enumHubGoalRewards.reward_underground_belt_tier_2,
// 	},

// 	// 14
// 	// Belt reader
// 	{
// 		shape: "--Cg----:--Cr----", // unused
// 		required: 8, // Per second!
// 		reward: enumHubGoalRewards.reward_belt_reader,
// 		throughputOnly: true,
// 	},

// 	// 15
// 	// Storage
// 	{
// 		shape: "SrSrSrSr:CyCyCyCy", // unused
// 		required: 10000,
// 		reward: enumHubGoalRewards.reward_storage,
// 	},

// 	// 16
// 	// Quad Cutter
// 	{
// 		shape: "SrSrSrSr:CyCyCyCy:SwSwSwSw", // belts t4 (two variants)
// 		required: 6000,
// 		reward: enumHubGoalRewards.reward_cutter_quad,
// 	},

// 	// 17
// 	// Double painter
// 	{
// 		shape: chinaShapes
// 			? "CyCyCyCy:CyCyCyCy:RyRyRyRy:RuRuRuRu"
// 			: "CbRbRbCb:CwCwCwCw:WbWbWbWb", // miner t4 (two variants)
// 		required: 20000,
// 		reward: enumHubGoalRewards.reward_painter_double,
// 	},

// 	// 18
// 	// Rotater (180deg)
// 	{
// 		shape: "Sg----Sg:CgCgCgCg:--CyCy--", // unused
// 		required: 20000,
// 		reward: enumHubGoalRewards.reward_rotater_180,
// 	},

// 	// 19
// 	// Compact splitter
// 	{
// 		shape: "CpRpCp--:SwSwSwSw",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_splitter, // X
// 	},

// 	// 20
// 	// WIRES
// 	{
// 		shape: finalGameShape,
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_wires_painter_and_levers,
// 	},

// 	// 21
// 	// Filter
// 	{
// 		shape: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_filter,
// 	},

// 	// 22
// 	// Constant signal
// 	{
// 		shape: chinaShapes
// 			? "RrSySrSy:RyCrCwCr:CyCyRyCy"
// 			: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_constant_signal,
// 	},

// 	// 23
// 	// Display
// 	{
// 		shape: chinaShapes
// 			? "CrCrCrCr:CwCwCwCw:WwWwWwWw:CrCrCrCr"
// 			: "CcSyCcSy:SyCcSyCc:CcSyCcSy",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_display,
// 	},

// 	// 24 Logic gates
// 	{
// 		shape: chinaShapes
// 			? "Su----Su:RwRwRwRw:Cu----Cu:CwCwCwCw"
// 			: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_logic_gates,
// 	},

// 	// 25 Virtual Processing
// 	{
// 		shape: "Rg--Rg--:CwRwCwRw:--Rg--Rg",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_virtual_processing,
// 	},

// 	// 26 Freeplay
// 	{
// 		shape: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw",
// 		required: 50000,
// 		reward: enumHubGoalRewards.reward_freeplay,
// 	},
// ]),
// ];