/*
 * Lots of code here is copied 1:1 from actual game files
 *
 */


/** @enum {string} */
const enumSubShape = {};
/** @enum {string} */
const enumSubShapeToShortcode = {};
/** @enum {enumSubShape} */
const enumShortcodeToSubShape = {};
/** @enum {string} */
const enumDefaultSubShapeColor = {}


/** @enum {string} */
const enumColors = {}
/** @enum {string} */
const enumColorToShortcode = {}
/** @enum {string} */
const enumColorsToHexCode = {}
/** @enum {enumColors} */
const enumShortcodeToColor = {};

const customSubShape = {};


function addColor(id, code, hex = id) {
	if (typeof code != "string") {
		throw new Error('2nd arg of addColor should be string');
	}
	code = code.toLowerCase();
	if (!id || !code) {
		return;
	}
	if (enumColors[id] && enumColorToShortcode[id] != code) {
		id += '2';
	}
	if (enumShortcodeToColor[code]) {
		let cid = enumShortcodeToColor[code];
		delete enumColors[cid];
		delete enumColorToShortcode[cid];
		delete enumShortcodeToColor[code];
		delete enumColorsToHexCode[cid];
	}
	enumColors[id] = id;
	enumColorToShortcode[id] = code;
	enumShortcodeToColor[code] = id;
	enumColorsToHexCode[id] = hex;
	return 'C' + code;
}

addColor("red",			"r",	"#ff666a");
addColor("green",		"g",	"#78ff66");
addColor("blue",		"b",	"#66a7ff");
addColor("yellow",		"y",	"#fcf52a");
addColor("purple",		"p",	"#dd66ff");
addColor("cyan",		"c",	"#00fcff"); // or #87fff5
addColor("white",		"w",	"#ffffff");
addColor("uncolored",	"u",	"#aaaaaa");
addColor("black",		"k",	"#333333");


function addSubShape(id, code, data = null) {
	code = code.toUpperCase();
	if (!id || !code) {
		return;
	}
	if (enumSubShape[id] && enumSubShapeToShortcode[id] != code) {
		id += '2';
	}
	if (enumShortcodeToSubShape[code]) {
		let cid = enumShortcodeToSubShape[code];
		if (!customSubShape[cid]) {
			throw new Error('code already exists!');
		}
		delete enumSubShape[cid];
		delete enumSubShapeToShortcode[cid];
		delete enumShortcodeToSubShape[code];
		delete enumDefaultSubShapeColor[cid];
		delete customSubShape[cid];
	}
	enumSubShape[id] = id;
	enumSubShapeToShortcode[id] = code;
	enumShortcodeToSubShape[code] = id;
	if (typeof data == 'string') {
		enumDefaultSubShapeColor[id] = enumShortcodeToColor[data];
	} else if (data && data.color) {
		enumDefaultSubShapeColor[id] = enumShortcodeToColor[data.color];
	} else {
		enumDefaultSubShapeColor[id] = enumShortcodeToColor["u"];
	}
	if (data && data.draw) {
		customSubShape[id] = data;
	}
	return code;
}

addSubShape("rect",		"R");
addSubShape("circle",	"C");
addSubShape("star",		"S");
addSubShape("windmill",	"W");

addSubShape("clover",	"L",	"g");
addSubShape("star8",	"T");
addSubShape("rhombus",	"B");
addSubShape("plus",		"P");
addSubShape("razor",	"Z");
addSubShape("sun",		"U",	"y");

addSubShape("none",		"-",	"-");



const arrayQuadrantIndexToOffset = [
	{ x: 1, y: -1 }, // tr
	{ x: 1, y: 1 }, // br
	{ x: -1, y: 1 }, // bl
	{ x: -1, y: -1 }, // tl
];






CanvasRenderingContext2D.prototype.beginCircle = function(x, y, r) {
	if (r < 0.05) {
		this.beginPath();
		this.rect(x, y, 1, 1);
		return;
	}
	this.beginPath();
	this.arc(x, y, r, 0, 2.0 * Math.PI);
};

/////////////////////////////////////////////////////

function radians(degrees) {
	return (degrees * Math.PI) / 180.0;
}

/**
 * Generates the definition from the given short key
 */
