
Trig = {};
_.each(['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'asin', 'acos', 'atan'], function(i){
	Trig[i] = Math[i];
	Trig[i + 'd'] = function(deg) {
		var rads = deg * Math.PI /  180.0;
		return Math[i](rads);
	};
});

Trig.pi = Trig.Pi = Trig.PI = Math.PI;
Trig.twopi = 2 * Trig.pi;


Trig.measure_magnitude = function(x, y) {
    return Math.sqrt(x*x + y*y);
};

Trig.measure_angle = function(x,y) {
    if(x === 0) return y < 0 ? Math.PI * 1.5 : y > 0 ? Math.PI * 0.5 : 0;

    return Trig.atan(y/x) + (
        x < 0 ? Math.PI : (
            y < 0 ? 2 * Math.PI : 0
            )
    );
};

Trig.add_angular_vectors = function(s1, d1, s2, d2) {
    var x1 = Trig.cos(d1) * s1;
    var y1 = Trig.sin(d1) * s1;

    var x2 = Trig.cos(d2) * s2;
    var y2 = Trig.sin(d2) * s2;

    var d = Trig.measure_angle(x1+x2, y1+y2);
    var speed = Trig.measure_magnitude(x1+x2, y1+y2);
    return {speed:speed, direction:d};
};

console.log("Setting trig's pi");
Trig.pi = Trig.Pi = Trig.PI = Math.PI;
Trig.twopi = 2 * Trig.pi;
