

// pooplib
interface Console {
	_log: typeof console.log;
}
interface PromiseConstructor {
	frame(): Promise<DOMHighResTimeStamp>;
}
interface Element {
	q(s: string): HTMLElement;
	qq(s: string): HTMLElement[];
}
interface String {
	toKNumber(): number;
	toSuperscript(): string;
}
declare const $: any;
declare const require: any;

declare var q: (s: string) => HTMLElement;
declare var qq: (s: string, v?: any) => HTMLElement[];

declare var makeStyle: (s: string, e?: any) => HTMLStyleElement;
declare var makeraf: (f: FrameRequestCallback) => (() => void);