function fromShortKey(key) {
	const sourceLayers = key.replace(/\s/g, '').split(":").filter(Boolean).map(parseShortKey);

	if (checkImpossible(sourceLayers.join(':'))) {
		showError(new Error(checkImpossible(sourceLayers.join(':'))));
	}

	if (sourceLayers.length > 4) {
		showError(new Error("Only 4 layers allowed"));
	}

	for (let i = 0; i < sourceLayers.length; ++i) {
		if (checkUnknown(sourceLayers[i])) {
			showError(new Error(checkUnknown(sourceLayers[i])));
		}
	}

	return formLayers(sourceLayers);

}

function formLayers(keys) {
	let layers = [];
	for (let i = 0; i < keys.length; ++i) {
		let text = keys[i];

		const quads = [null, null, null, null];
		for (let quad = 0; quad < 4; ++quad) {
			const shapeText = text[quad * 2 + 0];
			const subShape = enumShortcodeToSubShape[shapeText] || shapeText;
			const color = enumShortcodeToColor[text[quad * 2 + 1]] || enumColors.uncolored;
			quads[quad] = {
				subShape,
				color,
			};
		}
		layers.push(quads);
	}
	return layers;
}

function textToHTML(text) {
	const span = document.createElement('span');
	span.innerText = text;
	return span.innerHTML;
}



/**
 * Parse short key into a full one
 * @param {string} key
 * @returns {string}
 */
function parseShortKey(key) {
	const emptyLayer = '--'.repeat(4);
	const clr = (A, c) => A == '-' ? '-' : !c || c == '-' ? enumColorToShortcode[enumDefaultSubShapeColor[enumShortcodeToSubShape[A]]] || 'u' : c;

	const escKey = `<code>${textToHTML(key)}</code>`;

	if (!key) {
		return emptyLayer;
	}

	if (key.match(/[^A-Za-z:\-]/)) {
		let match = key.match(/[^A-Za-z:\-]/);
		showError(new Error(`key ${escKey} has invalid symbol: <code>${textToHTML(match[0])}</code>`));
	}

	if (key.length == 8) {
		if (!key.match(/^([A-Z\-][a-z\-]){4}$/)) {
			showError(new Error(`key ${escKey} is invalid`));
		}
		return key;
	}

	if (key.length == 1) {
		if (key == '-') {
			return emptyLayer;
		}
		// A -> AuAuAuAu
		if (key.match(/^[A-Z]$/)) {
			return `${key}${clr(key)}`.repeat(4);
		}
		showError(new Error(`key ${escKey} is invalid`));
	}

	if (key.length == 2) {
		// AB -> AuBuAuBu
		if (key.match(/^[A-Z\-]{2}$/)) {
			return `${key[0]}${clr(key[0])}${key[1]}${clr(key[1])}`.repeat(2);
		}
		// Ac -> AcAcAcAc
		if (key.match(/^[A-Z\-][a-z\-]$/)) {
			return `${key[0]}${clr(key[0], key[1])}`.repeat(4);
		}
		showError(new Error(`key ${escKey} is invalid`));
	}

	if (key.length == 4) {
		// ABCD -> AuBuCuDu
		if (key.match(/^[A-Z\-]{4}$/)) {
			return `${key[0]}${clr(key[0])}${key[1]}${clr(key[1])}${key[2]}${clr(key[2])}${key[3]}${clr(key[3])}`;
		}
		// AcBd -> AcBdAcBd
		if (key.match(/^([A-Z\-][a-z\-]){2}$/)) {
			return `${key[0]}${clr(key[0], key[1])}${key[2]}${clr(key[2], key[3])}`.repeat(2);
		}
		showError(new Error(`key ${escKey} is invalid`));
	}

	showError(new Error(`key ${escKey} has invalid length`));
	return key;
}

/**
 * Check if the shape is impossible and why
 * @param {string} key
 * @returns {string | void}
 */
