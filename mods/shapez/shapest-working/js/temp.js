"use strict";
// function clamp(n: number, min: number, max: number): number; // <- overload 1
// function clamp(n: BigNumber, min: BigNumber, max: BigNumber): BigNumber; // <- overload 2
function clamp(n, min, max) {
    return n; // example impl
}
function isNumber(v) { return true; }
// function clamp<T extends number | BigNumber  // <- default type
// >(n: T, min: T, max: T): T {
//     return n;
// }
// let x = 123;
let x = 123;
clamp(x, x, x); // <- you see
// function f() {}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFLQSxnRkFBZ0Y7QUFDaEYsNEZBQTRGO0FBQzVGLFNBQVMsS0FBSyxDQUFDLENBQU0sRUFBRSxHQUFRLEVBQUUsR0FBUTtJQUNyQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWU7QUFDN0IsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLENBQU0sSUFBZ0IsT0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFDO0FBRXJELGtFQUFrRTtBQUNsRSwrQkFBK0I7QUFFL0IsZ0JBQWdCO0FBQ2hCLElBQUk7QUFFSixlQUFlO0FBRWYsSUFBSSxDQUFDLEdBQXVCLEdBQUcsQ0FBQztBQUNoQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWE7QUFFN0Isa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5cclxudHlwZSBCaWdOdW1iZXIgPSBzdHJpbmc7XHJcblxyXG4vLyBmdW5jdGlvbiBjbGFtcChuOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlcjsgLy8gPC0gb3ZlcmxvYWQgMVxyXG4vLyBmdW5jdGlvbiBjbGFtcChuOiBCaWdOdW1iZXIsIG1pbjogQmlnTnVtYmVyLCBtYXg6IEJpZ051bWJlcik6IEJpZ051bWJlcjsgLy8gPC0gb3ZlcmxvYWQgMlxyXG5mdW5jdGlvbiBjbGFtcChuOiBhbnksIG1pbjogYW55LCBtYXg6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gbjsgLy8gZXhhbXBsZSBpbXBsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTnVtYmVyKHY6IGFueSk6IHYgaXMgbnVtYmVyIHtyZXR1cm4gdHJ1ZTt9XHJcblxyXG4vLyBmdW5jdGlvbiBjbGFtcDxUIGV4dGVuZHMgbnVtYmVyIHwgQmlnTnVtYmVyICAvLyA8LSBkZWZhdWx0IHR5cGVcclxuLy8gPihuOiBULCBtaW46IFQsIG1heDogVCk6IFQge1xyXG5cdFxyXG4vLyAgICAgcmV0dXJuIG47XHJcbi8vIH1cclxuXHJcbi8vIGxldCB4ID0gMTIzO1xyXG5cclxubGV0IHg6IG51bWJlciB8IEJpZ051bWJlciA9IDEyMztcclxuY2xhbXAoeCwgeCwgeCk7IC8vIDwtIHlvdSBzZWVcclxuXHJcbi8vIGZ1bmN0aW9uIGYoKSB7fVxyXG4iXX0=