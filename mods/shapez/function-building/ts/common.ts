


export const urlRoot = 'http://127.0.0.1:5500/function-building/sprites/';

export async function fetch64(img: string) {
	return `${urlRoot}${img}`;
	// http://127.0.0.1:8080/shapest-working/sprites/1.png
	// let r = await fetch(`http://127.0.0.1:8080/shapest-working/sprites/${img}`);
	// let t = await r.text();
	// return `data:image/${img.split('.').pop()};base64,${btoa(t)}`;
}


export const RESOURCES = {
	"flipper.png": await fetch64('flip.png'),
	flipper: await fetch64('flip.png'),
	flip_white: await fetch64('flip_white.png'),
	rotate31: await fetch64('rotate31.png'),
	rotate32: await fetch64('rotate32.png'),
	splitter1: await fetch64('splitter1.png'),
	fn_building: await fetch64('fn-building.png'),
	fn_call: await fetch64('virtual-function-call.png'),
	fn_process: await fetch64('virtual-function-process.png'),
	tut_painter2: await fetch64('tut_painter2.png'),
};

