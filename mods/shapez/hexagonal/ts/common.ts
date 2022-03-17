import { Mod } from "shapez/mods/mod";




declare module "shapez/game/components/item_processor" {
	export interface enumItemProcessorTypes {
		flipper: 'flippe';
		priority_balancer: 'priority_balancer';
	}
}



export function strToH(s: string): string {
	let hash = 0;
	for (let c of s) {
		hash = (((hash << 5) - hash) + c.charCodeAt(0)) | 0;
	}
	return hash.toString(16);
}



export function override<
	C extends abstract new (...args: any) => any, T extends InstanceType<C>, K extends keyof T
>(cls: C, name: K, fn: (oldFnName: K) => T[K]) {
	let oldFnName = name as string;
	while (cls.prototype[oldFnName]) oldFnName = '_' + oldFnName;
	cls.prototype[oldFnName] = cls.prototype[name];
	cls.prototype[name] = fn(oldFnName as K);
}


export function ExtendSuperclass<
	C extends abstract new (...args: any) => any,
	T extends InstanceType<C>,
	O extends C
>(mod: Mod, cls: C, makeSubclass: (old: { $old: T }) => O) {
	mod.modInterface.extendClass(cls, (old) => {
		return makeSubclass(old).prototype;
	});
}