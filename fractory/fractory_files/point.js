
Point = Ice.$extend('Point', {
	__init__: function(x, y) {
		if(!_.has(x, 'left')) {
			this.x = this.left = x;
			this.y = this.top = y;
		} else {
			this.x = this.left = x.left;
			this.y = this.top = x.top;
		}

	},
	center: function() {
		return new Point(this.x/2, this.y/2);
	},
	plus: function(x, y) {
		if(y === undefined) {
			if(x.$class === Point) {
				return new Point(this.x + x.x, this.y + x.y);
			}

			return new Point(this.x + x, this.y + x);
		}
		return new Point(this.x + x, this.y + y);
	},
	negative: function() {
		return new Point(-1 * this.x, -1 * this.y);
	},
	translate: function(degrees, dist) {
		return this.plus(dist * Trig.cosd(degrees), dist * -1 * Trig.sind(degrees));
	},
	lt: function() {
		return {left: this.x, top: this.y};
	},
	size: function() {
		return {width: this.x, height: this.y};
	},
	times: function(mult) {
		return new Point(this.x * mult, this.y * mult);
	}
});

Point.fromSize = function(element) {
	var $e = $(element);
	return new Point($e.width(), $e.height());
}
Point.zero = new Point(0,0);
