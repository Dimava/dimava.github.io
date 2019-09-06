(() => {
	function q(selector, node) {
		return (node||this).querySelector(selector);
	}
	function qq(selector, node) {
		return [...(node||this).querySelectorAll(selector)];
	}
	Node.prototype.q = q;
	Node.prototype.qq = qq;

	window.q = function (selector, node) {
		return document.q(selector, node);
	}
	window.qq = function (selector, node) {
		return document.qq(selector, node);
	}

	Node.prototype.appendTo = function (e) {
		e.append(this);
		return this;
	}
})();