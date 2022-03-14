import { Blueprint, HubGoals } from "./shapez.js";
export class SandboxMode {
    static install(mod) {
        mod.modInterface.replaceMethod(Blueprint, "getCost", function () {
            return 0;
        });
        mod.modInterface.replaceMethod(HubGoals, "isRewardUnlocked", function () {
            return true;
        });
        // mod.signals.modifyLevelDefinitions.add((
        // 	levels: {
        // 		shape: string;
        // 		required: number;
        // 		reward: string;
        // 		throughputOnly: boolean;
        // 	}[]
        // ) => {
        // 	levels.map(e => e.required = 1);
        // });
        // mod.signals.modifyUpgrades.add((
        // 	upgrades: Record<string, {
        // 		required: {
        // 			shape: string;
        // 			amount: number;
        // 		}[];
        // 		excludePrevious?: boolean;
        // 	}[]>
        // ) => {
        // 	Object.values(upgrades).flat().flatMap(e => e.required).map(e => e.amount = 1);
        // });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuZGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zYW5kYm94LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFPLE1BQU0sYUFBYSxDQUFDO0FBR3ZELE1BQU0sT0FBTyxXQUFXO0lBQ3ZCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBUTtRQUN0QixHQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUQsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztRQUVILDJDQUEyQztRQUMzQyxhQUFhO1FBQ2IsbUJBQW1CO1FBQ25CLHNCQUFzQjtRQUN0QixvQkFBb0I7UUFDcEIsNkJBQTZCO1FBQzdCLE9BQU87UUFDUCxTQUFTO1FBQ1Qsb0NBQW9DO1FBQ3BDLE1BQU07UUFHTixtQ0FBbUM7UUFDbkMsOEJBQThCO1FBQzlCLGdCQUFnQjtRQUNoQixvQkFBb0I7UUFDcEIscUJBQXFCO1FBQ3JCLFNBQVM7UUFDVCwrQkFBK0I7UUFDL0IsUUFBUTtRQUNSLFNBQVM7UUFDVCxtRkFBbUY7UUFDbkYsTUFBTTtJQUNQLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJsdWVwcmludCwgSHViR29hbHMsIE1vZCB9IGZyb20gXCIuL3NoYXBlei5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTYW5kYm94TW9kZSB7XHJcblx0c3RhdGljIGluc3RhbGwobW9kOiBNb2QpIHtcclxuXHRcdG1vZC5tb2RJbnRlcmZhY2UucmVwbGFjZU1ldGhvZChCbHVlcHJpbnQsIFwiZ2V0Q29zdFwiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fSk7XHJcblx0XHRtb2QubW9kSW50ZXJmYWNlLnJlcGxhY2VNZXRob2QoSHViR29hbHMsIFwiaXNSZXdhcmRVbmxvY2tlZFwiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gbW9kLnNpZ25hbHMubW9kaWZ5TGV2ZWxEZWZpbml0aW9ucy5hZGQoKFxyXG5cdFx0Ly8gXHRsZXZlbHM6IHtcclxuXHRcdC8vIFx0XHRzaGFwZTogc3RyaW5nO1xyXG5cdFx0Ly8gXHRcdHJlcXVpcmVkOiBudW1iZXI7XHJcblx0XHQvLyBcdFx0cmV3YXJkOiBzdHJpbmc7XHJcblx0XHQvLyBcdFx0dGhyb3VnaHB1dE9ubHk6IGJvb2xlYW47XHJcblx0XHQvLyBcdH1bXVxyXG5cdFx0Ly8gKSA9PiB7XHJcblx0XHQvLyBcdGxldmVscy5tYXAoZSA9PiBlLnJlcXVpcmVkID0gMSk7XHJcblx0XHQvLyB9KTtcclxuXHJcblxyXG5cdFx0Ly8gbW9kLnNpZ25hbHMubW9kaWZ5VXBncmFkZXMuYWRkKChcclxuXHRcdC8vIFx0dXBncmFkZXM6IFJlY29yZDxzdHJpbmcsIHtcclxuXHRcdC8vIFx0XHRyZXF1aXJlZDoge1xyXG5cdFx0Ly8gXHRcdFx0c2hhcGU6IHN0cmluZztcclxuXHRcdC8vIFx0XHRcdGFtb3VudDogbnVtYmVyO1xyXG5cdFx0Ly8gXHRcdH1bXTtcclxuXHRcdC8vIFx0XHRleGNsdWRlUHJldmlvdXM/OiBib29sZWFuO1xyXG5cdFx0Ly8gXHR9W10+XHJcblx0XHQvLyApID0+IHtcclxuXHRcdC8vIFx0T2JqZWN0LnZhbHVlcyh1cGdyYWRlcykuZmxhdCgpLmZsYXRNYXAoZSA9PiBlLnJlcXVpcmVkKS5tYXAoZSA9PiBlLmFtb3VudCA9IDEpO1xyXG5cdFx0Ly8gfSk7XHJcblx0fVxyXG59Il19