function checkImpossible(key) {
	let layers = key.split(':');
	const emptyLayer = '--'.repeat(4);
	while (layers[layers.length - 1] == emptyLayer) {
		layers.pop();
	}
	if (layers.length > 4) {
		return `Impossible to stack ${layers.length} layers, max is 4`;
	}
	if (layers.includes(emptyLayer)) {
		return `Impossible to create empty layer #${layers.indexOf(emptyLayer)}`;
	}
	let forms = layers.map(l => {
		return 0b1000 * (l[0] != '-') + 0b0100 * (l[2] != '-') + 0b0010 * (l[4] != '-') + 0b0001 * (l[6] != '-');
	});
	// first, pop layers that can be layered:
	while (forms.length >= 2) {
		if ((forms[forms.length - 1] & forms[forms.length - 2])) {
			forms.pop();
		} else {
			break;
		}
	}
	if (forms.length < 2) {
		return;
	}

	function rotateForm(form) {
		return (form >> 1) + 0b1000 * (form & 0b0001);
	}
	let highestReached = 0;
	for (let j = 0; j < 4; j++) {
		console.log(j, forms.map(e => e.toString(2)));
		// second, check if half has no empty layers and other half is dropped
		let hasNoEmpty = true;
		let l1, l2;
		for (l1 = 1; l1 < forms.length; l1++) {
			if ((forms[l1] & 0b0011) && !(forms[l1 - 1] & 0b0011)) {
				hasNoEmpty = false;
				break;
			}
		}
		let isDropped = true;
		for (l2 = 1; l2 < forms.length; l2++) {
			if ((forms[l2] & 0b1100) & ~(forms[l2 - 1] & 0b1100)) {
				isDropped = false;
				break;
			}
		}
		if (hasNoEmpty && isDropped) {
			console.log('can split in rotation', j);
			break;
		}
		highestReached = Math.max(highestReached, Math.min(l1, l2) - 1);
		forms = forms.map(rotateForm);
		if (j == 3) {
			return `Impossible to create layer ${highestReached}`;
		}
	}
}

/**
 * Check if the key contains uncnown colors and shapes
 * @param {string} key
 * @returns {string | void}
 */
function checkUnknown(key) {
	let badShapes = new Set();
	let badColors = new Set();
	for (let c of key) {
		if (c.match(/[A-Z]/)) {
			if (!enumShortcodeToSubShape[c]) {
				badShapes.add(c);
			}
		}
		if (c.match(/[a-z]/)) {
			if (!enumShortcodeToColor[c]) {
				badColors.add(c);
			}
		}
	}
	const badShapeStr = `Unkown shape${badShapes.size > 1 ? 's' : ''}: <code>${Array.from(badShapes).join(' ')}</code>`;
	const badColorStr = `Unkown color${badShapes.size > 1 ? 's' : ''}: <code>${Array.from(badColors).join(' ')}</code>`;

	if (badShapes.size && badColors.size) {
		return badShapeStr + '<br>' + badColorStr;
	}
	if (badShapes.size) {
		return badShapeStr;
	}
	if (badColors.size) {
		return badColorStr;
	}
}



function renderShape(layers) {
	const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
		"result"
	));
	const context = canvas.getContext("2d");

	context.save();
	context.clearRect(0, 0, 1000, 1000);

	const w = 512;
	const h = 512;
	const dpi = 1;
	return internalGenerateShapeBuffer(layers, canvas, context, w, h, dpi);
}

function getLayerScale(layerIndex) {
	return 0.9 * Math.pow(0.9 - 0.22, layerIndex);
	return Math.max(0.1, 0.9 - layerIndex * 0.22);
}

function getLayerLineWidth(layerIndex) {
	return Math.pow(0.8, layerIndex);
}

