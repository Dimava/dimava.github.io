import { ExtendSuperclass } from "../common.js";
import { SzDefinition } from "../shapest/definition.js";
import { SzInfo } from "../shapest/layer.js";
import { GameMode, HubGoals, RandomNumberGenerator, T } from "../types/shapez.js";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvbGV2ZWxzL2xldmVscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QyxPQUFPLEVBQXNCLFFBQVEsRUFBRSxRQUFRLEVBQU8scUJBQXFCLEVBQUUsQ0FBQyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFJM0csTUFBTSxPQUFPLE9BQU87SUFDbkIsS0FBSyxDQUFTO0lBQ2QsU0FBUyxDQUFrQztJQUMzQyxLQUFLLENBQWU7SUFDcEIsUUFBUSxDQUFTO0lBQ2pCLE1BQU0sQ0FBcUI7SUFDM0IsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUN2QixZQUFZLEtBQWEsRUFBRSxRQUFnQixFQUFFLEtBQW9ELEVBQUUsTUFBMEI7UUFDNUgsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxLQUFLLENBQUMsS0FBdUMsQ0FBQyxFQUFFO1lBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBdUMsQ0FBQztZQUN6RCxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQXVDLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBcUIsQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBRUQsTUFBTSxDQUFDLHNCQUFzQixDQUFDLE1BSzNCO1FBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0s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VCxjQUFjO0FBQ2QsS0FBSztBQUNMLHVCQUF1QjtBQUN2Qiw2Q0FBNkM7QUFDN0MscUNBQXFDO0FBQ3JDLHFCQUFxQjtBQUNyQiwrQ0FBK0M7QUFDL0MsTUFBTTtBQUVOLHFCQUFxQjtBQUNyQixLQUFLO0FBQ0wsdUJBQXVCO0FBQ3ZCLDZDQUE2QztBQUM3Qyw4Q0FBOEM7QUFDOUMscUJBQXFCO0FBQ3JCLG1EQUFtRDtBQUNuRCxNQUFNO0FBRU4sNEJBQTRCO0FBQzVCLEtBQUs7QUFDTCx5Q0FBeUM7QUFDekMscUJBQXFCO0FBQ3JCLDBEQUEwRDtBQUMxRCxNQUFNO0FBRU4sa0JBQWtCO0FBQ2xCLEtBQUs7QUFDTCxrREFBa0Q7QUFDbEQscUJBQXFCO0FBQ3JCLGdEQUFnRDtBQUNoRCxNQUFNO0FBQ04sTUFBTTtBQUNOLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHRlbmRTdXBlcmNsYXNzIH0gZnJvbSBcIi4uL2NvbW1vbi5qc1wiO1xyXG5pbXBvcnQgeyBTekRlZmluaXRpb24gfSBmcm9tIFwiLi4vc2hhcGVzdC9kZWZpbml0aW9uLmpzXCI7XHJcbmltcG9ydCB7IFN6SW5mbyB9IGZyb20gXCIuLi9zaGFwZXN0L2xheWVyLmpzXCI7XHJcbmltcG9ydCB7IHN6U2hhcGVIYXNoNiB9IGZyb20gXCIuLi9zaGFwZXN0L1N6Q29udGV4dDJELmpzXCI7XHJcbmltcG9ydCB7IGVudW1IdWJHb2FsUmV3YXJkcywgR2FtZU1vZGUsIEh1YkdvYWxzLCBNb2QsIFJhbmRvbU51bWJlckdlbmVyYXRvciwgVCB9IGZyb20gXCIuLi90eXBlcy9zaGFwZXouanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN6TGV2ZWwge1xyXG5cdGluZGV4OiBudW1iZXI7XHJcblx0c2hhcGVOYW1lPzoga2V5b2YgdHlwZW9mIFN6SW5mby5xdWFkLm5hbWVkO1xyXG5cdHNoYXBlOiBzelNoYXBlSGFzaDY7XHJcblx0cmVxdWlyZWQ6IG51bWJlcjtcclxuXHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcztcclxuXHR0aHJvdWdocHV0T25seSA9IGZhbHNlO1xyXG5cdGNvbnN0cnVjdG9yKGluZGV4OiBudW1iZXIsIHJlcXVpcmVkOiBudW1iZXIsIHNoYXBlOiBzelNoYXBlSGFzaDYgfCBrZXlvZiB0eXBlb2YgU3pJbmZvLnF1YWQubmFtZWQsIHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzKSB7XHJcblx0XHR0aGlzLmluZGV4ID0gaW5kZXg7XHJcblx0XHRpZiAobmFtZWRbc2hhcGUgYXMga2V5b2YgdHlwZW9mIFN6SW5mby5xdWFkLm5hbWVkXSkge1xyXG5cdFx0XHR0aGlzLnNoYXBlTmFtZSA9IHNoYXBlIGFzIGtleW9mIHR5cGVvZiBTekluZm8ucXVhZC5uYW1lZDtcclxuXHRcdFx0c2hhcGUgPSBuYW1lZFtzaGFwZSBhcyBrZXlvZiB0eXBlb2YgU3pJbmZvLnF1YWQubmFtZWRdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zaGFwZSA9IHNoYXBlIGFzIHN6U2hhcGVIYXNoNjtcclxuXHRcdHRoaXMucmVxdWlyZWQgPSByZXF1aXJlZDtcclxuXHRcdHRoaXMucmV3YXJkID0gcmV3YXJkO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1vZGlmeUxldmVsRGVmaW5pdGlvbnMobGV2ZWxzOiB7XHJcblx0XHRzaGFwZTogc3RyaW5nO1xyXG5cdFx0cmVxdWlyZWQ6IG51bWJlcjtcclxuXHRcdHJld2FyZDogc3RyaW5nO1xyXG5cdFx0dGhyb3VnaHB1dE9ubHk6IGJvb2xlYW47XHJcblx0fVtdKSB7XHJcblx0XHRPYmplY3QuYXNzaWduKGxldmVscywgbGV2ZWxEZWZpbml0aW9ucyk7XHJcblx0XHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgbGV2ZWxzIH0pO1xyXG5cclxuXHRcdGxldmVscy5tYXAoZCA9PiB7XHJcblx0XHRcdGlmIChuYW1lZFtkLnNoYXBlIGFzIGtleW9mIHR5cGVvZiBTekluZm8ucXVhZC5uYW1lZF0pIHtcclxuXHRcdFx0XHRkLnNoYXBlID0gbmFtZWRbZC5zaGFwZSBhcyBrZXlvZiB0eXBlb2YgU3pJbmZvLnF1YWQubmFtZWRdO1xyXG5cdFx0XHR9XHJcblx0XHRcdGQuc2hhcGUgPSBTekRlZmluaXRpb24uZ2V0SGFzaGZyb21SYXdIYXNoKGQuc2hhcGUpO1xyXG5cdFx0XHRkLnJlcXVpcmVkID0gfn4oZC5yZXF1aXJlZCAvIDMpO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0c3RhdGljIG1vZGlmeVVwZ3JhZGVzKFxyXG5cdFx0dXBncmFkZXM6IFJlY29yZDxzdHJpbmcsIHtcclxuXHRcdFx0cmVxdWlyZWQ6IHtcclxuXHRcdFx0XHRzaGFwZTogc3RyaW5nO1xyXG5cdFx0XHRcdGFtb3VudDogbnVtYmVyO1xyXG5cdFx0XHR9W107XHJcblx0XHRcdGV4Y2x1ZGVQcmV2aW91cz86IGJvb2xlYW47XHJcblx0XHR9W10+KSB7XHJcblxyXG5cdFx0T2JqZWN0LnZhbHVlcyh1cGdyYWRlcykuZmxhdCgpLmZsYXRNYXAoZSA9PiBlLnJlcXVpcmVkKVxyXG5cdFx0XHQubWFwKGUgPT4ge1xyXG5cdFx0XHRcdGUuc2hhcGUgPSBTekRlZmluaXRpb24uZ2V0SGFzaGZyb21SYXdIYXNoKGUuc2hhcGUpO1xyXG5cdFx0XHRcdGlmIChuYW1lZFtlLnNoYXBlIGFzIGtleW9mIHR5cGVvZiBuYW1lZF0pIGUuc2hhcGUgPSBuYW1lZFtlLnNoYXBlIGFzIGtleW9mIHR5cGVvZiBuYW1lZF07XHJcblx0XHRcdFx0ZS5hbW91bnQgPSB+fihlLmFtb3VudCAvIDEwKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IHVwZ3JhZGVzIH0pXHJcblxyXG5cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpbnN0YWxsKG1vZDogTW9kKSB7XHJcblxyXG5cdFx0bW9kLnNpZ25hbHMubW9kaWZ5TGV2ZWxEZWZpbml0aW9ucy5hZGQoU3pMZXZlbC5tb2RpZnlMZXZlbERlZmluaXRpb25zKTtcclxuXHRcdG1vZC5zaWduYWxzLm1vZGlmeVVwZ3JhZGVzLmFkZChTekxldmVsLm1vZGlmeVVwZ3JhZGVzKTtcclxuXHJcblx0XHRsZXQgcjogZW51bUh1YkdvYWxSZXdhcmRzID0gJ3Jld2FyZF9wYWludGVyX2RvdWJsZSc7XHJcblx0XHRULnN0b3J5UmV3YXJkc1tyXSA9IHtcclxuXHRcdFx0dGl0bGU6ICdNdWx0aWNvbG9yIHBhaW50ZXInLFxyXG5cdFx0XHRkZXNjOiBgXHJcblx0XHRcdFx0WW91IGhhdmUgdW5sb2NrZWQgPHN0cm9uZz5Eb3VibGUgUGFpbnRlcjwvc3Ryb25nPi48YnI+XHJcblx0XHRcdFx0SXQgY2FuIHVzZSBtb3JlIHRoZW4gYSBzaW5nbGUgcGFpbnQgYXQgb25jZSB0byBwYWludCBzaGFwZXMgaW4gNyBjb21iaW5lZCBjb2xvcnNcclxuXHRcdFx0YCxcclxuXHRcdH0gYXMgYW55O1xyXG5cclxuXHRcdEV4dGVuZFN1cGVyY2xhc3MobW9kLCBHYW1lTW9kZSwgKG9sZCkgPT4ge1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdHJldHVybiBjbGFzcyBIZXhhR2FtZU1vZGUgZXh0ZW5kcyBHYW1lTW9kZSB7XHJcblx0XHRcdFx0Z2V0Qmx1ZXByaW50U2hhcGVLZXkoKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gU3pJbmZvLnF1YWQubmFtZWQ2LmJsdWVwcmludDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0RXh0ZW5kU3VwZXJjbGFzcyhtb2QsIEh1YkdvYWxzLCAob2xkKSA9PiB7XHJcblx0XHRcdHJldHVybiBjbGFzcyBIZXhhR2FtZU1vZGUgZXh0ZW5kcyBIdWJHb2FscyB7XHJcblx0XHRcdFx0Y29tcHV0ZUZyZWVwbGF5U2hhcGUobGV2ZWw6IG51bWJlcikge1xyXG5cdFx0XHRcdFx0Y29uc3Qgcm5nID0gbmV3IFJhbmRvbU51bWJlckdlbmVyYXRvcih0aGlzLnJvb3QubWFwLnNlZWQgKyBcIi9cIiArIGxldmVsKTtcclxuXHRcdFx0XHRcdHJldHVybiBTekxldmVsLmNvbXB1dGVGcmVlcGxheVNoYXBlKGxldmVsLCBybmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblxyXG5cdFx0Ly8gY29uc3QgcmV3YXJkTmFtZSA9IFQuc3RvcnlSZXdhcmRzW3Jld2FyZF0udGl0bGU7XHJcblxyXG5cdFx0Ly8gbGV0IGh0bWwgPSBgXHJcblx0XHQvLyA8ZGl2IGNsYXNzPVwicmV3YXJkTmFtZVwiPlxyXG5cdFx0Ly8gICAgICR7VC5pbmdhbWUubGV2ZWxDb21wbGV0ZU5vdGlmaWNhdGlvbi51bmxvY2tUZXh0LnJlcGxhY2UoXCI8cmV3YXJkPlwiLCByZXdhcmROYW1lKX1cclxuXHRcdC8vIDwvZGl2PlxyXG5cclxuXHRcdC8vIDxkaXYgY2xhc3M9XCJyZXdhcmREZXNjXCI+XHJcblx0XHQvLyAgICAgJHtULnN0b3J5UmV3YXJkc1tyZXdhcmRdLmRlc2N9XHJcblx0XHQvLyA8L2Rpdj5cclxuXHJcblxyXG5cdH1cclxuXHRzdGF0aWMgY29tcHV0ZUZyZWVwbGF5U2hhcGUobGV2ZWw6IG51bWJlciwgcm5nOiBSYW5kb21OdW1iZXJHZW5lcmF0b3IpIHtcclxuXHRcdGxldCBsYXllckNvdW50ID0gMTtcclxuXHRcdGlmIChsZXZlbCA+PSA1MCkgbGF5ZXJDb3VudCA9IDI7XHJcblx0XHRpZiAobGV2ZWwgPj0gNzUpIGxheWVyQ291bnQgPSAzO1xyXG5cdFx0aWYgKGxldmVsID49IDEwMCkgbGF5ZXJDb3VudCA9IDQ7XHJcblx0XHRpZiAocm5nLm5leHQoKSA8IDAuMikge1xyXG5cdFx0XHRsYXllckNvdW50ICYmIGxheWVyQ291bnQtLTtcclxuXHRcdFx0aWYgKHJuZy5uZXh0KCkgPCAwLjI1KSB7XHJcblx0XHRcdFx0bGF5ZXJDb3VudCAmJiBsYXllckNvdW50LS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnN0IGFsbG93R3JheSA9IGxldmVsID4gMzU7XHJcblx0XHRjb25zdCBhbGxvd0hvbGVzID0gbGV2ZWwgPiA2MDtcclxuXHRcdGNvbnN0IGFsbG93VW5zdGFja2FibGUgPSBmYWxzZTtcclxuXHRcdGNvbnN0IGFsbG93VGV4dCA9IGZhbHNlO1xyXG5cdFx0Y29uc3QgYWxsb3dOdW1iZXJzID0gZmFsc2U7XHJcblx0XHRjb25zdCBhbGxvd051bWJlcnNJblRleHQgPSBmYWxzZTtcclxuXHRcdGNvbnN0IGFsbG93Q29sb3JlZFRleHQgPSBmYWxzZTtcclxuXHRcdGNvbnN0IGFsbG93TXVsdGlDb2xvcmVkVGV4dCA9IGZhbHNlO1xyXG5cdFx0Y29uc3QgYWxsb3c0U2hhcGVzID0gZmFsc2U7XHJcblx0XHRjb25zdCBhbGxvd0Vtb2ppID0gZmFsc2U7XHJcblxyXG5cdFx0bGV0IGNob2ljZSA9IChzOiBzdHJpbmcpID0+IHJuZy5jaG9pY2Uocy5zcGxpdCgnJykpO1xyXG5cclxuXHRcdGNvbnN0IHNoYXBlcyA9IFwiUkNTV1wiO1xyXG5cdFx0Y29uc3Qgc3ltbWV0cmllcyA9IFtcclxuXHRcdFx0XCIwMTIyMTBcIiwgLy8gaGFsZi1taXJyb3JcclxuXHRcdFx0XCIwMTIzMjFcIiwgLy8gaGFsZi1taXJyb3ItZGlhZ2luYWxcclxuXHRcdFx0XCIwMTIwMTJcIiwgLy8gaGFsZi1yb3RhdGVcclxuXHRcdFx0XCIwMTAxMDFcIiwgLy8gdGhpcmQtcm90YXRlXHJcblx0XHRdO1xyXG5cdFx0Y29uc3QgY29sb3JXaGVlbCA9IFwicnlnY2JwXCIucmVwZWF0KDMpO1xyXG5cdFx0Y29uc3QgZXh0cmFDb2xvcnMgPSBsZXZlbCA8IDUwID8gXCJ3XCIgOiBcInd1XCI7XHJcblx0XHRjb25zdCBjb2xvcldoZWVsR3JvdXBzID0gW1xyXG5cdFx0XHRcImEwMTJcIiwgLy8gbmVhclxyXG5cdFx0XHRcImEwMjRcIiwgLy8gdHJpcGxlXHJcblx0XHRcdFwiYWIwM1wiLCAvLyBvcHBvc2l0ZVxyXG5cdFx0XHRcIjAxMzRcIiwgLy8gb3Bwb3NpdGUgcGFpcnNcclxuXHRcdF07XHJcblxyXG5cdFx0Y29uc3Qgc3ltbWV0cnlPZmZzZXQgPSArY2hvaWNlKCcwMTIzNDUnKTtcclxuXHRcdGNvbnN0IGN3T2Zmc2V0ID0gK2Nob2ljZSgnMDEyMzQ1Jyk7XHJcblx0XHRjb25zdCBzeW1tZXRyeSA9IHJuZy5jaG9pY2Uoc3ltbWV0cmllcykucmVwZWF0KDMpLnNsaWNlKHN5bW1ldHJ5T2Zmc2V0LCBzeW1tZXRyeU9mZnNldCArIDYpO1xyXG5cdFx0Y29uc3QgY29sb3JzID0gcm5nLmNob2ljZShjb2xvcldoZWVsR3JvdXBzKVxyXG5cdFx0XHQucmVwbGFjZSgvXFxkL2csIG4gPT4gY29sb3JXaGVlbFsrbiArIGN3T2Zmc2V0XSlcclxuXHRcdFx0LnJlcGxhY2UoL1thYl0vZywgKCkgPT4gY2hvaWNlKGV4dHJhQ29sb3JzKSk7XHJcblxyXG5cdFx0LyoqIEB0eXBlIHtTaGFwZXN0TGF5ZXJbXX0gKi9cclxuXHRcdGxldCBsYXllcnMgPSBbXTtcclxuXHRcdGZvciAobGV0IGxheWVySW5kZXggPSAwOyBsYXllckluZGV4IDw9IGxheWVyQ291bnQ7IGxheWVySW5kZXgrKykge1xyXG5cdFx0XHRjb25zdCBxdWFkcyA9IEFycmF5KDYpLmZpbGwoJycpLm1hcCgoKSA9PiBjaG9pY2Uoc2hhcGVzKSArIGNob2ljZShjb2xvcnMpKTtcclxuXHRcdFx0aWYgKGFsbG93SG9sZXMpIHtcclxuXHRcdFx0XHRxdWFkc1srY2hvaWNlKCcwMTIzNDUnKV0gPSAnLS0nO1xyXG5cdFx0XHRcdGlmIChhbGxvd1Vuc3RhY2thYmxlKSB7XHJcblx0XHRcdFx0XHRxdWFkc1srY2hvaWNlKCcyMzQ1JyldID0gJy0tJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc3QgbGF5ZXIgPSBuZXcgU2hhcGU2TGF5ZXIoJzYnICsgc3ltbWV0cnkucmVwbGFjZSgvXFxkL2csIG4gPT4gcXVhZHNbK25dKSwgbGF5ZXJJbmRleCk7XHJcblx0XHRcdC8vIGlmICghYWxsb3dVbnN0YWNrYWJsZSAmJiBsYXllcnMubGVuZ3RoICYmIGxheWVyLmNhbl9mYWxsX3Rocm91Z2gobGF5ZXJzW2xheWVycy5sZW5ndGggLSAxXSkpIHtcclxuXHRcdFx0Ly8gXHRsYXllckluZGV4LS07XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0bGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGxheWVycy5wdXNoKCc2JyArIHN5bW1ldHJ5LnJlcGxhY2UoL1xcZC9nLCBuID0+IHF1YWRzWytuXSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBTekRlZmluaXRpb24uZnJvbVNob3J0S2V5KGxheWVycy5qb2luKCc6JykpO1xyXG5cdH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuY29uc3QgbmFtZWQgPSBTekluZm8ucXVhZC5uYW1lZDtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBsZXZlbERlZmluaXRpb25zID0gW1xyXG5cdC8vIG5ldyBTekxldmVsKDEsIDMwLCAnY2lyY2xlMScsICdyZXdhcmRfY3V0dGVyX2FuZF90cmFzaCcpLFxyXG5cdC8vIG5ldyBTekxldmVsKDIsIDQwLCAnY2lyY2xlSGFsZkxlZnQnLCAnbm9fcmV3YXJkJyksXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMywgNzAsICdzcXVhcmUyJywgJ3Jld2FyZF9iYWxhbmNlcicpLFxyXG5cdC8vIG5ldyBTekxldmVsKDQsIDcwLCAnc3F1YXJlSGFsZlJpZ2h0JywgJ3Jld2FyZF9yb3RhdGVyJyksXHJcblx0Ly8gbmV3IFN6TGV2ZWwoNSwgMTcwLCAnY2lyY2xlSGFsZlRvcDInLCAncmV3YXJkX3R1bm5lbCcpLFxyXG5cdC8vIG5ldyBTekxldmVsKDYsIDI3MCwgJ3NxdWFyZUhhbGZUb3AyJywgJ3Jld2FyZF9wYWludGVyJyksXHJcblx0Ly8gbmV3IFN6TGV2ZWwoNywgMzAwLCAnY2lyY2xlUmVkJywgJ3Jld2FyZF9yb3RhdGVyX2NjdycpLFxyXG5cclxuXHQvLyBuZXcgU3pMZXZlbCg4LCA0ODAsICdzcXVhcmUzVG9wQmx1ZScsICdyZXdhcmRfcGFpbnRlcl9kb3VibGUnKSxcclxuXHJcblx0Ly8gbmV3IFN6TGV2ZWwoOSwgNjAwLCAnc3RhcjNDeWFuJywgJ3Jld2FyZF9ibHVlcHJpbnRzJyksXHJcblxyXG5cdC8vIG5ldyBTekxldmVsKDEwLCA4MDAsICdkaWFtb25kJywgJ3Jld2FyZF9zdGFja2VyJyksXHJcblxyXG5cdC8vIG5ldyBTekxldmVsKDExLCAxMDAwLCAnc3F1aWQnLCAnbm9fcmV3YXJkJyksXHJcblxyXG5cdC8vIG5ldyBTekxldmVsKDEyLCAxMDAwLCAnc3BsaWtlYmFsbDQ4JywgJ25vX3Jld2FyZCcpLFxyXG5cclxuXHJcblxyXG5cdC8vIC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHQvLyBuZXcgU3pMZXZlbCg4LCA0ODAsIFwiUmJSYi0tLS1cIiwgJ3Jld2FyZF9taXhlcicpLFxyXG5cdC8vIC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHQvLyBuZXcgU3pMZXZlbCg5LCA2MDAsIFwiQ3BDcENwQ3BcIiwgJ3Jld2FyZF9tZXJnZXInKSxcclxuXHQvLyAvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMTAsIDgwMCwgXCJTY1NjU2NTY1wiLCAncmV3YXJkX3N0YWNrZXInKSxcclxuXHQvLyAvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMTEsIDEwMDAsIFwiQ2dTY1NjQ2dcIiwgJ3Jld2FyZF9taW5lcl9jaGFpbmFibGUnKSxcclxuXHQvLyAvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMTIsIDEwMDAsIFwiQ2JDYkNiUmI6Q3dDd0N3Q3dcIiwgJ3Jld2FyZF9ibHVlcHJpbnRzJyksXHJcblxyXG5dO1xyXG5cclxuXHJcblxyXG4vLyBcdC8vIFR1bm5lbCBUaWVyIDJcclxuLy8gXHR7XHJcbi8vIFx0XHRzaGFwZTogY2hpbmFTaGFwZXMgPyBcIkN1Q3VDdUN1OkN3Q3dDd0N3OlNiLS1Tci0tXCIgOiBcIlJwUnBScFJwOkN3Q3dDd0N3XCIsIC8vIHBhaW50aW5nIHQzXHJcbi8vIFx0XHRyZXF1aXJlZDogMzgwMCxcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF91bmRlcmdyb3VuZF9iZWx0X3RpZXJfMixcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAxNFxyXG4vLyBcdC8vIEJlbHQgcmVhZGVyXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IFwiLS1DZy0tLS06LS1Dci0tLS1cIiwgLy8gdW51c2VkXHJcbi8vIFx0XHRyZXF1aXJlZDogOCwgLy8gUGVyIHNlY29uZCFcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9iZWx0X3JlYWRlcixcclxuLy8gXHRcdHRocm91Z2hwdXRPbmx5OiB0cnVlLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDE1XHJcbi8vIFx0Ly8gU3RvcmFnZVxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIlNyU3JTclNyOkN5Q3lDeUN5XCIsIC8vIHVudXNlZFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDEwMDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3N0b3JhZ2UsXHJcbi8vIFx0fSxcclxuXHJcbi8vIFx0Ly8gMTZcclxuLy8gXHQvLyBRdWFkIEN1dHRlclxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIlNyU3JTclNyOkN5Q3lDeUN5OlN3U3dTd1N3XCIsIC8vIGJlbHRzIHQ0ICh0d28gdmFyaWFudHMpXHJcbi8vIFx0XHRyZXF1aXJlZDogNjAwMCxcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9jdXR0ZXJfcXVhZCxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAxN1xyXG4vLyBcdC8vIERvdWJsZSBwYWludGVyXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IGNoaW5hU2hhcGVzXHJcbi8vIFx0XHRcdD8gXCJDeUN5Q3lDeTpDeUN5Q3lDeTpSeVJ5UnlSeTpSdVJ1UnVSdVwiXHJcbi8vIFx0XHRcdDogXCJDYlJiUmJDYjpDd0N3Q3dDdzpXYldiV2JXYlwiLCAvLyBtaW5lciB0NCAodHdvIHZhcmlhbnRzKVxyXG4vLyBcdFx0cmVxdWlyZWQ6IDIwMDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3BhaW50ZXJfZG91YmxlLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDE4XHJcbi8vIFx0Ly8gUm90YXRlciAoMTgwZGVnKVxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIlNnLS0tLVNnOkNnQ2dDZ0NnOi0tQ3lDeS0tXCIsIC8vIHVudXNlZFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDIwMDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3JvdGF0ZXJfMTgwLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDE5XHJcbi8vIFx0Ly8gQ29tcGFjdCBzcGxpdHRlclxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIkNwUnBDcC0tOlN3U3dTd1N3XCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfc3BsaXR0ZXIsIC8vIFhcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyMFxyXG4vLyBcdC8vIFdJUkVTXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IGZpbmFsR2FtZVNoYXBlLFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3dpcmVzX3BhaW50ZXJfYW5kX2xldmVycyxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyMVxyXG4vLyBcdC8vIEZpbHRlclxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIkNyQ3dDckN3OkN3Q3JDd0NyOkNyQ3dDckN3OkN3Q3JDd0NyXCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZmlsdGVyLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDIyXHJcbi8vIFx0Ly8gQ29uc3RhbnQgc2lnbmFsXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IGNoaW5hU2hhcGVzXHJcbi8vIFx0XHRcdD8gXCJSclN5U3JTeTpSeUNyQ3dDcjpDeUN5UnlDeVwiXHJcbi8vIFx0XHRcdDogXCJDZy0tLS1DcjpDdy0tLS1DdzpTeS0tLS0tLTpDeS0tLS1DeVwiLFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX2NvbnN0YW50X3NpZ25hbCxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyM1xyXG4vLyBcdC8vIERpc3BsYXlcclxuLy8gXHR7XHJcbi8vIFx0XHRzaGFwZTogY2hpbmFTaGFwZXNcclxuLy8gXHRcdFx0PyBcIkNyQ3JDckNyOkN3Q3dDd0N3Old3V3dXd1d3OkNyQ3JDckNyXCJcclxuLy8gXHRcdFx0OiBcIkNjU3lDY1N5OlN5Q2NTeUNjOkNjU3lDY1N5XCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZGlzcGxheSxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyNCBMb2dpYyBnYXRlc1xyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBjaGluYVNoYXBlc1xyXG4vLyBcdFx0XHQ/IFwiU3UtLS0tU3U6UndSd1J3Unc6Q3UtLS0tQ3U6Q3dDd0N3Q3dcIlxyXG4vLyBcdFx0XHQ6IFwiQ2NSY0NjUmM6UndDd1J3Q3c6U3ItLVN3LS06Q3lDeUN5Q3lcIixcclxuLy8gXHRcdHJlcXVpcmVkOiAyNTAwMCxcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9sb2dpY19nYXRlcyxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyNSBWaXJ0dWFsIFByb2Nlc3NpbmdcclxuLy8gXHR7XHJcbi8vIFx0XHRzaGFwZTogXCJSZy0tUmctLTpDd1J3Q3dSdzotLVJnLS1SZ1wiLFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3ZpcnR1YWxfcHJvY2Vzc2luZyxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyNiBGcmVlcGxheVxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIkNiQ3VDYkN1OlNyLS0tLS0tOi0tQ3JTckNyOkN3Q3dDd0N3XCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogNTAwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZnJlZXBsYXksXHJcbi8vIFx0fSxcclxuLy8gXSksXHJcbi8vIF07Il19