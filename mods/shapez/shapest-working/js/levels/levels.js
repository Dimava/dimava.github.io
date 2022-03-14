import { SzDefinition } from "../shapest/definition.js";
import { SzInfo } from "../shapest/layer.js";
import { T } from "../shapez.js";
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
        levels.map(d => {
            d.shape = SzDefinition.getHashfromRawHash(d.shape);
            d.required = ~~(d.required / 3);
        });
    }
    static modifyUpgrades(upgrades) {
        const map = {
            'sz!l!z|q!C-06,C-6c,C-ci,C-io|a!su0o|c!': 'sz!l!z|q!C-0o|a!su0o|c!',
            'sz!l!z|q!R-06,R-6c,R-ci,R-io|a!su0o|c!': 'sz!l!z|q!R-0c,R-co|a!su0o|c!',
            'sz!l!z|q!S-06,S-6c,S-ci,S-io|a!su0o|c!': 'sz!l!z|q!S-4c,S-ck,S-ks|a!su0o|c!',
        };
        Object.values(upgrades).flat().flatMap(e => e.required)
            .map(e => {
            e.shape = SzDefinition.getHashfromRawHash(e.shape);
            if (map[e.shape])
                e.shape = map[e.shape];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xldmVscy9sZXZlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QyxPQUFPLEVBQTJCLENBQUMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUcxRCxNQUFNLE9BQU8sT0FBTztJQUNuQixLQUFLLENBQVM7SUFDZCxTQUFTLENBQWtDO0lBQzNDLEtBQUssQ0FBYztJQUNuQixRQUFRLENBQVM7SUFDakIsTUFBTSxDQUFxQjtJQUMzQixjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLFlBQVksS0FBYSxFQUFFLFFBQWdCLEVBQUUsS0FBbUQsRUFBRSxNQUEwQjtRQUMzSCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLEtBQUssQ0FBQyxLQUF1QyxDQUFDLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUF1QyxDQUFDO1lBQ3pELEtBQUssR0FBRyxLQUFLLENBQUMsS0FBdUMsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFvQixDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQUMsTUFLM0I7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZCxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsQ0FB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MkJBQTJCO0FBQzNCLHFCQUFxQjtBQUNyQixnRUFBZ0U7QUFDaEUsTUFBTTtBQUVOLFNBQVM7QUFDVCxhQUFhO0FBQ2IsS0FBSztBQUNMLGtEQUFrRDtBQUNsRCxxQkFBcUI7QUFDckIsOENBQThDO0FBQzlDLE1BQU07QUFFTixTQUFTO0FBQ1Qsc0JBQXNCO0FBQ3RCLEtBQUs7QUFDTCx1QkFBdUI7QUFDdkIsb0NBQW9DO0FBQ3BDLDhDQUE4QztBQUM5QyxxQkFBcUI7QUFDckIsdURBQXVEO0FBQ3ZELE1BQU07QUFFTixTQUFTO0FBQ1QsY0FBYztBQUNkLEtBQUs7QUFDTCx1QkFBdUI7QUFDdkIsNkNBQTZDO0FBQzdDLHFDQUFxQztBQUNyQyxxQkFBcUI7QUFDckIsK0NBQStDO0FBQy9DLE1BQU07QUFFTixxQkFBcUI7QUFDckIsS0FBSztBQUNMLHVCQUF1QjtBQUN2Qiw2Q0FBNkM7QUFDN0MsOENBQThDO0FBQzlDLHFCQUFxQjtBQUNyQixtREFBbUQ7QUFDbkQsTUFBTTtBQUVOLDRCQUE0QjtBQUM1QixLQUFLO0FBQ0wseUNBQXlDO0FBQ3pDLHFCQUFxQjtBQUNyQiwwREFBMEQ7QUFDMUQsTUFBTTtBQUVOLGtCQUFrQjtBQUNsQixLQUFLO0FBQ0wsa0RBQWtEO0FBQ2xELHFCQUFxQjtBQUNyQixnREFBZ0Q7QUFDaEQsTUFBTTtBQUNOLE1BQU07QUFDTixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3pEZWZpbml0aW9uIH0gZnJvbSBcIi4uL3NoYXBlc3QvZGVmaW5pdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBTekluZm8gfSBmcm9tIFwiLi4vc2hhcGVzdC9sYXllci5qc1wiO1xyXG5pbXBvcnQgeyBzelNoYXBlSGFzaCB9IGZyb20gXCIuLi9zaGFwZXN0L1N6Q29udGV4dDJELmpzXCI7XHJcbmltcG9ydCB7IGVudW1IdWJHb2FsUmV3YXJkcywgTW9kLCBUIH0gZnJvbSBcIi4uL3NoYXBlei5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxldmVsIHtcclxuXHRpbmRleDogbnVtYmVyO1xyXG5cdHNoYXBlTmFtZT86IGtleW9mIHR5cGVvZiBTekluZm8ucXVhZC5uYW1lZDtcclxuXHRzaGFwZTogc3pTaGFwZUhhc2g7XHJcblx0cmVxdWlyZWQ6IG51bWJlcjtcclxuXHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcztcclxuXHR0aHJvdWdocHV0T25seSA9IGZhbHNlO1xyXG5cdGNvbnN0cnVjdG9yKGluZGV4OiBudW1iZXIsIHJlcXVpcmVkOiBudW1iZXIsIHNoYXBlOiBzelNoYXBlSGFzaCB8IGtleW9mIHR5cGVvZiBTekluZm8ucXVhZC5uYW1lZCwgcmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMpIHtcclxuXHRcdHRoaXMuaW5kZXggPSBpbmRleDtcclxuXHRcdGlmIChuYW1lZFtzaGFwZSBhcyBrZXlvZiB0eXBlb2YgU3pJbmZvLnF1YWQubmFtZWRdKSB7XHJcblx0XHRcdHRoaXMuc2hhcGVOYW1lID0gc2hhcGUgYXMga2V5b2YgdHlwZW9mIFN6SW5mby5xdWFkLm5hbWVkO1xyXG5cdFx0XHRzaGFwZSA9IG5hbWVkW3NoYXBlIGFzIGtleW9mIHR5cGVvZiBTekluZm8ucXVhZC5uYW1lZF07XHJcblx0XHR9XHJcblx0XHR0aGlzLnNoYXBlID0gc2hhcGUgYXMgc3pTaGFwZUhhc2g7XHJcblx0XHR0aGlzLnJlcXVpcmVkID0gcmVxdWlyZWQ7XHJcblx0XHR0aGlzLnJld2FyZCA9IHJld2FyZDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtb2RpZnlMZXZlbERlZmluaXRpb25zKGxldmVsczoge1xyXG5cdFx0c2hhcGU6IHN0cmluZztcclxuXHRcdHJlcXVpcmVkOiBudW1iZXI7XHJcblx0XHRyZXdhcmQ6IHN0cmluZztcclxuXHRcdHRocm91Z2hwdXRPbmx5OiBib29sZWFuO1xyXG5cdH1bXSkge1xyXG5cdFx0T2JqZWN0LmFzc2lnbihsZXZlbHMsIGxldmVsRGVmaW5pdGlvbnMpO1xyXG5cclxuXHRcdGxldmVscy5tYXAoZCA9PiB7XHJcblx0XHRcdGQuc2hhcGUgPSBTekRlZmluaXRpb24uZ2V0SGFzaGZyb21SYXdIYXNoKGQuc2hhcGUpO1xyXG5cdFx0XHRkLnJlcXVpcmVkID0gfn4oZC5yZXF1aXJlZCAvIDMpO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0c3RhdGljIG1vZGlmeVVwZ3JhZGVzKFxyXG5cdFx0dXBncmFkZXM6IFJlY29yZDxzdHJpbmcsIHtcclxuXHRcdFx0cmVxdWlyZWQ6IHtcclxuXHRcdFx0XHRzaGFwZTogc3RyaW5nO1xyXG5cdFx0XHRcdGFtb3VudDogbnVtYmVyO1xyXG5cdFx0XHR9W107XHJcblx0XHRcdGV4Y2x1ZGVQcmV2aW91cz86IGJvb2xlYW47XHJcblx0XHR9W10+KSB7XHJcblxyXG5cdFx0Y29uc3QgbWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xyXG5cdFx0XHQnc3ohbCF6fHEhQy0wNixDLTZjLEMtY2ksQy1pb3xhIXN1MG98YyEnOiAnc3ohbCF6fHEhQy0wb3xhIXN1MG98YyEnLFxyXG5cdFx0XHQnc3ohbCF6fHEhUi0wNixSLTZjLFItY2ksUi1pb3xhIXN1MG98YyEnOiAnc3ohbCF6fHEhUi0wYyxSLWNvfGEhc3Uwb3xjIScsXHJcblx0XHRcdCdzeiFsIXp8cSFTLTA2LFMtNmMsUy1jaSxTLWlvfGEhc3Uwb3xjISc6ICdzeiFsIXp8cSFTLTRjLFMtY2ssUy1rc3xhIXN1MG98YyEnLFxyXG5cdFx0fVxyXG5cclxuXHRcdE9iamVjdC52YWx1ZXModXBncmFkZXMpLmZsYXQoKS5mbGF0TWFwKGUgPT4gZS5yZXF1aXJlZClcclxuXHRcdFx0Lm1hcChlID0+IHtcclxuXHRcdFx0XHRlLnNoYXBlID0gU3pEZWZpbml0aW9uLmdldEhhc2hmcm9tUmF3SGFzaChlLnNoYXBlKTtcclxuXHRcdFx0XHRpZiAobWFwW2Uuc2hhcGVdKSBlLnNoYXBlID0gbWFwW2Uuc2hhcGVdO1xyXG5cdFx0XHRcdGUuYW1vdW50ID0gfn4oZS5hbW91bnQgLyAxMCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgeyB1cGdyYWRlcyB9KVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaW5zdGFsbChtb2Q6IE1vZCkge1xyXG5cclxuXHRcdG1vZC5zaWduYWxzLm1vZGlmeUxldmVsRGVmaW5pdGlvbnMuYWRkKFN6TGV2ZWwubW9kaWZ5TGV2ZWxEZWZpbml0aW9ucyk7XHJcblx0XHRtb2Quc2lnbmFscy5tb2RpZnlVcGdyYWRlcy5hZGQoU3pMZXZlbC5tb2RpZnlVcGdyYWRlcyk7XHJcblxyXG5cdFx0bGV0IHI6IGVudW1IdWJHb2FsUmV3YXJkcyA9ICdyZXdhcmRfcGFpbnRlcl9kb3VibGUnO1xyXG5cdFx0VC5zdG9yeVJld2FyZHNbcl0gPSB7XHJcblx0XHRcdHRpdGxlOiAnTXVsdGljb2xvciBwYWludGVyJyxcclxuXHRcdFx0ZGVzYzogYFxyXG5cdFx0XHRcdFlvdSBoYXZlIHVubG9ja2VkIDxzdHJvbmc+RG91YmxlIFBhaW50ZXI8L3N0cm9uZz4uPGJyPlxyXG5cdFx0XHRcdEl0IGNhbiB1c2UgbW9yZSB0aGVuIGEgc2luZ2xlIHBhaW50IGF0IG9uY2UgdG8gcGFpbnQgc2hhcGVzIGluIDcgY29tYmluZWQgY29sb3JzXHJcblx0XHRcdGAsXHJcblx0XHR9IGFzIGFueTtcclxuXHJcblx0XHQvLyBjb25zdCByZXdhcmROYW1lID0gVC5zdG9yeVJld2FyZHNbcmV3YXJkXS50aXRsZTtcclxuXHJcblx0XHQvLyBsZXQgaHRtbCA9IGBcclxuXHRcdC8vIDxkaXYgY2xhc3M9XCJyZXdhcmROYW1lXCI+XHJcblx0XHQvLyAgICAgJHtULmluZ2FtZS5sZXZlbENvbXBsZXRlTm90aWZpY2F0aW9uLnVubG9ja1RleHQucmVwbGFjZShcIjxyZXdhcmQ+XCIsIHJld2FyZE5hbWUpfVxyXG5cdFx0Ly8gPC9kaXY+XHJcblxyXG5cdFx0Ly8gPGRpdiBjbGFzcz1cInJld2FyZERlc2NcIj5cclxuXHRcdC8vICAgICAke1Quc3RvcnlSZXdhcmRzW3Jld2FyZF0uZGVzY31cclxuXHRcdC8vIDwvZGl2PlxyXG5cclxuXHJcblx0fVxyXG5cclxufVxyXG5cclxuY29uc3QgbmFtZWQgPSBTekluZm8ucXVhZC5uYW1lZDtcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBsZXZlbERlZmluaXRpb25zID0gW1xyXG5cdG5ldyBTekxldmVsKDEsIDMwLCAnY2lyY2xlMScsICdyZXdhcmRfY3V0dGVyX2FuZF90cmFzaCcpLFxyXG5cdG5ldyBTekxldmVsKDIsIDQwLCAnY2lyY2xlSGFsZkxlZnQnLCAnbm9fcmV3YXJkJyksXHJcblx0bmV3IFN6TGV2ZWwoMywgNzAsICdzcXVhcmUyJywgJ3Jld2FyZF9iYWxhbmNlcicpLFxyXG5cdG5ldyBTekxldmVsKDQsIDcwLCAnc3F1YXJlSGFsZlJpZ2h0JywgJ3Jld2FyZF9yb3RhdGVyJyksXHJcblx0bmV3IFN6TGV2ZWwoNSwgMTcwLCAnY2lyY2xlSGFsZlRvcDInLCAncmV3YXJkX3R1bm5lbCcpLFxyXG5cdG5ldyBTekxldmVsKDYsIDI3MCwgJ3NxdWFyZUhhbGZUb3AyJywgJ3Jld2FyZF9wYWludGVyJyksXHJcblx0bmV3IFN6TGV2ZWwoNywgMzAwLCAnY2lyY2xlUmVkJywgJ3Jld2FyZF9yb3RhdGVyX2NjdycpLFxyXG5cclxuXHRuZXcgU3pMZXZlbCg4LCA0ODAsICdzcXVhcmUzVG9wQmx1ZScsICdyZXdhcmRfcGFpbnRlcl9kb3VibGUnKSxcclxuXHJcblx0bmV3IFN6TGV2ZWwoOSwgNjAwLCAnc3RhcjNDeWFuJywgJ3Jld2FyZF9ibHVlcHJpbnRzJyksXHJcblxyXG5cdG5ldyBTekxldmVsKDEwLCA4MDAsICdkaWFtb25kJywgJ3Jld2FyZF9zdGFja2VyJyksXHJcblxyXG5cdG5ldyBTekxldmVsKDExLCAxMDAwLCAnc3F1aWQnLCAnbm9fcmV3YXJkJyksXHJcblxyXG5cdC8vIG5ldyBTekxldmVsKDEyLCAxMDAwLCAnc3BsaWtlYmFsbDQ4JywgJ25vX3Jld2FyZCcpLFxyXG5cclxuXHJcblxyXG5cdC8vIC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHQvLyBuZXcgU3pMZXZlbCg4LCA0ODAsIFwiUmJSYi0tLS1cIiwgJ3Jld2FyZF9taXhlcicpLFxyXG5cdC8vIC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHQvLyBuZXcgU3pMZXZlbCg5LCA2MDAsIFwiQ3BDcENwQ3BcIiwgJ3Jld2FyZF9tZXJnZXInKSxcclxuXHQvLyAvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMTAsIDgwMCwgXCJTY1NjU2NTY1wiLCAncmV3YXJkX3N0YWNrZXInKSxcclxuXHQvLyAvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMTEsIDEwMDAsIFwiQ2dTY1NjQ2dcIiwgJ3Jld2FyZF9taW5lcl9jaGFpbmFibGUnKSxcclxuXHQvLyAvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0Ly8gbmV3IFN6TGV2ZWwoMTIsIDEwMDAsIFwiQ2JDYkNiUmI6Q3dDd0N3Q3dcIiwgJ3Jld2FyZF9ibHVlcHJpbnRzJyksXHJcblxyXG5dO1xyXG5cclxuXHJcblxyXG4vLyBcdC8vIFR1bm5lbCBUaWVyIDJcclxuLy8gXHR7XHJcbi8vIFx0XHRzaGFwZTogY2hpbmFTaGFwZXMgPyBcIkN1Q3VDdUN1OkN3Q3dDd0N3OlNiLS1Tci0tXCIgOiBcIlJwUnBScFJwOkN3Q3dDd0N3XCIsIC8vIHBhaW50aW5nIHQzXHJcbi8vIFx0XHRyZXF1aXJlZDogMzgwMCxcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF91bmRlcmdyb3VuZF9iZWx0X3RpZXJfMixcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAxNFxyXG4vLyBcdC8vIEJlbHQgcmVhZGVyXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IFwiLS1DZy0tLS06LS1Dci0tLS1cIiwgLy8gdW51c2VkXHJcbi8vIFx0XHRyZXF1aXJlZDogOCwgLy8gUGVyIHNlY29uZCFcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9iZWx0X3JlYWRlcixcclxuLy8gXHRcdHRocm91Z2hwdXRPbmx5OiB0cnVlLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDE1XHJcbi8vIFx0Ly8gU3RvcmFnZVxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIlNyU3JTclNyOkN5Q3lDeUN5XCIsIC8vIHVudXNlZFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDEwMDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3N0b3JhZ2UsXHJcbi8vIFx0fSxcclxuXHJcbi8vIFx0Ly8gMTZcclxuLy8gXHQvLyBRdWFkIEN1dHRlclxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIlNyU3JTclNyOkN5Q3lDeUN5OlN3U3dTd1N3XCIsIC8vIGJlbHRzIHQ0ICh0d28gdmFyaWFudHMpXHJcbi8vIFx0XHRyZXF1aXJlZDogNjAwMCxcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9jdXR0ZXJfcXVhZCxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAxN1xyXG4vLyBcdC8vIERvdWJsZSBwYWludGVyXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IGNoaW5hU2hhcGVzXHJcbi8vIFx0XHRcdD8gXCJDeUN5Q3lDeTpDeUN5Q3lDeTpSeVJ5UnlSeTpSdVJ1UnVSdVwiXHJcbi8vIFx0XHRcdDogXCJDYlJiUmJDYjpDd0N3Q3dDdzpXYldiV2JXYlwiLCAvLyBtaW5lciB0NCAodHdvIHZhcmlhbnRzKVxyXG4vLyBcdFx0cmVxdWlyZWQ6IDIwMDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3BhaW50ZXJfZG91YmxlLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDE4XHJcbi8vIFx0Ly8gUm90YXRlciAoMTgwZGVnKVxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIlNnLS0tLVNnOkNnQ2dDZ0NnOi0tQ3lDeS0tXCIsIC8vIHVudXNlZFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDIwMDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3JvdGF0ZXJfMTgwLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDE5XHJcbi8vIFx0Ly8gQ29tcGFjdCBzcGxpdHRlclxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIkNwUnBDcC0tOlN3U3dTd1N3XCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfc3BsaXR0ZXIsIC8vIFhcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyMFxyXG4vLyBcdC8vIFdJUkVTXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IGZpbmFsR2FtZVNoYXBlLFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3dpcmVzX3BhaW50ZXJfYW5kX2xldmVycyxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyMVxyXG4vLyBcdC8vIEZpbHRlclxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIkNyQ3dDckN3OkN3Q3JDd0NyOkNyQ3dDckN3OkN3Q3JDd0NyXCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZmlsdGVyLFxyXG4vLyBcdH0sXHJcblxyXG4vLyBcdC8vIDIyXHJcbi8vIFx0Ly8gQ29uc3RhbnQgc2lnbmFsXHJcbi8vIFx0e1xyXG4vLyBcdFx0c2hhcGU6IGNoaW5hU2hhcGVzXHJcbi8vIFx0XHRcdD8gXCJSclN5U3JTeTpSeUNyQ3dDcjpDeUN5UnlDeVwiXHJcbi8vIFx0XHRcdDogXCJDZy0tLS1DcjpDdy0tLS1DdzpTeS0tLS0tLTpDeS0tLS1DeVwiLFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX2NvbnN0YW50X3NpZ25hbCxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyM1xyXG4vLyBcdC8vIERpc3BsYXlcclxuLy8gXHR7XHJcbi8vIFx0XHRzaGFwZTogY2hpbmFTaGFwZXNcclxuLy8gXHRcdFx0PyBcIkNyQ3JDckNyOkN3Q3dDd0N3Old3V3dXd1d3OkNyQ3JDckNyXCJcclxuLy8gXHRcdFx0OiBcIkNjU3lDY1N5OlN5Q2NTeUNjOkNjU3lDY1N5XCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogMjUwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZGlzcGxheSxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyNCBMb2dpYyBnYXRlc1xyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBjaGluYVNoYXBlc1xyXG4vLyBcdFx0XHQ/IFwiU3UtLS0tU3U6UndSd1J3Unc6Q3UtLS0tQ3U6Q3dDd0N3Q3dcIlxyXG4vLyBcdFx0XHQ6IFwiQ2NSY0NjUmM6UndDd1J3Q3c6U3ItLVN3LS06Q3lDeUN5Q3lcIixcclxuLy8gXHRcdHJlcXVpcmVkOiAyNTAwMCxcclxuLy8gXHRcdHJld2FyZDogZW51bUh1YkdvYWxSZXdhcmRzLnJld2FyZF9sb2dpY19nYXRlcyxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyNSBWaXJ0dWFsIFByb2Nlc3NpbmdcclxuLy8gXHR7XHJcbi8vIFx0XHRzaGFwZTogXCJSZy0tUmctLTpDd1J3Q3dSdzotLVJnLS1SZ1wiLFxyXG4vLyBcdFx0cmVxdWlyZWQ6IDI1MDAwLFxyXG4vLyBcdFx0cmV3YXJkOiBlbnVtSHViR29hbFJld2FyZHMucmV3YXJkX3ZpcnR1YWxfcHJvY2Vzc2luZyxcclxuLy8gXHR9LFxyXG5cclxuLy8gXHQvLyAyNiBGcmVlcGxheVxyXG4vLyBcdHtcclxuLy8gXHRcdHNoYXBlOiBcIkNiQ3VDYkN1OlNyLS0tLS0tOi0tQ3JTckNyOkN3Q3dDd0N3XCIsXHJcbi8vIFx0XHRyZXF1aXJlZDogNTAwMDAsXHJcbi8vIFx0XHRyZXdhcmQ6IGVudW1IdWJHb2FsUmV3YXJkcy5yZXdhcmRfZnJlZXBsYXksXHJcbi8vIFx0fSxcclxuLy8gXSksXHJcbi8vIF07Il19