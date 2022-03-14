import { ISzLayer, SzLayer } from "./layer.js";
import { SzContext2D } from "./SzContext2D.js";




let cv = document.createElement('canvas');
document.body.append(cv);
cv.style.border = '3px solid #aaa'
cv.height = cv.width = 256;
let ctx = cv.getContext('2d')!;
const PI = Math.PI;
const PI12 = -PI / 12;
function log(...a: any[]) {
	for (let o of a)
		document.body.append(JSON.stringify(o));
}

ctx.scale(cv.width / 2, cv.height / 2);
ctx.translate(1, 1);
ctx.rotate(-Math.PI / 2);
ctx.scale(1 / 1.15, 1 / 1.15);
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

let sctx = new SzContext2D(ctx);


const testTemplate: ISzLayer = {
	cuts: [
		{ from: 10, to: 10, shape: 'line', color: 'blue' },
		{ from: 14, to: 14, shape: 'line', color: 'blue' },
	],
	quads: [
		{ shape: 'square', color: 'green', from: 2, to: 4 },
		{ shape: 'circle', color: 'pink', from: 5, to: 19 },
		{ shape: 'square', color: 'green', from: 20, to: 22 },
	],
	areas: [
		{ shape: 'sector', color: 'red', from: 11, to: 13 },
	],
}

let layer = new SzLayer(testTemplate);
// let layer = SzLayer.createTest();

layer.drawCenteredNormalized(sctx);