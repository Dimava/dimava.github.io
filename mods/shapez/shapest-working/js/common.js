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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZQSxNQUFNLFVBQVUsTUFBTSxDQUFDLENBQVM7SUFDL0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BEO0lBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFJRCxNQUFNLFVBQVUsUUFBUSxDQUV0QixHQUFNLEVBQUUsSUFBTyxFQUFFLEVBQTBCO0lBQzVDLElBQUksU0FBUyxHQUFHLElBQWMsQ0FBQztJQUMvQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQUUsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUM7SUFDN0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQWMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFHRCxNQUFNLFVBQVUsZ0JBQWdCLENBSTlCLEdBQVEsRUFBRSxHQUFNLEVBQUUsWUFBMkM7SUFDOUQsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDekMsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztZQUFFLE9BQU8sWUFBWSxDQUFDO1FBQ3pELE9BQVEsWUFBMEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUErQyxRQUFXO0lBQ3ZGLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNwQixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsT0FBUSxFQUFVLENBQUMsV0FBVyxDQUFDO0lBQy9CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzlCLENBQUM7QUFFRCxvQ0FBb0M7QUFDcEMsaURBQWlEO0FBQ2pELDhCQUE4QjtBQUM5QixlQUFlO0FBQ2Ysa0NBQWtDO0FBQ2xDLG9DQUFvQztBQUNwQyxpREFBaUQ7QUFDakQsOEJBQThCO0FBQzlCLGVBQWU7QUFDZiwwQ0FBMEM7QUFDMUMsb0NBQW9DO0FBQ3BDLGlEQUFpRDtBQUNqRCw4QkFBOEI7QUFDOUIsZUFBZTtBQUNmLGdFQUFnRTtBQUdoRSxvQ0FBb0M7QUFDcEMsaURBQWlEO0FBQ2pELDhCQUE4QjtBQUM5QixlQUFlO0FBQ2Ysd0VBQXdFO0FBQ3hFLHNCQUFzQjtBQUN0Qix5Q0FBeUM7QUFFekMsK0JBQStCO0FBQy9CLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLDJCQUEyQjtBQUMzQixrREFBa0Q7QUFDbEQsMkJBQTJCO0FBQzNCLG9DQUFvQztBQUNwQywrQkFBK0I7QUFDL0IsS0FBSztBQUdMLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2QgfSBmcm9tIFwiLi9zaGFwZXouanNcIjtcclxuXHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcInNoYXBlei9nYW1lL2NvbXBvbmVudHMvaXRlbV9wcm9jZXNzb3JcIiB7XHJcblx0ZXhwb3J0IGludGVyZmFjZSBlbnVtSXRlbVByb2Nlc3NvclR5cGVzIHtcclxuXHRcdGZsaXBwZXI6ICdmbGlwcGVyJztcclxuXHRcdHByaW9yaXR5X2JhbGFuY2VyOiAncHJpb3JpdHlfYmFsYW5jZXInO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyVG9IKHM6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0bGV0IGhhc2ggPSAwO1xyXG5cdGZvciAobGV0IGMgb2Ygcykge1xyXG5cdFx0aGFzaCA9ICgoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGMuY2hhckNvZGVBdCgwKSkgfCAwO1xyXG5cdH1cclxuXHRyZXR1cm4gaGFzaC50b1N0cmluZygxNik7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG92ZXJyaWRlPFxyXG5cdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LCBUIGV4dGVuZHMgSW5zdGFuY2VUeXBlPEM+LCBLIGV4dGVuZHMga2V5b2YgVFxyXG4+KGNsczogQywgbmFtZTogSywgZm46IChvbGRGbk5hbWU6IEspID0+IFRbS10pIHtcclxuXHRsZXQgb2xkRm5OYW1lID0gbmFtZSBhcyBzdHJpbmc7XHJcblx0d2hpbGUgKGNscy5wcm90b3R5cGVbb2xkRm5OYW1lXSkgb2xkRm5OYW1lID0gJ18nICsgb2xkRm5OYW1lO1xyXG5cdGNscy5wcm90b3R5cGVbb2xkRm5OYW1lXSA9IGNscy5wcm90b3R5cGVbbmFtZV07XHJcblx0Y2xzLnByb3RvdHlwZVtuYW1lXSA9IGZuKG9sZEZuTmFtZSBhcyBLKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzPFxyXG5cdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LFxyXG5cdFQgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8Qz4sXHJcblx0TyBleHRlbmRzIENcclxuPihtb2Q6IE1vZCwgY2xzOiBDLCBtYWtlU3ViY2xhc3M6IE8gfCAoKG9sZDogeyAkb2xkOiBUIH0pID0+IE8pKSB7XHJcblx0bW9kLm1vZEludGVyZmFjZS5leHRlbmRDbGFzcyhjbHMsIChvbGQpID0+IHtcclxuXHRcdGlmIChjbHMuaXNQcm90b3R5cGVPZihtYWtlU3ViY2xhc3MpKSByZXR1cm4gbWFrZVN1YmNsYXNzO1xyXG5cdFx0cmV0dXJuIChtYWtlU3ViY2xhc3MgYXMgKChvbGQ6IHsgJG9sZDogVCB9KSA9PiBPKSkob2xkKS5wcm90b3R5cGU7XHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzMjxDIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueT4oc3ViY2xhc3M6IEMpICB7XHJcbiAgICBsZXQgeCA9IHN1YmNsYXNzLnByb3RvdHlwZTtcclxuICAgIGxldCBwID0geC5fX3Byb3RvX187XHJcbiAgICBsZXQgeGQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh4KTtcclxuICAgIGRlbGV0ZSAoeGQgYXMgYW55KS5jb25zdHJ1Y3RvcjtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHAsIHhkKTtcclxuICAgIHguX19wcm90b19fID0gcC5fX3Byb3RvX187XHJcbn1cclxuXHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBFeHRlbmRTdXBlcmNsYXNzPFxyXG4vLyBcdEMgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55LFxyXG4vLyBcdFQgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8Qz4sXHJcbi8vIFx0TyBleHRlbmRzIENcclxuLy8gPihtb2Q6IE1vZCwgc3ViY2xhc3M6IE8pOiB2b2lkO1xyXG4vLyBleHBvcnQgZnVuY3Rpb24gRXh0ZW5kU3VwZXJjbGFzczxcclxuLy8gXHRDIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueSxcclxuLy8gXHRUIGV4dGVuZHMgSW5zdGFuY2VUeXBlPEM+LFxyXG4vLyBcdE8gZXh0ZW5kcyBDXHJcbi8vID4obW9kOiBNb2QsIGNsczogQywgc3ViY2xhc3M6IE8pOiB2b2lkO1xyXG4vLyBleHBvcnQgZnVuY3Rpb24gRXh0ZW5kU3VwZXJjbGFzczxcclxuLy8gXHRDIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueSxcclxuLy8gXHRUIGV4dGVuZHMgSW5zdGFuY2VUeXBlPEM+LFxyXG4vLyBcdE8gZXh0ZW5kcyBDXHJcbi8vID4obW9kOiBNb2QsIGNsczogQywgc3ViY2xhc3M6IChvbGQ6IHsgJG9sZDogVCB9KSA9PiBPKTogdm9pZDtcclxuXHJcblxyXG4vLyBleHBvcnQgZnVuY3Rpb24gRXh0ZW5kU3VwZXJjbGFzczxcclxuLy8gXHRDIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueSxcclxuLy8gXHRUIGV4dGVuZHMgSW5zdGFuY2VUeXBlPEM+LFxyXG4vLyBcdE8gZXh0ZW5kcyBDXHJcbi8vID4obW9kOiBNb2QsIGNsczogQywgc3ViY2xhc3M/OiBPIHwgKChvbGQ6IHsgJG9sZDogVCB9KSA9PiBPKSk6IHZvaWQge1xyXG4vLyBcdGxldCBzdXBlcmNsYXNzOiBDO1xyXG4vLyBcdGxldCBjcmVhdG9yOiAob2xkOiB7ICRvbGQ6IFQgfSkgPT4gTztcclxuXHRcclxuLy8gXHRmdW5jdGlvbiBzdXBlck92ZXJyaWRlKFgpIHtcclxuLy8gXHRcdGxldCBQID0gWC5fX3Byb3RvX187XHJcbi8vIFx0XHRsZXQgeCA9IFgucHJvdG90eXBlO1xyXG4vLyBcdFx0bGV0IHAgPSB4Ll9fcHJvdG9fXztcclxuLy8gXHRcdGNvbnNvbGUubG9nKHtwLHgsUCxYfSlcclxuLy8gXHRcdGxldCB4ZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHgpO1xyXG4vLyBcdFx0ZGVsZXRlIHhkLmNvbnN0cnVjdG9yO1xyXG4vLyBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMocCwgeGQpO1xyXG4vLyBcdFx0eC5fX3Byb3RvX18gPSBwLl9fcHJvdG9fXztcclxuLy8gXHR9XHJcblxyXG5cclxuLy8gfSJdfQ==