function internalGenerateShapeBuffer(layers, canvas, context, w, h, dpi) {
	context.translate((w * dpi) / 2, (h * dpi) / 2);
	context.scale((dpi * w) / 23, (dpi * h) / 23);

	context.fillStyle = "#e9ecf7";

	const quadrantSize = 10;
	const quadrantHalfSize = quadrantSize / 2;

	context.fillStyle = "rgba(40, 50, 65, 0.1)";
	context.beginCircle(0, 0, quadrantSize * 1.15);
	context.fill();

	for (let layerIndex = 0; layerIndex < layers.length; ++layerIndex) {
		const quadrants = layers[layerIndex];

		const layerScale = getLayerScale(layerIndex);

		for (let quadrantIndex = 0; quadrantIndex < 4; ++quadrantIndex) {
			if (!quadrants[quadrantIndex]) {
				continue;
			}
			const { subShape, color } = quadrants[quadrantIndex];

			const quadrantPos = arrayQuadrantIndexToOffset[quadrantIndex];
			const centerQuadrantX = quadrantPos.x * quadrantHalfSize;
			const centerQuadrantY = quadrantPos.y * quadrantHalfSize;

			const rotation = radians(quadrantIndex * 90);

			context.translate(centerQuadrantX, centerQuadrantY);
			context.rotate(rotation);

			context.fillStyle = enumColorsToHexCode[color];
			context.strokeStyle = "#555"; // THEME.items.outline;
			context.lineWidth = getLayerLineWidth(layerIndex); // THEME.items.outlineWidth;

			const insetPadding = 0.0;

			const dims = quadrantSize * layerScale;
			const innerDims = insetPadding - quadrantHalfSize;
			switch (subShape) {
				case enumSubShape.rect:
					{
						context.beginPath();
						const dims = quadrantSize * layerScale;
						context.rect(
							insetPadding + -quadrantHalfSize,
							-insetPadding + quadrantHalfSize - dims,
							dims,
							dims
						);

						break;
					}
				case enumSubShape.star:
					{
						context.beginPath();
						const dims = quadrantSize * layerScale;

						let originX = insetPadding - quadrantHalfSize;
						let originY = -insetPadding + quadrantHalfSize - dims;

						const moveInwards = dims * 0.4;
						context.moveTo(originX, originY + moveInwards);
						context.lineTo(originX + dims, originY);
						context.lineTo(originX + dims - moveInwards, originY + dims);
						context.lineTo(originX, originY + dims);
						context.closePath();
						break;
					}

				case enumSubShape.windmill:
					{
						context.beginPath();
						const dims = quadrantSize * layerScale;

						let originX = insetPadding - quadrantHalfSize;
						let originY = -insetPadding + quadrantHalfSize - dims;
						const moveInwards = dims * 0.4;
						context.moveTo(originX, originY + moveInwards);
						context.lineTo(originX + dims, originY);
						context.lineTo(originX + dims, originY + dims);
						context.lineTo(originX, originY + dims);
						context.closePath();
						break;
					}

				case enumSubShape.circle:
					{
						context.beginPath();
						context.moveTo(insetPadding + -quadrantHalfSize, -insetPadding + quadrantHalfSize);
						context.arc(
							insetPadding + -quadrantHalfSize,
							-insetPadding + quadrantHalfSize,
							quadrantSize * layerScale,
							-Math.PI * 0.5,
							0
						);
						context.closePath();
						break;
					}

				case enumSubShape.clover:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();

						const inner = 0.5;
						const inner_center = 0.45;
						const size = 1.3;
						context.scale(size, size);

						context.moveTo(0, 0);
						context.lineTo(0, inner);
						context.bezierCurveTo(0, 1, inner, 1, inner_center, inner_center);
						context.bezierCurveTo(1, inner, 1, 0, inner, 0);

						context.closePath();
						context.restore();
						break;
					}
				case enumSubShape.star8:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();

						const inner = 0.5;
						const size = 1.22;
						context.scale(size, size);

						context.moveTo(0, 0);
						context.lineTo(0, inner);
						context.lineTo(Math.sin(Math.PI / 8), Math.cos(Math.PI / 8));
						context.lineTo(inner * Math.sin(Math.PI / 4), inner * Math.cos(Math.PI / 4));
						context.lineTo(Math.sin((Math.PI * 3) / 8), Math.cos((Math.PI * 3) / 8));
						context.lineTo(inner, 0);

						context.closePath();
						context.restore();
						break;
					}
				case enumSubShape.rhombus:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();

						const rad = 0.001;
						const size = 1.2;
						context.scale(size, size);

						// with rounded borders
						context.moveTo(0, 0);
						context.arcTo(0, 1, 1, 0, rad);
						context.arcTo(1, 0, 0, 0, rad);

						context.closePath();
						context.restore();
						break;
					}
				case enumSubShape.plus:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();

						const inner = 0.4;
						const size = 1.2;
						context.scale(size, size);

						context.moveTo(0, 0);
						context.lineTo(1, 0);
						context.lineTo(1, inner);
						context.lineTo(inner, inner);
						context.lineTo(inner, 1);
						context.lineTo(0, 1);

						context.closePath();
						context.restore();
						break;
					}
				case enumSubShape.razor:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();

						const inner = 0.5;
						const size = 1.1;
						context.scale(size, size);

						context.moveTo(0, 0);
						context.lineTo(inner, 0);
						context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
						context.bezierCurveTo(
							1,
							inner,
							inner * Math.SQRT2 * 0.9,
							inner * Math.SQRT2 * 0.9,
							inner * Math.SQRT1_2,
							inner * Math.SQRT1_2
						);
						context.rotate(Math.PI / 4);
						context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
						context.bezierCurveTo(
							1,
							inner,
							inner * Math.SQRT2 * 0.9,
							inner * Math.SQRT2 * 0.9,
							inner * Math.SQRT1_2,
							inner * Math.SQRT1_2
						);

						context.closePath();
						context.restore();
						break;
					}
				case enumSubShape.sun:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();

						const size = 1.3;   
						context.scale(size, size);

						const PI = Math.PI;
						const PI3 = PI * 3 / 8 * 0.75;

						const c = 1 / Math.cos(Math.PI / 8);
						const b = c * Math.sin(Math.PI / 8);

						context.moveTo(0, 0);
						context.rotate(Math.PI / 2);
						context.arc(c, 0, b, -PI, -PI + PI3);
						context.rotate(-Math.PI / 4);
						context.arc(c, 0, b, -PI - PI3, -PI + PI3);
						context.rotate(-Math.PI / 4);
						context.arc(c, 0, b, PI - PI3, PI);

						context.closePath();
						context.restore();
						break;
					}
				case enumSubShape.none:
					{
						context.beginPath();
						break;
					}
				default:
					{
						context.save();
						context.translate(innerDims, -innerDims);
						context.scale(dims, -dims);
						context.beginPath();
						const custom = customSubShape[subShape];
						if (custom) {
							if (custom.size) {
								context.scale(custom.size, custom.size);
							}
							if (custom.draw) {
								try {
									custom.draw(context, layerIndex, quadrantIndex);
								} catch(e) {
									showError(e);
								}
							}
							if (!custom.open) {
								context.closePath();
							}
						} else {
							context.scale(1 / 8, -1 / 8);
							context.fillText(subShape || '?', 0, 0);
						}
						context.restore();

					}
			}

			context.fill();
			context.stroke();

			context.rotate(-rotation);
			context.translate(-centerQuadrantX, -centerQuadrantY);
		}


	}

	context.restore();
}

