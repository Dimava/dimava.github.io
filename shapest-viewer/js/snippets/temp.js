"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
const sharp_1 = __importDefault(require("sharp"));
// jetpack.find('', {
// 	directories: true,
// 	files: false,
// })
let jp = fs_jetpack_1.default.cwd('dist/img-src/dl');
console.log(jp.list());
let inp = jp.path('giftest.gif');
let out = jp.path('giftest.webp');
(0, sharp_1.default)(inp, { animated: true })
    .webp({ lossless: true })
    .toFile(out)
    .then(() => {
    console.log(jp.inspect('giftest.gif'));
    console.log(jp.inspect('giftest.webp'));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NuaXBwZXRzL3RlbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0REFBaUM7QUFDakMsa0RBQTBCO0FBSzFCLHFCQUFxQjtBQUNyQixzQkFBc0I7QUFDdEIsaUJBQWlCO0FBQ2pCLEtBQUs7QUFFTCxJQUFJLEVBQUUsR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFFdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNqQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRWxDLElBQUEsZUFBSyxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQztLQUMxQixJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7S0FDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUVaLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqZXRwYWNrIGZyb20gXCJmcy1qZXRwYWNrXCI7XHJcbmltcG9ydCBzaGFycCBmcm9tIFwic2hhcnBcIjtcclxuXHJcblxyXG5cclxuXHJcbi8vIGpldHBhY2suZmluZCgnJywge1xyXG4vLyBcdGRpcmVjdG9yaWVzOiB0cnVlLFxyXG4vLyBcdGZpbGVzOiBmYWxzZSxcclxuLy8gfSlcclxuXHJcbmxldCBqcCA9IGpldHBhY2suY3dkKCdkaXN0L2ltZy1zcmMvZGwnKVxyXG5cclxuY29uc29sZS5sb2coanAubGlzdCgpKVxyXG5cclxubGV0IGlucCA9IGpwLnBhdGgoJ2dpZnRlc3QuZ2lmJyk7XHJcbmxldCBvdXQgPSBqcC5wYXRoKCdnaWZ0ZXN0LndlYnAnKTtcclxuXHJcbnNoYXJwKGlucCwge2FuaW1hdGVkOiB0cnVlfSlcclxuXHQud2VicCh7bG9zc2xlc3M6IHRydWV9KVxyXG5cdC50b0ZpbGUob3V0KVxyXG5cclxuLnRoZW4oKCkgPT4ge1xyXG5cdGNvbnNvbGUubG9nKGpwLmluc3BlY3QoJ2dpZnRlc3QuZ2lmJykpO1xyXG5cdGNvbnNvbGUubG9nKGpwLmluc3BlY3QoJ2dpZnRlc3Qud2VicCcpKTtcclxufSkiXX0=