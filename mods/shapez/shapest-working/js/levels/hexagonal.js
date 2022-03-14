import { RandomNumberGenerator } from "shapez/core/rng";
import { findNiceIntegerValue } from "shapez/core/utils";
import { GameMode } from "shapez/game/game_mode";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { SzDefinition } from "../shapest/definition";
import { SzShapeItem } from "../shapest/item";
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
};
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
        fixedImprovements.push(0.5);
    }
    const numEndgameUpgrades = limitedVersion ? 0 : 1000 - fixedImprovements.length - 1;
    const upgrades = {
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
            currentTierRequirements.push(...originalRequired.map(req => ({
                amount: req.amount,
                shape: req.shape,
            })));
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
        let upgrade = {
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
            shape: namedShapes.circle,
            required: 30,
            reward: enumHubGoalRewards.reward_cutter_and_trash,
        },
        // 2: Cutter
        {
            shape: namedShapes.circleHalf,
            required: 40,
            reward: enumHubGoalRewards.no_reward,
        },
        // 3: Rectangle
        {
            shape: namedShapes.rect,
            required: 70,
            reward: enumHubGoalRewards.reward_balancer,
        },
        // 4
        {
            shape: namedShapes.rectHalf,
            required: 70,
            reward: enumHubGoalRewards.reward_rotater,
        },
        // 5: Rotater
        {
            shape: namedShapes.circleHalfRotated,
            required: 170,
            reward: enumHubGoalRewards.reward_tunnel,
        },
        // 6
        {
            shape: namedShapes.circleQuad,
            required: 270,
            reward: enumHubGoalRewards.reward_painter,
        },
        // 7: Painter
        {
            shape: namedShapes.circleRed,
            required: 300,
            reward: enumHubGoalRewards.reward_rotater_ccw,
        },
        // 8:
        {
            shape: namedShapes.rectHalfBlue,
            required: 480,
            reward: enumHubGoalRewards.reward_mixer,
        },
        // 9: Mixing (purple)
        {
            shape: namedShapes.circlePurple,
            required: 600,
            reward: enumHubGoalRewards.reward_merger,
        },
        // 10: STACKER: Star shape + cyan
        {
            shape: namedShapes.starCyan,
            required: 800,
            reward: enumHubGoalRewards.reward_stacker,
        },
        // 11: Chainable miner
        {
            shape: namedShapes.fish,
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
            shape: namedShapes.rectCircle,
            required: 3800,
            reward: enumHubGoalRewards.reward_underground_belt_tier_2,
        },
        // 14: Belt reader
        {
            shape: namedShapes.watermelon,
            required: 8,
            reward: enumHubGoalRewards.reward_belt_reader,
            throughputOnly: true,
        },
        // 15: Storage
        {
            shape: namedShapes.starCircle,
            required: 10000,
            reward: enumHubGoalRewards.reward_storage,
        },
        // 16: Quad Cutter
        {
            shape: namedShapes.starCircleStar,
            required: 6000,
            reward: enumHubGoalRewards.reward_cutter_quad,
        },
        // 17: Double painter
        {
            shape: namedShapes.fan,
            required: 20000,
            reward: enumHubGoalRewards.reward_painter_double,
        },
        // 18: Rotater (180deg)
        {
            shape: namedShapes.monster,
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
    adjustZone(w, h) {
        throw new Error("Method not implemented.");
    }
    constructor(root) {
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
    generateFreeplayLevel(level) {
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
    static install(mod) {
        // Modify the goal of the first level to add our goal
        mod.signals.modifyLevelDefinitions.add((levels) => {
            Object.assign(levels, hexa_fullVersionLevels);
        });
        mod.signals.modifyUpgrades.add((upgrades) => {
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
function computeFreeplayShape(level, rng) {
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
    return new SzShapeItem(SzDefinition.fromShortKey(layers.join(':')));
}
// Object.
// Object.getOwnPropertyDescriptors(HexagonalGameMode.prototype).map(e => {
// 	Object.defineProperty(RegularGameMode, e.)
// })
// Object.setPrototypeOf(HexagonalGameMode.prototype, RegularGameMode.prototype)
// RegularGameMode.prototype =  HexagonalGameMode.prototype;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4YWdvbmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xldmVscy9oZXhhZ29uYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBR2pELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRWhFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFJOUMsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHO0lBQzFCLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLFVBQVUsRUFBRSxlQUFlO0lBQzNCLElBQUksRUFBRSxlQUFlO0lBQ3JCLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLGlCQUFpQixFQUFFLGVBQWU7SUFDbEMsVUFBVSxFQUFFLGVBQWU7SUFDM0IsU0FBUyxFQUFFLGVBQWU7SUFDMUIsWUFBWSxFQUFFLGVBQWU7SUFDN0IsWUFBWSxFQUFFLGVBQWU7SUFDN0IsUUFBUSxFQUFFLGVBQWU7SUFDekIsSUFBSSxFQUFFLGVBQWU7SUFDckIsU0FBUyxFQUFFLDZCQUE2QjtJQUN4QyxVQUFVLEVBQUUsNkJBQTZCO0lBQ3pDLFVBQVUsRUFBRSw2QkFBNkI7SUFDekMsVUFBVSxFQUFFLDZCQUE2QjtJQUN6QyxjQUFjLEVBQUUsMkNBQTJDO0lBQzNELEdBQUcsRUFBRSwyQ0FBMkM7SUFDaEQsT0FBTyxFQUFFLDJDQUEyQztJQUNwRCxPQUFPLEVBQUUsNkJBQTZCO0lBQ3RDLElBQUksRUFBRSw2QkFBNkI7SUFDbkMsTUFBTSxFQUFFLHlEQUF5RDtJQUNqRSxXQUFXLEVBQUUseURBQXlEO0lB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LEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRztZQUMzRCxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUc7U0FDMUQ7UUFDRCxVQUFVLEVBQUU7WUFDWCxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUc7WUFDekQsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHO1lBQzdELEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRztZQUMxRCxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUc7WUFDakUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHO1NBQzVEO1FBQ0QsUUFBUSxFQUFFO1lBQ1QsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHO1lBQ2pFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRztZQUNqRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUc7WUFDaEUsRUFBRSxRQUFR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UUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDckIsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQzlCO1NBQ0Q7UUFDRCw0RkFBNEY7UUFDNUYsaUdBQWlHO1FBQ2pHLGlCQUFpQjtRQUNqQixXQUFXO1FBQ1gsdUJBQXVCO1FBQ3ZCLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMzRDtJQUVELE9BQU8sSUFBSSxXQUFXLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQsVUFBVTtBQUVWLDJFQUEyRTtBQUMzRSw4Q0FBOEM7QUFDOUMsS0FBSztBQUVMLGdGQUFnRjtBQUVoRiw0REFBNEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSYW5kb21OdW1iZXJHZW5lcmF0b3IgfSBmcm9tIFwic2hhcGV6L2NvcmUvcm5nXCI7XHJcbmltcG9ydCB7IGZpbmROaWNlSW50ZWdlclZhbHVlIH0gZnJvbSBcInNoYXBlei9jb3JlL3V0aWxzXCI7XHJcbmltcG9ydCB7IEdhbWVNb2RlIH0gZnJvbSBcInNoYXBlei9nYW1lL2dhbWVfbW9kZVwiO1xyXG5pbXBvcnQgeyBSZWd1bGFyR2FtZU1vZGUgfSBmcm9tIFwic2hhcGV6L2dhbWUvbW9kZXMvcmVndWxhclwiO1xyXG5pbXBvcnQgeyBHYW1lUm9vdCB9IGZyb20gXCJzaGFwZXovZ2FtZS9yb290XCI7XHJcbmltcG9ydCB7IGVudW1IdWJHb2FsUmV3YXJkcyB9IGZyb20gXCJzaGFwZXovZ2FtZS90dXRvcmlhbF9nb2Fsc1wiO1xyXG5pbXBvcnQgeyBNb2QgfSBmcm9tIFwic2hhcGV6L21vZHMvbW9kXCI7XHJcbmltcG9ydCB7IFN6RGVmaW5pdGlvbiB9IGZyb20gXCIuLi9zaGFwZXN0L2RlZmluaXRpb25cIjtcclxuaW1wb3J0IHsgU3pTaGFwZUl0ZW0gfSBmcm9tIFwiLi4vc2hhcGVzdC9pdGVtXCI7XHJcbmltcG9ydCB7IFN6TGF5ZXIgfSBmcm9tIFwiLi4vc2hhcGVzdC9sYXllclwiO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBuYW1lZFNoYXBlcyA9IHtcclxuXHRjaXJjbGU6IFwiNkN1Q3VDdUN1Q3VDdVwiLFxyXG5cdGNpcmNsZUhhbGY6IFwiNi0tLS0tLUN1Q3VDdVwiLFxyXG5cdHJlY3Q6IFwiNlJ1UnVSdVJ1UnVSdVwiLFxyXG5cdHJlY3RIYWxmOiBcIjZSdVJ1UnUtLS0tLS1cIixcclxuXHRjaXJjbGVIYWxmUm90YXRlZDogXCI2Q3UtLS0tLS1DdUN1XCIsXHJcblx0Y2lyY2xlUXVhZDogXCI2Q3VDdS0tLS0tLS0tXCIsXHJcblx0Y2lyY2xlUmVkOiBcIjZDckNyQ3JDckNyQ3JcIixcclxuXHRyZWN0SGFsZkJsdWU6IFwiNlJiUmJSYi0tLS0tLVwiLFxyXG5cdGNpcmNsZVB1cnBsZTogXCI2Q3BDcENwQ3BDcENwXCIsXHJcblx0c3RhckN5YW46IFwiNlNjU2NTY1NjU2NTY1wiLFxyXG5cdGZpc2g6IFwiNkNnQ2dTY1NjQ2dDZ1wiLFxyXG5cdGJsdWVwcmludDogXCI2Q2JDYkNiQ2JDYlJiOjZDd0N3Q3dDd0N3Q3dcIixcclxuXHRyZWN0Q2lyY2xlOiBcIjZScFJwUnBScFJwUnA6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cdHdhdGVybWVsb246IFwiNi0tQ2dDZy0tLS0tLTo2LS1DckNyLS0tLS0tXCIsXHJcblx0c3RhckNpcmNsZTogXCI2U3JTclNyU3JTclNyOjZDeUN5Q3lDeUN5Q3lcIixcclxuXHRzdGFyQ2lyY2xlU3RhcjogXCI2U3JTclNyU3JTclNyOjZDeUN5Q3lDeUN5Q3k6NlN3U3dTd1N3U3dTd1wiLFxyXG5cdGZhbjogXCI2Q2JDYlJiUmJDYkNiOjZDd0N3Q3dDd0N3Q3c6NldiV2JXYldiV2JXYlwiLFxyXG5cdG1vbnN0ZXI6IFwiNlNnLS0tLS0tLS1TZzo2Q2dDZ0NnQ2dDZ0NnOjYtLUN5Q3lDeUN5LS1cIixcclxuXHRib3VxdWV0OiBcIjZDcENwUnBDcENwLS06NlN3U3dTd1N3U3dTd1wiLFxyXG5cdGxvZ286IFwiNlJ3Q3VDdy0tQ3dDdTo2LS0tLS0tUnUtLS0tXCIsXHJcblx0dGFyZ2V0OiBcIjZDckN3Q3JDd0NyQ3c6NkN3Q3JDd0NyQ3dDcjo2Q3JDd0NyQ3dDckN3OjZDd0NyQ3dDckN3Q3JcIixcclxuXHRzcGVlZG9tZXRlcjogXCI2Q2dDYi0tLS1DckN5OjZDd0N3LS0tLUN3Q3c6NlNjLS0tLS0tLS0tLTo2Q3lDeS0tLS1DeUN5XCIsXHJcblx0c3Bpa2VkQmFsbDogXCI2Q2NTeUNjU3lDY1N5OjZTeUNjU3lDY1N5Q2M6NkNjU3lDY1N5Q2NTeTo2U3lDY1N5Q2NTeUNjXCIsXHJcblx0Y29tcGFzczogXCI2Q2NSY1JjQ2NSY1JjOjZSd0N3Q3dSd0N3Q3c6Ni0tLS1Tci0tLS1TYjo2Q3lDeUN5Q3lDeUN5XCIsXHJcblx0cGxhbnQ6IFwiNlJnLS1SZy0tUmctLTo2Q3dSd0N3UndDd1J3OjYtLVJnLS1SZy0tUmdcIixcclxuXHRyb2NrZXQ6IFwiNkNiQ3VDYkN1Q2JDdTo2U3ItLS0tLS0tLS0tOjYtLUNyQ3JTckNyQ3I6NkN3Q3dDd0N3Q3dDd1wiLFxyXG5cclxuXHRtaWxsOiBcIjZDd0N3Q3dDd0N3Q3c6NldiV2JXYldiV2JXYlwiLFxyXG5cdHN0YXI6IFwiNlN1U3VTdVN1U3VTdVwiLFxyXG5cdGNpcmNsZVN0YXI6IFwiNkN3Q3JDd0NyQ3dDcjo2U2dTZ1NnU2dTZ1NnXCIsXHJcblx0Y2xvd246IFwiNldyUmdXclJnV3JSZzo2Q3dDckN3Q3JDd0NyOjZTZ1NnU2dTZ1NnU2dcIixcclxuXHR3aW5kbWlsbFJlZDogXCI2V3JXcldyV3JXcldyXCIsXHJcblx0ZmFuVHJpcGxlOiBcIjZXcFdwV3BXcFdwV3A6NkN3Q3dDd0N3Q3dDdzo2V3BXcFdwV3BXcFdwXCIsXHJcblx0ZmFuUXVhZHJ1cGxlOiBcIjZXcFdwV3BXcFdwV3A6NkN3Q3dDd0N3Q3dDdzo2V3BXcFdwV3BXcFdwOjZDd0N3Q3dDd0N3Q3dcIixcclxuXHJcblx0YmlyZDogXCI2U3ItLS0tLS0tLS0tOjYtLUNnQ2ctLUNnQ2c6NlNiLS0tLVNiLS0tLTo2LS1Dd0N3LS1Dd0N3XCIsXHJcblx0c2Npc3NvcnM6IFwiNlNyLS0tLS0tLS0tLTo2LS1DZ0NnQ2dDZ0NnOjYtLS0tU2ItLS0tLS06NkN3Q3ctLUN3Q3dDd1wiLFxyXG59XHJcblxyXG4vLyBUaWVycyBuZWVkICUgb2YgdGhlIHByZXZpb3VzIHRpZXIgYXMgcmVxdWlyZW1lbnQgdG9vXHJcbmNvbnN0IHRpZXJHcm93dGggPSAyLjU7XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGFsbCB1cGdyYWRlc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0PHN0cmluZywgaW1wb3J0KFwiLi4vZ2FtZV9tb2RlXCIpLlVwZ3JhZGVUaWVycz59ICovXHJcbmZ1bmN0aW9uIGdlbmVyYXRlVXBncmFkZXMobGltaXRlZFZlcnNpb24gPSBmYWxzZSkge1xyXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgIDEgMiAgMyAgNCAgNiAgOFxyXG5cdGNvbnN0IGZpeGVkSW1wcm92ZW1lbnRzVDEgPSBbMSwgMSwgMSwgMiwgMl07XHJcblx0Ly8gICAgICAgICAgICAgICAgICAgICAgICAgNiA3ICA4ICA5ICAxMCAxMlxyXG5cdGNvbnN0IGZpeGVkSW1wcm92ZW1lbnRzVDIgPSBbMSwgMSwgMSwgMSwgMl07XHJcblx0Y29uc3QgbWF4U3BlZWQgPSAzMDtcclxuXHJcblx0Y29uc3QgZml4ZWRJbXByb3ZlbWVudHMgPSBmaXhlZEltcHJvdmVtZW50c1QxLmNvbmNhdChmaXhlZEltcHJvdmVtZW50c1QyKTtcclxuXHJcblx0d2hpbGUgKGZpeGVkSW1wcm92ZW1lbnRzLnJlZHVjZSgodiwgZSkgPT4gdiArIDEsIDEpIDwgbWF4U3BlZWQpIHtcclxuXHRcdGZpeGVkSW1wcm92ZW1lbnRzLnB1c2goMC41KVxyXG5cdH1cclxuXHJcblx0Y29uc3QgbnVtRW5kZ2FtZVVwZ3JhZGVzID0gbGltaXRlZFZlcnNpb24gPyAwIDogMTAwMCAtIGZpeGVkSW1wcm92ZW1lbnRzLmxlbmd0aCAtIDE7XHJcblxyXG5cdGNvbnN0IHVwZ3JhZGVzOiBSZWNvcmQ8c3RyaW5nLCB7XHJcblx0XHRpbXByb3ZlbWVudD86IG51bWJlcjtcclxuXHRcdGV4Y2x1ZGVQcmV2aW91cz86IGJvb2xlYW47XHJcblx0XHRyZXF1aXJlZDoge1xyXG5cdFx0XHRzaGFwZTogc3RyaW5nO1xyXG5cdFx0XHRhbW91bnQ6IG51bWJlcjtcclxuXHRcdH1bXTtcclxuXHR9W10+ID0ge1xyXG5cdFx0YmVsdDogW1xyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlLCBhbW91bnQ6IDMwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlSGFsZlJvdGF0ZWQsIGFtb3VudDogNTAwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlUHVycGxlLCBhbW91bnQ6IDEwMDAgfV0sIH0sXHJcblx0XHRcdHsgcmVxdWlyZWQ6IFt7IHNoYXBlOiBuYW1lZFNoYXBlcy5zdGFyQ2lyY2xlLCBhbW91bnQ6IDYwMDAgfV0sIH0sXHJcblx0XHRcdHsgcmVxdWlyZWQ6IFt7IHNoYXBlOiBuYW1lZFNoYXBlcy5zdGFyQ2lyY2xlU3RhciwgYW1vdW50OiAyNTAwMCB9XSwgfSxcclxuXHRcdF0sXHJcblx0XHRtaW5lcjogW1xyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMucmVjdCwgYW1vdW50OiAzMDAgfV0sIH0sXHJcblx0XHRcdHsgcmVxdWlyZWQ6IFt7IHNoYXBlOiBuYW1lZFNoYXBlcy5jaXJjbGVRdWFkLCBhbW91bnQ6IDgwMCB9XSwgfSxcclxuXHRcdFx0eyByZXF1aXJlZDogW3sgc2hhcGU6IG5hbWVkU2hhcGVzLnN0YXJDeWFuLCBhbW91bnQ6IDM1MDAgfV0sIH0sXHJcblx0XHRcdHsgcmVxdWlyZWQ6IFt7IHNoYXBlOiBuYW1lZFNoYXBlcy5taWxsLCBhbW91bnQ6IDIzMDAwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMuZmFuLCBhbW91bnQ6IDUwMDAwIH1dLCB9LFxyXG5cdFx0XSxcclxuXHRcdHByb2Nlc3NvcnM6IFtcclxuXHRcdFx0eyByZXF1aXJlZDogW3sgc2hhcGU6IG5hbWVkU2hhcGVzLnN0YXIsIGFtb3VudDogNTAwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMucmVjdEhhbGYsIGFtb3VudDogNjAwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMuZmlzaCwgYW1vdW50OiAzNTAwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlU3RhciwgYW1vdW50OiAyNTAwMCB9XSwgfSxcclxuXHRcdFx0eyByZXF1aXJlZDogW3sgc2hhcGU6IG5hbWVkU2hhcGVzLmNsb3duLCBhbW91bnQ6IDUwMDAwIH1dLCB9LFxyXG5cdFx0XSxcclxuXHRcdHBhaW50aW5nOiBbXHJcblx0XHRcdHsgcmVxdWlyZWQ6IFt7IHNoYXBlOiBuYW1lZFNoYXBlcy5yZWN0SGFsZkJsdWUsIGFtb3VudDogNjAwIH1dLCB9LFxyXG5cdFx0XHR7IHJlcXVpcmVkOiBbeyBzaGFwZTogbmFtZWRTaGFwZXMud2luZG1pbGxSZWQsIGFtb3VudDogMzgwMCB9XSwgfSxcclxuXHRcdFx0eyByZXF1aXJlZDogW3sgc2hhcGU6IG5hbWVkU2hhcGVzLnJlY3RDaXJjbGUsIGFtb3VudDogNjUwMCB9XSwgfSxcclxuXHRcdFx0eyByZXF1aXJlZDogW3sgc2hhcGU6IG5hbWVkU2hhcGVzLmZhblRyaXBsZSwgYW1vdW50OiAyNTAwMCB9XSwgfSxcclxuXHRcdFx0eyByZXF1aXJlZDogW3sgc2hhcGU6IG5hbWVkU2hhcGVzLmZhblF1YWRydXBsZSwgYW1vdW50OiA1MDAwMCB9XSwgfSxcclxuXHRcdF0sXHJcblx0fTtcclxuXHJcblx0Ly8gQXV0b21hdGljYWxseSBnZW5lcmF0ZSB0aWVyIGxldmVsc1xyXG5cdGZvciAoY29uc3QgdXBncmFkZUlkIGluIHVwZ3JhZGVzKSB7XHJcblx0XHRjb25zdCB1cGdyYWRlVGllcnMgPSB1cGdyYWRlc1t1cGdyYWRlSWRdO1xyXG5cclxuXHRcdGxldCBjdXJyZW50VGllclJlcXVpcmVtZW50cyA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1cGdyYWRlVGllcnMubGVuZ3RoOyArK2kpIHtcclxuXHRcdFx0Y29uc3QgdGllckhhbmRsZSA9IHVwZ3JhZGVUaWVyc1tpXTtcclxuXHRcdFx0dGllckhhbmRsZS5pbXByb3ZlbWVudCA9IGZpeGVkSW1wcm92ZW1lbnRzW2ldO1xyXG5cdFx0XHRjb25zdCBvcmlnaW5hbFJlcXVpcmVkID0gdGllckhhbmRsZS5yZXF1aXJlZC5zbGljZSgpO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgayA9IGN1cnJlbnRUaWVyUmVxdWlyZW1lbnRzLmxlbmd0aCAtIDE7IGsgPj0gMDsgLS1rKSB7XHJcblx0XHRcdFx0Y29uc3Qgb2xkVGllclJlcXVpcmVtZW50ID0gY3VycmVudFRpZXJSZXF1aXJlbWVudHNba107XHJcblx0XHRcdFx0aWYgKCF0aWVySGFuZGxlLmV4Y2x1ZGVQcmV2aW91cykge1xyXG5cdFx0XHRcdFx0dGllckhhbmRsZS5yZXF1aXJlZC51bnNoaWZ0KHtcclxuXHRcdFx0XHRcdFx0c2hhcGU6IG9sZFRpZXJSZXF1aXJlbWVudC5zaGFwZSxcclxuXHRcdFx0XHRcdFx0YW1vdW50OiBvbGRUaWVyUmVxdWlyZW1lbnQuYW1vdW50LFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGN1cnJlbnRUaWVyUmVxdWlyZW1lbnRzLnB1c2goXHJcblx0XHRcdFx0Li4ub3JpZ2luYWxSZXF1aXJlZC5tYXAocmVxID0+ICh7XHJcblx0XHRcdFx0XHRhbW91bnQ6IHJlcS5hbW91bnQsXHJcblx0XHRcdFx0XHRzaGFwZTogcmVxLnNoYXBlLFxyXG5cdFx0XHRcdH0pKVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRjdXJyZW50VGllclJlcXVpcmVtZW50cy5mb3JFYWNoKHRpZXIgPT4ge1xyXG5cdFx0XHRcdHRpZXIuYW1vdW50ID0gZmluZE5pY2VJbnRlZ2VyVmFsdWUodGllci5hbW91bnQgKiB0aWVyR3Jvd3RoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR1cGdyYWRlcy5nbG9iYWwgPSBbXTtcclxuXHRjb25zdCBnbG9iYWxTaGFwZXMgPSBbXHJcblx0XHRuYW1lZFNoYXBlcy5ib3VxdWV0LFxyXG5cdFx0bmFtZWRTaGFwZXMubG9nbyxcclxuXHRcdG5hbWVkU2hhcGVzLnJvY2tldCxcclxuXHRcdG5hbWVkU2hhcGVzLmJpcmQsXHJcblx0XHRuYW1lZFNoYXBlcy5zY2lzc29ycyxcclxuXHRdO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcblx0XHRsZXQgdXBncmFkZTogdHlwZW9mIHVwZ3JhZGVzLmdsb2JhbFswXSA9IHtcclxuXHRcdFx0cmVxdWlyZWQ6IFtdLFxyXG5cdFx0XHRpbXByb3ZlbWVudDogMSAvIDE2LFxyXG5cdFx0fTtcclxuXHRcdGZvciAobGV0IGogPSAwOyBqIDw9IGkgJiYgaiA8IGdsb2JhbFNoYXBlcy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHR1cGdyYWRlLnJlcXVpcmVkLnB1c2goe1xyXG5cdFx0XHRcdHNoYXBlOiBnbG9iYWxTaGFwZXNbal0sXHJcblx0XHRcdFx0YW1vdW50OiAxMDAwICogKDUgKyBpKSAqICg1ICsgaiksXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dXBncmFkZXMuZ2xvYmFsLnB1c2godXBncmFkZSk7XHJcblx0fVxyXG5cdHJldHVybiB1cGdyYWRlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyB0aGUgbGV2ZWwgZGVmaW5pdGlvbnNcclxuICogQHBhcmFtIHtib29sZWFufSBsaW1pdGVkVmVyc2lvblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTGV2ZWxEZWZpbml0aW9ucyhsaW1pdGVkVmVyc2lvbiA9IGZhbHNlKSB7XHJcblx0Y29uc3QgbGV2ZWxEZWZpbml0aW9ucyA9IFtcclxuXHRcdC8vIDE6IENpcmNsZVxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlLCAvLyBiZWx0cyB0MVxyXG5cdFx0XHRyZXF1aXJlZDogMzAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9jdXR0ZXJfYW5kX3RyYXNoLFxyXG5cdFx0fSxcclxuXHRcdC8vIDI6IEN1dHRlclxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlSGFsZiwgLy9cclxuXHRcdFx0cmVxdWlyZWQ6IDQwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5ub19yZXdhcmQsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMzogUmVjdGFuZ2xlXHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5yZWN0LCAvLyBtaW5lcnMgdDFcclxuXHRcdFx0cmVxdWlyZWQ6IDcwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfYmFsYW5jZXIsXHJcblx0XHR9LFxyXG5cdFx0Ly8gNFxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMucmVjdEhhbGYsIC8vIHByb2Nlc3NvcnMgdDJcclxuXHRcdFx0cmVxdWlyZWQ6IDcwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfcm90YXRlcixcclxuXHRcdH0sXHJcblx0XHQvLyA1OiBSb3RhdGVyXHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5jaXJjbGVIYWxmUm90YXRlZCwgLy8gYmVsdHMgdDJcclxuXHRcdFx0cmVxdWlyZWQ6IDE3MCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3R1bm5lbCxcclxuXHRcdH0sXHJcblx0XHQvLyA2XHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5jaXJjbGVRdWFkLCAvLyBtaW5lcnMgdDJcclxuXHRcdFx0cmVxdWlyZWQ6IDI3MCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3BhaW50ZXIsXHJcblx0XHR9LFxyXG5cdFx0Ly8gNzogUGFpbnRlclxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlUmVkLCAvLyB1bnVzZWRcclxuXHRcdFx0cmVxdWlyZWQ6IDMwMCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3JvdGF0ZXJfY2N3LFxyXG5cdFx0fSxcclxuXHRcdC8vIDg6XHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5yZWN0SGFsZkJsdWUsIC8vIHBhaW50ZXIgdDJcclxuXHRcdFx0cmVxdWlyZWQ6IDQ4MCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX21peGVyLFxyXG5cdFx0fSxcclxuXHRcdC8vIDk6IE1peGluZyAocHVycGxlKVxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuY2lyY2xlUHVycGxlLCAvLyBiZWx0cyB0M1xyXG5cdFx0XHRyZXF1aXJlZDogNjAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfbWVyZ2VyLFxyXG5cdFx0fSxcclxuXHRcdC8vIDEwOiBTVEFDS0VSOiBTdGFyIHNoYXBlICsgY3lhblxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuc3RhckN5YW4sIC8vIG1pbmVycyB0M1xyXG5cdFx0XHRyZXF1aXJlZDogODAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfc3RhY2tlcixcclxuXHRcdH0sXHJcblx0XHQvLyAxMTogQ2hhaW5hYmxlIG1pbmVyXHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5maXNoLCAvLyBwcm9jZXNzb3JzIHQzXHJcblx0XHRcdHJlcXVpcmVkOiAxMDAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfbWluZXJfY2hhaW5hYmxlLFxyXG5cdFx0fSxcclxuXHRcdC8vIDEyOiBCbHVlcHJpbnRzXHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5ibHVlcHJpbnQsXHJcblx0XHRcdHJlcXVpcmVkOiAxMDAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfYmx1ZXByaW50cyxcclxuXHRcdH0sXHJcblx0XHQvLyAxMzogVHVubmVsIFRpZXIgMlxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMucmVjdENpcmNsZSwgLy8gcGFpbnRpbmcgdDNcclxuXHRcdFx0cmVxdWlyZWQ6IDM4MDAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF91bmRlcmdyb3VuZF9iZWx0X3RpZXJfMixcclxuXHRcdH0sXHJcblx0XHQvLyAxNDogQmVsdCByZWFkZXJcclxuXHRcdHtcclxuXHRcdFx0c2hhcGU6IG5hbWVkU2hhcGVzLndhdGVybWVsb24sIC8vIHVudXNlZFxyXG5cdFx0XHRyZXF1aXJlZDogOCwgLy8gUGVyIHNlY29uZCFcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX2JlbHRfcmVhZGVyLFxyXG5cdFx0XHR0aHJvdWdocHV0T25seTogdHJ1ZSxcclxuXHRcdH0sXHJcblx0XHQvLyAxNTogU3RvcmFnZVxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuc3RhckNpcmNsZSwgLy8gdW51c2VkXHJcblx0XHRcdHJlcXVpcmVkOiAxMDAwMCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3N0b3JhZ2UsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMTY6IFF1YWQgQ3V0dGVyXHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5zdGFyQ2lyY2xlU3RhciwgLy8gYmVsdHMgdDQgKHR3byB2YXJpYW50cylcclxuXHRcdFx0cmVxdWlyZWQ6IDYwMDAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9jdXR0ZXJfcXVhZCxcclxuXHRcdH0sXHJcblx0XHQvLyAxNzogRG91YmxlIHBhaW50ZXJcclxuXHRcdHtcclxuXHRcdFx0c2hhcGU6IG5hbWVkU2hhcGVzLmZhbiwgLy8gbWluZXIgdDQgKHR3byB2YXJpYW50cylcclxuXHRcdFx0cmVxdWlyZWQ6IDIwMDAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfcGFpbnRlcl9kb3VibGUsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMTg6IFJvdGF0ZXIgKDE4MGRlZylcclxuXHRcdHtcclxuXHRcdFx0c2hhcGU6IG5hbWVkU2hhcGVzLm1vbnN0ZXIsIC8vIHVudXNlZFxyXG5cdFx0XHRyZXF1aXJlZDogMjAwMDAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9yb3RhdGVyXzE4MCxcclxuXHRcdH0sXHJcblx0XHQvLyAxOTogQ29tcGFjdCBzcGxpdHRlclxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuYm91cXVldCxcclxuXHRcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfc3BsaXR0ZXIsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMjA6IFdJUkVTXHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5sb2dvLFxyXG5cdFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF93aXJlc19wYWludGVyX2FuZF9sZXZlcnMsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMjE6IEZpbHRlclxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMudGFyZ2V0LFxyXG5cdFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9maWx0ZXIsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMjI6IENvbnN0YW50IHNpZ25hbFxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuc3BlZWRvbWV0ZXIsXHJcblx0XHRcdHJlcXVpcmVkOiAyNTAwMCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX2NvbnN0YW50X3NpZ25hbCxcclxuXHRcdH0sXHJcblx0XHQvLyAyMzogRGlzcGxheVxyXG5cdFx0e1xyXG5cdFx0XHRzaGFwZTogbmFtZWRTaGFwZXMuc3Bpa2VkQmFsbCxcclxuXHRcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZGlzcGxheSxcclxuXHRcdH0sXHJcblx0XHQvLyAyNDogTG9naWMgZ2F0ZXNcclxuXHRcdHtcclxuXHRcdFx0c2hhcGU6IG5hbWVkU2hhcGVzLmNvbXBhc3MsXHJcblx0XHRcdHJlcXVpcmVkOiAyNTAwMCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX2xvZ2ljX2dhdGVzLFxyXG5cdFx0fSxcclxuXHRcdC8vIDI1OiBWaXJ0dWFsIFByb2Nlc3NpbmdcclxuXHRcdHtcclxuXHRcdFx0c2hhcGU6IG5hbWVkU2hhcGVzLnBsYW50LFxyXG5cdFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcblx0XHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF92aXJ0dWFsX3Byb2Nlc3NpbmcsXHJcblx0XHR9LFxyXG5cdFx0Ly8gMjY6IEZyZWVwbGF5XHJcblx0XHR7XHJcblx0XHRcdHNoYXBlOiBuYW1lZFNoYXBlcy5yb2NrZXQsXHJcblx0XHRcdHJlcXVpcmVkOiA1MDAwMCxcclxuXHRcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX2ZyZWVwbGF5LFxyXG5cdFx0fSxcclxuXHRdO1xyXG5cclxuXHRyZXR1cm4gbGV2ZWxEZWZpbml0aW9ucztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGhleGFfZnVsbFZlcnNpb25VcGdyYWRlcyA9IGdlbmVyYXRlVXBncmFkZXMoZmFsc2UpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhleGFfZnVsbFZlcnNpb25MZXZlbHMgPSBnZW5lcmF0ZUxldmVsRGVmaW5pdGlvbnMoZmFsc2UpO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhleGFnb25hbEdhbWVNb2RlIGV4dGVuZHMgR2FtZU1vZGUge1xyXG5cdGFkanVzdFpvbmUodz86IG51bWJlciwgaD86IG51bWJlcik6IHZvaWQge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcblx0fVxyXG5cdGNvbnN0cnVjdG9yKHJvb3Q6IEdhbWVSb290KSB7XHJcblx0XHRzdXBlcihyb290KTtcclxuXHR9XHJcblxyXG5cdGdldE5hbWUoKSB7XHJcblx0XHRyZXR1cm4gXCJIZXhhZ29uYWxcIjtcclxuXHR9XHJcblxyXG5cdGdldFVwZ3JhZGVzKCkge1xyXG5cdFx0cmV0dXJuIGhleGFfZnVsbFZlcnNpb25VcGdyYWRlcztcclxuXHR9XHJcblxyXG5cdGdldElzRnJlZXBsYXlBdmFpbGFibGUoKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdGdldEJsdWVwcmludFNoYXBlS2V5KCkge1xyXG5cdFx0cmV0dXJuIG5hbWVkU2hhcGVzLmJsdWVwcmludDtcclxuXHR9XHJcblxyXG5cdGdldExldmVsRGVmaW5pdGlvbnMoKSB7XHJcblx0XHRyZXR1cm4gaGV4YV9mdWxsVmVyc2lvbkxldmVscztcclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlRnJlZXBsYXlMZXZlbChsZXZlbDogbnVtYmVyKSB7XHJcblx0XHRjb25zdCBybmcgPSBuZXcgUmFuZG9tTnVtYmVyR2VuZXJhdG9yKHRoaXMucm9vdC5tYXAuc2VlZCArIFwiL1wiICsgbGV2ZWwpO1xyXG5cdFx0bGV0IHRocm91Z2hwdXRPbmx5ID0gbGV2ZWwgJSAxMCA9PSAwO1xyXG5cdFx0bGV0IHJlcXVpcmVkID0gIXRocm91Z2hwdXRPbmx5ID8gbGV2ZWwgKiA1IDogTWF0aC5taW4oMzIwLCBsZXZlbCAqIDAuNSk7XHJcblx0XHQvL01hdGgubWluKDUwLCA4MCArIChsZXZlbCAtIDI3KSAqIDUpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGVmaW5pdGlvbjogY29tcHV0ZUZyZWVwbGF5U2hhcGUobGV2ZWwsIHJuZyksXHJcblx0XHRcdHJlcXVpcmVkLFxyXG5cdFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5ub19yZXdhcmRfZnJlZXBsYXksXHJcblx0XHRcdHRocm91Z2hwdXRPbmx5LFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbnN0YWxsKG1vZDogTW9kKSB7XHJcblxyXG5cdFx0Ly8gTW9kaWZ5IHRoZSBnb2FsIG9mIHRoZSBmaXJzdCBsZXZlbCB0byBhZGQgb3VyIGdvYWxcclxuXHRcdG1vZC5zaWduYWxzLm1vZGlmeUxldmVsRGVmaW5pdGlvbnMuYWRkKChcclxuXHRcdFx0bGV2ZWxzOiB7XHJcblx0XHRcdFx0c2hhcGU6IHN0cmluZztcclxuXHRcdFx0XHRyZXF1aXJlZDogbnVtYmVyO1xyXG5cdFx0XHRcdHJld2FyZDogc3RyaW5nO1xyXG5cdFx0XHRcdHRocm91Z2hwdXRPbmx5OiBib29sZWFuO1xyXG5cdFx0XHR9W11cclxuXHRcdCkgPT4ge1xyXG5cdFx0XHRPYmplY3QuYXNzaWduKGxldmVscywgaGV4YV9mdWxsVmVyc2lvbkxldmVscyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRtb2Quc2lnbmFscy5tb2RpZnlVcGdyYWRlcy5hZGQoKFxyXG5cdFx0XHR1cGdyYWRlczogUmVjb3JkPHN0cmluZywge1xyXG5cdFx0XHRcdHJlcXVpcmVkOiB7XHJcblx0XHRcdFx0XHRzaGFwZTogc3RyaW5nO1xyXG5cdFx0XHRcdFx0YW1vdW50OiBudW1iZXI7XHJcblx0XHRcdFx0fVtdO1xyXG5cdFx0XHRcdGV4Y2x1ZGVQcmV2aW91cz86IGJvb2xlYW47XHJcblx0XHRcdH1bXT5cclxuXHRcdCkgPT4ge1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIHVwZ3JhZGVzKSB7XHJcblx0XHRcdFx0dXBncmFkZXNba10gPSBoZXhhX2Z1bGxWZXJzaW9uVXBncmFkZXNba107XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gT2JqZWN0LmFzc2lnbih1cGdyYWRlcywgaGV4YV9mdWxsVmVyc2lvblVwZ3JhZGVzKTtcclxuXHRcdFx0Ly8gT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLnN6LCB7eDogaGV4YV9mdWxsVmVyc2lvblVwZ3JhZGVzfSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcbiAqIEBwYXJhbSB7UmFuZG9tTnVtYmVyR2VuZXJhdG9yfSBybmdcclxuKi9cclxuZnVuY3Rpb24gY29tcHV0ZUZyZWVwbGF5U2hhcGUobGV2ZWw6IG51bWJlciwgcm5nOiBSYW5kb21OdW1iZXJHZW5lcmF0b3IpIHtcclxuXHRsZXQgbGF5ZXJDb3VudCA9IDE7XHJcblx0aWYgKGxldmVsID49IDUwKSBsYXllckNvdW50ID0gMjtcclxuXHRpZiAobGV2ZWwgPj0gNzUpIGxheWVyQ291bnQgPSAzO1xyXG5cdGlmIChsZXZlbCA+PSAxMDApIGxheWVyQ291bnQgPSA0O1xyXG5cdGlmIChybmcubmV4dCgpIDwgMC4yKSB7XHJcblx0XHRsYXllckNvdW50ICYmIGxheWVyQ291bnQtLTtcclxuXHRcdGlmIChybmcubmV4dCgpIDwgMC4yNSkge1xyXG5cdFx0XHRsYXllckNvdW50ICYmIGxheWVyQ291bnQtLTtcclxuXHRcdH1cclxuXHR9XHJcblx0Y29uc3QgYWxsb3dHcmF5ID0gbGV2ZWwgPiAzNTtcclxuXHRjb25zdCBhbGxvd0hvbGVzID0gbGV2ZWwgPiA2MDtcclxuXHRjb25zdCBhbGxvd1Vuc3RhY2thYmxlID0gZmFsc2U7XHJcblx0Y29uc3QgYWxsb3dUZXh0ID0gZmFsc2U7XHJcblx0Y29uc3QgYWxsb3dOdW1iZXJzID0gZmFsc2U7XHJcblx0Y29uc3QgYWxsb3dOdW1iZXJzSW5UZXh0ID0gZmFsc2U7XHJcblx0Y29uc3QgYWxsb3dDb2xvcmVkVGV4dCA9IGZhbHNlO1xyXG5cdGNvbnN0IGFsbG93TXVsdGlDb2xvcmVkVGV4dCA9IGZhbHNlO1xyXG5cdGNvbnN0IGFsbG93NFNoYXBlcyA9IGZhbHNlO1xyXG5cdGNvbnN0IGFsbG93RW1vamkgPSBmYWxzZTtcclxuXHJcblx0bGV0IGNob2ljZSA9IChzOiBzdHJpbmcpID0+IHJuZy5jaG9pY2Uocy5zcGxpdCgnJykpO1xyXG5cclxuXHRjb25zdCBzaGFwZXMgPSBcIlJDU1dcIjtcclxuXHRjb25zdCBzeW1tZXRyaWVzID0gW1xyXG5cdFx0XCIwMTIyMTBcIiwgLy8gaGFsZi1taXJyb3JcclxuXHRcdFwiMDEyMzIxXCIsIC8vIGhhbGYtbWlycm9yLWRpYWdpbmFsXHJcblx0XHRcIjAxMjAxMlwiLCAvLyBoYWxmLXJvdGF0ZVxyXG5cdFx0XCIwMTAxMDFcIiwgLy8gdGhpcmQtcm90YXRlXHJcblx0XTtcclxuXHRjb25zdCBjb2xvcldoZWVsID0gXCJyeWdjYnBcIi5yZXBlYXQoMyk7XHJcblx0Y29uc3QgZXh0cmFDb2xvcnMgPSBsZXZlbCA8IDUwID8gXCJ3XCIgOiBcInd1XCI7XHJcblx0Y29uc3QgY29sb3JXaGVlbEdyb3VwcyA9IFtcclxuXHRcdFwiYTAxMlwiLCAvLyBuZWFyXHJcblx0XHRcImEwMjRcIiwgLy8gdHJpcGxlXHJcblx0XHRcImFiMDNcIiwgLy8gb3Bwb3NpdGVcclxuXHRcdFwiMDEzNFwiLCAvLyBvcHBvc2l0ZSBwYWlyc1xyXG5cdF07XHJcblxyXG5cdGNvbnN0IHN5bW1ldHJ5T2Zmc2V0ID0gK2Nob2ljZSgnMDEyMzQ1Jyk7XHJcblx0Y29uc3QgY3dPZmZzZXQgPSArY2hvaWNlKCcwMTIzNDUnKTtcclxuXHRjb25zdCBzeW1tZXRyeSA9IHJuZy5jaG9pY2Uoc3ltbWV0cmllcykucmVwZWF0KDMpLnNsaWNlKHN5bW1ldHJ5T2Zmc2V0LCBzeW1tZXRyeU9mZnNldCArIDYpO1xyXG5cdGNvbnN0IGNvbG9ycyA9IHJuZy5jaG9pY2UoY29sb3JXaGVlbEdyb3VwcylcclxuXHRcdC5yZXBsYWNlKC9cXGQvZywgbiA9PiBjb2xvcldoZWVsWytuICsgY3dPZmZzZXRdKVxyXG5cdFx0LnJlcGxhY2UoL1thYl0vZywgKCkgPT4gY2hvaWNlKGV4dHJhQ29sb3JzKSk7XHJcblxyXG5cdC8qKiBAdHlwZSB7U2hhcGVzdExheWVyW119ICovXHJcblx0bGV0IGxheWVycyA9IFtdO1xyXG5cdGZvciAobGV0IGxheWVySW5kZXggPSAwOyBsYXllckluZGV4IDw9IGxheWVyQ291bnQ7IGxheWVySW5kZXgrKykge1xyXG5cdFx0Y29uc3QgcXVhZHMgPSBBcnJheSg2KS5maWxsKCcnKS5tYXAoKCkgPT4gY2hvaWNlKHNoYXBlcykgKyBjaG9pY2UoY29sb3JzKSk7XHJcblx0XHRpZiAoYWxsb3dIb2xlcykge1xyXG5cdFx0XHRxdWFkc1srY2hvaWNlKCcwMTIzNDUnKV0gPSAnLS0nO1xyXG5cdFx0XHRpZiAoYWxsb3dVbnN0YWNrYWJsZSkge1xyXG5cdFx0XHRcdHF1YWRzWytjaG9pY2UoJzIzNDUnKV0gPSAnLS0nO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjb25zdCBsYXllciA9IG5ldyBTaGFwZTZMYXllcignNicgKyBzeW1tZXRyeS5yZXBsYWNlKC9cXGQvZywgbiA9PiBxdWFkc1srbl0pLCBsYXllckluZGV4KTtcclxuXHRcdC8vIGlmICghYWxsb3dVbnN0YWNrYWJsZSAmJiBsYXllcnMubGVuZ3RoICYmIGxheWVyLmNhbl9mYWxsX3Rocm91Z2gobGF5ZXJzW2xheWVycy5sZW5ndGggLSAxXSkpIHtcclxuXHRcdC8vIFx0bGF5ZXJJbmRleC0tO1xyXG5cdFx0Ly8gfSBlbHNlIHtcclxuXHRcdC8vIFx0bGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0bGF5ZXJzLnB1c2goJzYnICsgc3ltbWV0cnkucmVwbGFjZSgvXFxkL2csIG4gPT4gcXVhZHNbK25dKSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbmV3IFN6U2hhcGVJdGVtKFN6RGVmaW5pdGlvbi5mcm9tU2hvcnRLZXkobGF5ZXJzLmpvaW4oJzonKSkpO1xyXG59XHJcblxyXG4vLyBPYmplY3QuXHJcblxyXG4vLyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhIZXhhZ29uYWxHYW1lTW9kZS5wcm90b3R5cGUpLm1hcChlID0+IHtcclxuLy8gXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVndWxhckdhbWVNb2RlLCBlLilcclxuLy8gfSlcclxuXHJcbi8vIE9iamVjdC5zZXRQcm90b3R5cGVPZihIZXhhZ29uYWxHYW1lTW9kZS5wcm90b3R5cGUsIFJlZ3VsYXJHYW1lTW9kZS5wcm90b3R5cGUpXHJcblxyXG4vLyBSZWd1bGFyR2FtZU1vZGUucHJvdG90eXBlID0gIEhleGFnb25hbEdhbWVNb2RlLnByb3RvdHlwZTsiXX0=