/////////////////////////////////////////////////////

function initVariants() {
	// <ul id="shapeCodes">
	//   <li><code>C</code> Circle</li>
	const ulShapes = document.querySelector('#shapeCodes');
	ulShapes.innerHTML = '';
	for (let shape of Object.values(enumSubShape)) {
		let li = document.createElement('li');
		li.innerHTML = `
			<code>${enumSubShapeToShortcode[shape]}</code>
			<canvas width="16" height="16"></canvas>
			${shape[0].toUpperCase() + shape.slice(1)}
		`;
		li.onclick = () => selectVariant(enumSubShapeToShortcode[shape]);
		let cv = li.querySelector('canvas');
		let ctx = cv.getContext('2d');
		internalGenerateShapeBuffer(formLayers([parseShortKey(enumSubShapeToShortcode[shape])]), cv, ctx, 16, 16, 1);
		ulShapes.append(li);
	}
	// <ul id="colorCodes">
	//   <li>
	//     <code>r</code>
	//     <span class="colorPreview" style="background: #ff666a;"></span>
	//     Red
	//   </li>
	const ulColors = document.querySelector('#colorCodes');
	ulColors.innerHTML = '';
	for (let color of Object.values(enumColors)) {
		let li = document.createElement('li');
		li.innerHTML = `
    		<code>${enumColorToShortcode[color]}</code>
    		<span class="colorPreview" style="background: ${enumColorsToHexCode[color]};"></span>
    		${color[0].toUpperCase() + color.slice(1)}
    	`;
		li.onclick = () => selectVariant(enumSubShapeToShortcode[enumSubShape.circle] + enumColorToShortcode[color]);
		ulColors.append(li);
	}
}


function initEditor() {
	const infoBox = document.querySelector('.infoBox');
	for (let el of document.querySelectorAll('.infoBox>p, .infoBox>br, .infoBox>h2, .infoBox>p+h3')) {
		el.remove();
	}
	const ta = document.createElement('textarea');
	ta.style.width = '500px';
	ta.style.height = '300px';
	infoBox.prepend(ta);
	ta.value = `
		addColor("orange", "o", "orange")
		<!-->
		addSubShape("newShape", "N", {
			size: 1,
			color: 'o',
			draw(ctx, layerIndex, quarterIndex) {
				with (ctx) { with (Math) {
		////////////////////////
		// draw mostly in [0,1]x[0,1] square


		moveTo(0, 0)
		lineTo(1, 1)
		lineTo(1, 0)


		////////////////////////
				} }
			}
		})
	`.replace(/\n\t\t/g, '\n').slice(1, -2); // .replace(/\t/g, '');
	ta.oninput = updateEditor;
	loadVariants();
	if (!enumShortcodeToSubShape["N"]) {
		updateEditor();
	}
	selectVariant("No");
	updateEditor();
	document.querySelector('.infoBox').ondblclick = null;

}


