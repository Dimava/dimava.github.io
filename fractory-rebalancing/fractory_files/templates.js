TemplateManager = Class.$extend({
	__init__: function(selector) {
		var self = this;
		this.lib = {};
		this.html_templates = $('.html_templates');
		_.each(this.html_templates.children('div'), function(v, i, l) {
			v = $(v);
			var id = v.attr('id');
			self.lib[id] = v;
		});
		this.__inited__ = true;

	},
	clone: function(id, obj) {
		if(!this.__inited__) {
			this.init();
		}
		var tpl = this.lib[id];
		var $el = $(tpl).clone();
		TemplateManager.bind_element($el, obj);
		return $el;
	}

});

TemplateManager.clone_from_html = function(html, obj) {
	debug = html;
	var $el = $(html);
	TemplateManager.bind_element($el, obj);
	return $el;
}
TemplateManager.bind_element = function($el, obj) {
	$el.data('obj', obj||null);
	if(obj) {
        _.each($el.find('[id]'), function(child) {
		    var id = child.id;
		    obj['$' + id] = $(child);
		});
	}
}
