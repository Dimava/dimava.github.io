import { RandomNumberGenerator } from "shapez/core/rng";
import { GameMode } from "shapez/game/game_mode";
import { HubGoals } from "shapez/game/hub_goals";
import { T } from "shapez/translations";
import { ExtendSuperclass } from "../common";
import { SzDefinition } from "../shapest/definition";
import { SzInfo } from "../shapest/layer";
export class SzLevel {
    index;
    shapeName;
    shape;
    required;
    reward;
    throughputOnly = false;
    constructor(index, required, shape, reward) {
        this.index = index;
        if (named[shape]) {
            this.shapeName = shape;
            shape = named[shape];
        }
        this.shape = shape;
        this.required = required;
        this.reward = reward;
    }
    static modifyLevelDefinitions(levels) {
        Object.assign(levels, levelDefinitions);
        Object.assign(globalThis, { levels });
        levels.map(d => {
            if (named[d.shape]) {
                d.shape = named[d.shape];
            }
            d.shape = SzDefinition.getHashfromRawHash(d.shape);
            d.required = ~~(d.required / 3);
        });
    }
    static modifyUpgrades(upgrades) {
        Object.values(upgrades).flat().flatMap(e => e.required)
            .map(e => {
            e.shape = SzDefinition.getHashfromRawHash(e.shape);
            if (named[e.shape])
                e.shape = named[e.shape];
            e.amount = ~~(e.amount / 10);
        });
        Object.assign(globalThis, { upgrades });
    }
    static install(mod) {
        mod.signals.modifyLevelDefinitions.add(SzLevel.modifyLevelDefinitions);
        mod.signals.modifyUpgrades.add(SzLevel.modifyUpgrades);
        let r = 'reward_painter_double';
        T.storyRewards[r] = {
            title: 'Multicolor painter',
            desc: `
				You have unlocked <strong>Double Painter</strong>.<br>
				It can use more then a single paint at once to paint shapes in 7 combined colors
			`,
        };
        ExtendSuperclass(mod, GameMode, (old) => {
            // @ts-ignore
            return class HexaGameMode extends GameMode {
                getBlueprintShapeKey() {
                    return SzInfo.quad.named6.blueprint;
                }
            };
        });
        ExtendSuperclass(mod, HubGoals, (old) => {
            return class HexaGameMode extends HubGoals {
                computeFreeplayShape(level) {
                    const rng = new RandomNumberGenerator(this.root.map.seed + "/" + level);
                    return SzLevel.computeFreeplayShape(level, rng);
                }
            };
        });
        // const rewardName = T.storyRewards[reward].title;
        // let html = `
        // <div class="rewardName">
        //     ${T.ingame.levelCompleteNotification.unlockText.replace("<reward>", rewardName)}
        // </div>
        // <div class="rewardDesc">
        //     ${T.storyRewards[reward].desc}
        // </div>
    }
    static computeFreeplayShape(level, rng) {
        let layerCount = 1;
        if (level >= 50)
            layerCount = 2;
        if (level >= 75)
            layerCount = 3;
        if (level >= 100)
            layerCount = 4;
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
        let choice = (s) => rng.choice(s.split(''));
        const shapes = "RCSW";
        const symmetries = [
            "012210",
            "012321",
            "012012",
            "010101", // third-rotate
        ];
        const colorWheel = "rygcbp".repeat(3);
        const extraColors = level < 50 ? "w" : "wu";
        const colorWheelGroups = [
            "a012",
            "a024",
            "ab03",
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
        return SzDefinition.fromShortKey(layers.join(':'));
    }
}
const named = SzInfo.quad.named;
export const levelDefinitions = [
// new SzLevel(1, 30, 'circle1', 'reward_cutter_and_trash'),
// new SzLevel(2, 40, 'circleHalfLeft', 'no_reward'),
// new SzLevel(3, 70, 'square2', 'reward_balancer'),
// new SzLevel(4, 70, 'squareHalfRight', 'reward_rotater'),
// new SzLevel(5, 170, 'circleHalfTop2', 'reward_tunnel'),
// new SzLevel(6, 270, 'squareHalfTop2', 'reward_painter'),
// new SzLevel(7, 300, 'circleRed', 'reward_rotater_ccw'),
// new SzLevel(8, 480, 'square3TopBlue', 'reward_painter_double'),
// new SzLevel(9, 600, 'star3Cyan', 'reward_blueprints'),
// new SzLevel(10, 800, 'diamond', 'reward_stacker'),
// new SzLevel(11, 1000, 'squid', 'no_reward'),
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