function updateEditor() {
	try {
		showError(null);
		const ta = document.querySelector('textarea');
		const vals = ta.value.split(/<!-->/);
		for (let val of vals) {
			val = val.trim();
			const code = eval(val);
			if (
				typeof code == 'string' &&
				code.length < 44 &&
				!document.getElementById("code").value.includes(code)
			) {
				document.getElementById("code").value = code;
			}
			generate();
			initVariants();
			const errorDiv = document.getElementById("error");
			if (errorDiv.innerText == "Shape generated") {
				saveVariant(code.slice(-1), val);
			}
		}
	} catch(err) {
		showError(err);
	}
}

function saveVariant(code, val) {
	let allVariants = localStorage.getItem('shapezCustomShapeCodes') || "";
	if (!allVariants.includes(code)) {
		localStorage.setItem('shapezCustomShapeCodes', allVariants + code);
	}
	localStorage.setItem('shapezCustomShapes_' + code, val);
}

function loadVariants() {
	let allVariants = localStorage.getItem("shapezCustomShapeCodes") || "";
	for (let code of allVariants) {
		let val = localStorage.getItem('shapezCustomShapes_' + code);
		try {
			eval(val);
		} catch(err) {
			showError(err);
		}
	}
}

function selectVariant(key) {
	const ta = document.querySelector('textarea');
	const valsS = key.split('').filter(c => customSubShape[enumShortcodeToSubShape[c]]);
	const valsC = key.split('').filter(c => enumShortcodeToColor[c]);
	let ar = [];
	ar.push(...valsC.map(c => localStorage.getItem('shapezCustomShapes_' + c) || ""));
	ar.push(...valsS.map(c => localStorage.getItem('shapezCustomShapes_' + c) || ""));
	ta.value = ar.filter(Boolean).join('\n<!-->\n');

	document.getElementById("code").value = key;
	generate();
}

function showError(msg) {
	const errorDiv = document.getElementById("error");
	errorDiv.classList.toggle("hasError", !!msg);
	if (msg) {
		if (errorDiv.innerText == "Shape generated") {
			errorDiv.innerHTML = msg;
		} else {
			errorDiv.innerHTML += '<br>' + msg;
		}
		console.error(msg);
	} else {
		errorDiv.innerText = "Shape generated";
	}
}

// @ts-ignore
window.generate = () => {
	showError(null);
	// @ts-ignore
	const code = document.getElementById("code").value.trim();

	let parsed = null;
	try {
		parsed = fromShortKey(code);
	} catch (ex) {
		showError(ex);
		return;
	}

	renderShape(parsed);
};

// @ts-ignore
window.debounce = (fn) => {
	setTimeout(fn, 0);
};

// @ts-ignore
window.addEventListener("load", () => {
	initVariants();
	document.querySelector('.infoBox').ondblclick = initEditor;
	if (localStorage.getItem("shapezCustomShapeCodes")) {
		initEditor();
	}
	if (window.location.search) {
		const key = window.location.search.substr(1);
		document.getElementById("code").value = key;
	}
	generate();
});

window.exportShape = () => {
	const canvas = document.getElementById("result");
	const imageURL = canvas.toDataURL("image/png");

	const dummyLink = document.createElement("a");
	dummyLink.download = "shape.png";
	dummyLink.href = imageURL;
	dummyLink.dataset.downloadurl = [
		"image/png",
		dummyLink.download,
		dummyLink.href,
	].join(":");

	document.body.appendChild(dummyLink);
	dummyLink.click();
	document.body.removeChild(dummyLink);
};

window.viewShape = (key) => {
	document.getElementById("code").value = key;
	generate();
};

window.shareShape = () => {
	const code = document.getElementById("code").value.trim();
	const url = "https://viewer.shapez.io?" + code;
	alert("You can share this url: " + url);
};