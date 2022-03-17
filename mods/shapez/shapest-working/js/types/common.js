async function fetch64(img) {
    return `https://dimava.github.io/mods/shapez/shapest-working/sprites/${img}`;
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
    tut_painter2: await fetch64('tut_painter2.png'),
};
export function strToH(s) {
    let hash = 0;
    for (let c of s) {
        hash = (((hash << 5) - hash) + c.charCodeAt(0)) | 0;
    }
    return hash.toString(16);
}
export function override(cls, name, fn) {
    let oldFnName = name;
    while (cls.prototype[oldFnName])
        oldFnName = '_' + oldFnName;
    cls.prototype[oldFnName] = cls.prototype[name];
    cls.prototype[name] = fn(oldFnName);
}
export function ExtendSuperclass(mod, cls, makeSubclass) {
    mod.modInterface.extendClass(cls, (old) => {
        if (cls.isPrototypeOf(makeSubclass))
            return makeSubclass;
        return makeSubclass(old).prototype;
    });
}
export function ExtendSuperclass2(subclass) {
    let x = subclass.prototype;
    let p = x.__proto__;
    let xd = Object.getOwnPropertyDescriptors(x);
    delete xd.constructor;
    Object.defineProperties(p, xd);
    x.__proto__ = p.__proto__;
}
// export function ExtendSuperclass<
// 	C extends abstract new (...args: any) => any,
// 	T extends InstanceType<C>,
// 	O extends C
// >(mod: Mod, subclass: O): void;
// export function ExtendSuperclass<
// 	C extends abstract new (...args: any) => any,
// 	T extends InstanceType<C>,
// 	O extends C
// >(mod: Mod, cls: C, subclass: O): void;
// export function ExtendSuperclass<
// 	C extends abstract new (...args: any) => any,
// 	T extends InstanceType<C>,
// 	O extends C
// >(mod: Mod, cls: C, subclass: (old: { $old: T }) => O): void;
// export function ExtendSuperclass<
// 	C extends abstract new (...args: any) => any,
// 	T extends InstanceType<C>,
// 	O extends C
// >(mod: Mod, cls: C, subclass?: O | ((old: { $old: T }) => O)): void {
// 	let superclass: C;
// 	let creator: (old: { $old: T }) => O;
// 	function superOverride(X) {
// 		let P = X.__proto__;
// 		let x = X.prototype;
// 		let p = x.__proto__;
// 		console.log({p,x,P,X})
// 		let xd = Object.getOwnPropertyDescriptors(x);
// 		delete xd.constructor;
// 		Object.defineProperties(p, xd);
// 		x.__proto__ = p.__proto__;
// 	}
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R5cGVzL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZQSxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQVc7SUFDakMsT0FBTyxpREFBaUQsR0FBRyxFQUFFLENBQUM7SUFDOUQsc0RBQXNEO0lBQ3RELCtFQUErRTtJQUMvRSwwQkFBMEI7SUFDMUIsaUVBQWlFO0FBQ2xFLENBQUM7QUFHRCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUc7SUFDeEIsYUFBYSxFQUFFLE1BQU0sT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUN4QyxPQUFPLEVBQUUsTUFBTSxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ2xDLFVBQVUsRUFBRSxNQUFNLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMzQyxRQUFRLEVBQUUsTUFBTSxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQ3ZDLFFBQVEsRUFBRSxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDdkMsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDLGVBQWUsQ0FBQztJQUN6QyxZQUFZLEVBQUUsTUFBTSxPQUFPLENBQUMsa0JBQWtCLENBQUM7Q0FDL0MsQ0FBQztBQUtGLE1BQU0sVUFBVSxNQUFNLENBQUMsQ0FBUztJQUMvQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEQ7SUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUlELE1BQU0sVUFBVSxRQUFRLENBRXRCLEdBQU0sRUFBRSxJQUFPLEVBQUUsRUFBMEI7SUFDNUMsSUFBSSxTQUFTLEdBQUcsSUFBYyxDQUFDO0lBQy9CLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7UUFBRSxTQUFTLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUM3RCxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBYyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUdELE1BQU0sVUFBVSxnQkFBZ0IsQ0FJOUIsR0FBUSxFQUFFLEdBQU0sRUFBRSxZQUEyQztJQUM5RCxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN6QyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO1lBQUUsT0FBTyxZQUFZLENBQUM7UUFDekQsT0FBUSxZQUEwQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQStDLFFBQVc7SUFDMUYsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztJQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3BCLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxPQUFRLEVBQVUsQ0FBQyxXQUFXLENBQUM7SUFDL0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDM0IsQ0FBQztBQUVELG9DQUFvQztBQUNwQyxpREFBaUQ7QUFDakQsOEJBQThCO0FBQzlCLGVBQWU7QUFDZixrQ0FBa0M7QUFDbEMsb0NBQW9DO0FBQ3BDLGlEQUFpRDtBQUNqRCw4QkFBOEI7QUFDOUIsZUFBZTtBQUNmLDBDQUEwQztBQUMxQyxvQ0FBb0M7QUFDcEMsaURBQWlEO0FBQ2pELDhCQUE4QjtBQUM5QixlQUFlO0FBQ2YsZ0VBQWdFO0FBR2hFLG9DQUFvQztBQUNwQyxpREFBaUQ7QUFDakQsOEJBQThCO0FBQzlCLGVBQWU7QUFDZix3RUFBd0U7QUFDeEUsc0JBQXNCO0FBQ3RCLHlDQUF5QztBQUV6QywrQkFBK0I7QUFDL0IseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsMkJBQTJCO0FBQzNCLGtEQUFrRDtBQUNsRCwyQkFBMkI7QUFDM0Isb0NBQW9DO0FBQ3BDLCtCQUErQjtBQUMvQixLQUFLO0FBR0wsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZCB9IGZyb20gXCIuLi9zaGFwZXouanNcIjtcclxuXHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcInNoYXBlei9nYW1lL2NvbXBvbmVudHMvaXRlbV9wcm9jZXNzb3JcIiB7XHJcblx0ZXhwb3J0IGludGVyZmFjZSBlbnVtSXRlbVByb2Nlc3NvclR5cGVzIHtcclxuXHRcdGZsaXBwZXI6ICdmbGlwcGVyJztcclxuXHRcdHByaW9yaXR5X2JhbGFuY2VyOiAncHJpb3JpdHlfYmFsYW5jZXInO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaDY0KGltZzogc3RyaW5nKSB7XHJcblx0cmV0dXJuIGBodHRwOi8vMTI3LjAuMC4xOjgwODAvc2hhcGVzdC13b3JraW5nL3Nwcml0ZXMvJHtpbWd9YDtcclxuXHQvLyBodHRwOi8vMTI3LjAuMC4xOjgwODAvc2hhcGVzdC13b3JraW5nL3Nwcml0ZXMvMS5wbmdcclxuXHQvLyBsZXQgciA9IGF3YWl0IGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODAvc2hhcGVzdC13b3JraW5nL3Nwcml0ZXMvJHtpbWd9YCk7XHJcblx0Ly8gbGV0IHQgPSBhd2FpdCByLnRleHQoKTtcclxuXHQvLyByZXR1cm4gYGRhdGE6aW1hZ2UvJHtpbWcuc3BsaXQoJy4nKS5wb3AoKX07YmFzZTY0LCR7YnRvYSh0KX1gO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IFJFU09VUkNFUyA9IHtcclxuXHRcImZsaXBwZXIucG5nXCI6IGF3YWl0IGZldGNoNjQoJ2ZsaXAucG5nJyksXHJcblx0ZmxpcHBlcjogYXdhaXQgZmV0Y2g2NCgnZmxpcC5wbmcnKSxcclxuXHRmbGlwX3doaXRlOiBhd2FpdCBmZXRjaDY0KCdmbGlwX3doaXRlLnBuZycpLFxyXG5cdHJvdGF0ZTMxOiBhd2FpdCBmZXRjaDY0KCdyb3RhdGUzMS5wbmcnKSxcclxuXHRyb3RhdGUzMjogYXdhaXQgZmV0Y2g2NCgncm90YXRlMzIucG5nJyksXHJcblx0c3BsaXR0ZXIxOiBhd2FpdCBmZXRjaDY0KCdzcGxpdHRlcjEucG5nJyksXHJcblx0dHV0X3BhaW50ZXIyOiBhd2FpdCBmZXRjaDY0KCd0dXRfcGFpbnRlcjIucG5nJyksXHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyVG9IKHM6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0bGV0IGhhc2ggPSAwO1xyXG5cdGZvciAobGV0IGMgb2Ygcykge1xyXG5cdFx0aGFzaCA9ICgoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGMuY2hhckNvZGVBdCgwKSkgfCAwO1xyXG5cdH1cclxuXHRyZXR1cm4gaGFzaC50b1N0cmluZygxNik7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG92ZXJyaWRlPFxyXG5cdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LCBUIGV4dGVuZHMgSW5zdGFuY2VUeXBlPEM+LCBLIGV4dGVuZHMga2V5b2YgVFxyXG4+KGNsczogQywgbmFtZTogSywgZm46IChvbGRGbk5hbWU6IEspID0+IFRbS10pIHtcclxuXHRsZXQgb2xkRm5OYW1lID0gbmFtZSBhcyBzdHJpbmc7XHJcblx0d2hpbGUgKGNscy5wcm90b3R5cGVbb2xkRm5OYW1lXSkgb2xkRm5OYW1lID0gJ18nICsgb2xkRm5OYW1lO1xyXG5cdGNscy5wcm90b3R5cGVbb2xkRm5OYW1lXSA9IGNscy5wcm90b3R5cGVbbmFtZV07XHJcblx0Y2xzLnByb3RvdHlwZVtuYW1lXSA9IGZuKG9sZEZuTmFtZSBhcyBLKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzPFxyXG5cdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LFxyXG5cdFQgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8Qz4sXHJcblx0TyBleHRlbmRzIENcclxuPihtb2Q6IE1vZCwgY2xzOiBDLCBtYWtlU3ViY2xhc3M6IE8gfCAoKG9sZDogeyAkb2xkOiBUIH0pID0+IE8pKSB7XHJcblx0bW9kLm1vZEludGVyZmFjZS5leHRlbmRDbGFzcyhjbHMsIChvbGQpID0+IHtcclxuXHRcdGlmIChjbHMuaXNQcm90b3R5cGVPZihtYWtlU3ViY2xhc3MpKSByZXR1cm4gbWFrZVN1YmNsYXNzO1xyXG5cdFx0cmV0dXJuIChtYWtlU3ViY2xhc3MgYXMgKChvbGQ6IHsgJG9sZDogVCB9KSA9PiBPKSkob2xkKS5wcm90b3R5cGU7XHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzMjxDIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueT4oc3ViY2xhc3M6IEMpIHtcclxuXHRsZXQgeCA9IHN1YmNsYXNzLnByb3RvdHlwZTtcclxuXHRsZXQgcCA9IHguX19wcm90b19fO1xyXG5cdGxldCB4ZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHgpO1xyXG5cdGRlbGV0ZSAoeGQgYXMgYW55KS5jb25zdHJ1Y3RvcjtcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwLCB4ZCk7XHJcblx0eC5fX3Byb3RvX18gPSBwLl9fcHJvdG9fXztcclxufVxyXG5cclxuLy8gZXhwb3J0IGZ1bmN0aW9uIEV4dGVuZFN1cGVyY2xhc3M8XHJcbi8vIFx0QyBleHRlbmRzIGFic3RyYWN0IG5ldyAoLi4uYXJnczogYW55KSA9PiBhbnksXHJcbi8vIFx0VCBleHRlbmRzIEluc3RhbmNlVHlwZTxDPixcclxuLy8gXHRPIGV4dGVuZHMgQ1xyXG4vLyA+KG1vZDogTW9kLCBzdWJjbGFzczogTyk6IHZvaWQ7XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzPFxyXG4vLyBcdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LFxyXG4vLyBcdFQgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8Qz4sXHJcbi8vIFx0TyBleHRlbmRzIENcclxuLy8gPihtb2Q6IE1vZCwgY2xzOiBDLCBzdWJjbGFzczogTyk6IHZvaWQ7XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzPFxyXG4vLyBcdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LFxyXG4vLyBcdFQgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8Qz4sXHJcbi8vIFx0TyBleHRlbmRzIENcclxuLy8gPihtb2Q6IE1vZCwgY2xzOiBDLCBzdWJjbGFzczogKG9sZDogeyAkb2xkOiBUIH0pID0+IE8pOiB2b2lkO1xyXG5cclxuXHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzPFxyXG4vLyBcdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LFxyXG4vLyBcdFQgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8Qz4sXHJcbi8vIFx0TyBleHRlbmRzIENcclxuLy8gPihtb2Q6IE1vZCwgY2xzOiBDLCBzdWJjbGFzcz86IE8gfCAoKG9sZDogeyAkb2xkOiBUIH0pID0+IE8pKTogdm9pZCB7XHJcbi8vIFx0bGV0IHN1cGVyY2xhc3M6IEM7XHJcbi8vIFx0bGV0IGNyZWF0b3I6IChvbGQ6IHsgJG9sZDogVCB9KSA9PiBPO1xyXG5cclxuLy8gXHRmdW5jdGlvbiBzdXBlck92ZXJyaWRlKFgpIHtcclxuLy8gXHRcdGxldCBQID0gWC5fX3Byb3RvX187XHJcbi8vIFx0XHRsZXQgeCA9IFgucHJvdG90eXBlO1xyXG4vLyBcdFx0bGV0IHAgPSB4Ll9fcHJvdG9fXztcclxuLy8gXHRcdGNvbnNvbGUubG9nKHtwLHgsUCxYfSlcclxuLy8gXHRcdGxldCB4ZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHgpO1xyXG4vLyBcdFx0ZGVsZXRlIHhkLmNvbnN0cnVjdG9yO1xyXG4vLyBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMocCwgeGQpO1xyXG4vLyBcdFx0eC5fX3Byb3RvX18gPSBwLl9fcHJvdG9fXztcclxuLy8gXHR9XHJcblxyXG5cclxuLy8gfSJdfQ==