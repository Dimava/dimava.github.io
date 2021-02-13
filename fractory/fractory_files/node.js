
Node = InventorySlot.$extend('Node', {
	__init__: function(shell, loc) {
		var self = this;

		self.$super();
		self.shell = shell;
		self.loc = loc;


		// This will always be behind the generator's picture.

		self.elsize = new Point(60, 60);

		self.neighbors = {};
		self.links = {};
		self.junctions = {};

		// self.part = ko.observable(null);

		self.label2 = ko.observable('abc');
		self.order = ko.observable(null);

		var shell_ctr = self.shell.elsize.center();
		var dist = Link.distance;
		var pt = shell_ctr;
		var coord = new Point(3,3);  //self is the center point.

		// console.log('pt == ', pt);

		var translations = Node.translations[self.loc];
		_.each(translations, function(dir) {
			pt = pt.translate(Node.directions[dir], dist);
			coord = coord.plus(Node.coord_translations[dir]);
		});



		self.coord = coord;
		self.ctr = pt;
		pt = pt.plus(self.elsize.center().negative());
		self.pos = pt;


	},
	apply_order: function() {
		var self = this;
		if(self.part() && self.part().shell && self.part().shell()) {
			return; // No order on fractals.
		}

        self.order(0);
        self.label2(0);

        var crawl_list = [self];
        for(var pos = 0; pos < crawl_list.length; pos++) {
            var node = crawl_list[pos];
            // console.log("Applying order from ", node.loc, " with order ", node.order());
            var active_links = _.filter(node.links, function(link) {
                if(!link.active()) {
                    link.flow('inactive');
                    if(link.pair_link()) {
                        link.pair_link().flow('inactive');
                    }
                }
                return link.active();
            });
            _.each(active_links, function(link) {
                if(!link.active()) return;

                var linked_to = link.link_node();
                if(linked_to && linked_to.order() === null) {
                    linked_to.order(node.order() + 1);
                    linked_to.label2(linked_to.order());
                    // console.log("Pushing ", linked_to.loc, " on to crawl.");
                    crawl_list.push(linked_to);
                }
                // console.log("Syncing flow");
                var flow = null;
                if(!linked_to) {
                    flow = null;
                    link.flow(null);
                } else if(linked_to.order() > node.order()) {
                    flow = 'down';
                    link.flow('down');
                } else if(linked_to.order() < node.order()) {
                    flow = 'up';
                    link.flow('up');
                } else {
                    flow = 'side';
                    link.flow('side');
                }

                _.each(link.congruent_links(), function(l) {
                    if(l.direction() === link.direction()) {
                        l.flow(flow);
                    } else {
                        l.flow({
                            'down': 'up',
                            'up': 'down',
                        }[flow] || flow)
                    }
                });


            });
        }
        return crawl_list;
	},

	is_adjacent: function(node) {
		var diff = node.coord.plus(this.coord.negative());
		var dir = null;

		_.find(Node.coord_translations, function(v, i, l) {
			if(diff.x == v.x && diff.y == v.y) {
				dir = i;
				return true;
			}
		});

		return dir;
	},
	raph: function(element, raph) {
		var self = this;

		if(!raph) {
			raph = Raphael(element, self.elsize.x, self.elsize.y);
			raph.label = raph.text(self.elsize.x/2, self.elsize.y/2)
			raph.label2 = raph.text(self.elsize.x/2, self.elsize.y/2 + 10);
			raph.outline = raph.path();
		}
		var poly = poly_path(self.elsize.center(), 28, 6, Math.PI/2);
		raph.outline.attr('path', poly);
        raph.outline.attr('stroke', 'rgba(128,128,128)');
        raph.outline.attr('stroke-width', '1.5');
        raph.outline.attr('fill', '#272822');
		raph.label.attr('text', self.loc);
		raph.label2.attr('text', self.label2());

		return raph;
	},
    tap: function(event) {
        var self = this;
        //console.log("event is ", event);

    },
    right_click: function(event) {
        var self = this;
        //console.log("right click on node");
        event.stopPropagation();
        self.double_tap(event);
    },
    double_tap: function(event) {
        var self = this;
        //console.log("double tap on node");
        event.stopPropagation();

        if(self.part()) {
            if(Ice.isa(self.part(), FractalPart)) {
                if(game.animating_shell()) return;
                if(event.shiftKey) {
                    game.move_to_empty_slot(self.part());
                    return;
                }
                game.zoom_to_fractal(self.part());

            } else {
                game.move_to_empty_slot(self.part());

            }
        } else {
            if(event.shiftKey) {
                var chosen = game.chosen_shop_slot();
                if(!chosen) return;
                if(!chosen.part()) return;
                self.set_part(chosen.part());
                return;
            } else if(event.ctrlKey) {
                var part = game.last_moved_part();
                if(!part) return;
                if(!part.container()) return;
                self.set_part(part);
                game.hovered_part(part);
                return;
            }
            var filled = _.find(game.inventory_slots(), function(is) {
                return is.part();
            });
            if(!filled) return;

            self.set_part(filled.part());
        }
        //console.log("Done doubletapping");
    },


});

function generate_hex_fills(center, radius, sides, rot) {
	var rot = rot || 0;
	var paths = [];
	var pts = [];
	for(var i = 0; i < sides; i ++) {
		var angle = Trig.twopi * i / sides - Trig.pi * 0.5 + rot;
		var y = Trig.sin(angle) * radius * -1;
		var x = Trig.cos(angle) * radius;
		pts.push(center.plus(x, y));
	}
	for(i = 0; i < sides; i ++) {
		var cmds = [
			'M',
			center.x,
			center.y,
			'L',
			pts[i].x,
			pts[i].y,
			'L',
			pts[(i+1) % sides].x,
			pts[(i+1) % sides].y,
			'Z'
		];
		var path = cmds.join(' ');
		paths.push(path);
	}
	return paths;
}

function poly_path(center, radius, sides, rot) {
    //console.log('poly path: ', center, radius, sides);
    rot = rot || 0;
    var cmds = [];
    // remember, ys are inversed here.
    var pts = [];
    for(var i=0;i<sides;i++) {

        var angle = Trig.twopi * i / sides - Trig.pi * 0.5 + rot;
        //console.log(angle);
        var y = Trig.sin(angle) * radius * -1;
        var x = Trig.cos(angle) * radius;
        pts.push(center.plus(x, y));
    }
    _.each(pts, function(pt) {
        if(!cmds.length) {
            cmds.push('M');
        } else {
            cmds.push('L');
        }
        cmds.push(pt.x);
        cmds.push(pt.y);
    });
    cmds.push('Z');

    var path = cmds.join(' ');
    // console.log(path);
    return path;


}



ko.bindingHandlers.raphael = {
	init: function(element, valueAccessor) {
		var raph = valueAccessor()(element, null);
		$(element).data('raph', raph);
	},
	update: function(element, valueAccessor) {
		//console.log("update called with ", arguments);
		var raph = $(element).data('raph');
		valueAccessor()(element, raph);
	},
	dispose: function(element, valueAccessor) {
		var raph = $(element).data('raph');
		raph.clear();
		$(element).removeChild(raph.canvas);
		$(element).removeData('raph');

	}
}

ko.bindingHandlers.dropzone = {
	init: function(element, valueAccessor) {
		// console.log("Setting up dropzone");
		var va = valueAccessor();

		var itx = interact(element).dropzone(va);
		if(va.ondropenter) {
			itx.on('dropenter', va.ondropenter);
		}
		if(va.ondropleave) {
			itx.on('dropleave', va.ondropleave);
		}
	},
	dispose: function(element, valueAccessor) {
		// console.log("Disposing dropzone");
		interact(element).unset();
	}
}
ko.bindingHandlers.draggable = {
	init: function(element, valueAccessor) {
		// console.log("Setting up draggable");
		interact(element).draggable(valueAccessor()).dragObject = valueAccessor().dragObject;
	},
	dispose: function(element, valueAccessor) {
		// console.log("Disposing draggable");
		interact(element).unset();

	}
}
// WHICH = 1;

ko.bindingHandlers.qtip_template = {
    init: function(element, valueAccessor, allBindingsAccessor, data, context) {
        //init logic
        var qtip_options = valueAccessor().qtip || {};
        var $el = $(element);
        qtip_options.events = qtip_options.events || {};
        var inside_render = qtip_options.events.render;

        var counter = ko.bindingHandlers.qtip_template.COUNTER + 1;
        ko.bindingHandlers.qtip_template.COUNTER += 1;

        // if(qtip_options.content && qtip_options.content.title) {
        //     qtip_options.content.title = WHICH + ' ' + qtip_options.content.title;
        // }

        var kill_obs = ko.observable(false);
        var qtobs = ko.computed(function() {
            if(kill_obs()) return undefined;
            // console.log("Recalculating qtobs");
            // console.trace();
            return valueAccessor()
        });
        // console.log("Generating qtip on ", qtobs().data.ICEID, qtobs().data.container().loc);

        qtip_options.events.render = function(event, api) {
        	// console.log(counter, "qtip render, kill obs is ", kill_obs());;
        	  $(api.elements.content).html("<!-- ko if: templateargs() --><!-- ko template: templateargs() --><!-- /ko --><!-- /ko -->") // The container.
        	  // console.log("api.elements is ", api.elements);
        	  ko.applyBindings({
        	  	  'templateargs': qtobs
        	  }, api.elements.content[0]);
        }
        $el.qtip(qtip_options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        	// console.log(counter, "Destroying qtip on ", qtobs().data.ICEID);
              kill_obs(true);
              // console.log(counter, "Force hiding?");
              var api = $(element).qtip("api");
              //_.defer(function() {
                    // console.log(counter, "Deferred call");
                    api.toggle(false);
                    api.destroy(true);
                //});
              // var api = $(element).qtip('api');
              // //ko.cleanNode(api.elements.content);
              // ko.removeNode(api.elements.content);
           //    $(api.elements.content).html('');


              //$(api.elements.content)
         });

    },
    update: function(element, valueAccessor, allBindingsAccessor, data, context) {
       //update logic
    },
    dispose: function(element) {
    	//console.log(counter, "Destroying qtip some more?");
        $(element).qtip("potato");
    	$(element).qtip('destroy');
    }
};
ko.bindingHandlers.qtip_template.COUNTER = 0;

ko.bindingHandlers.progressbar = {
    init: function(element, valueAccessor, allBindingsAccessor, data, context) {
        //init logic
        //console.trace();
        var $el = $(element);
        var options = valueAccessor();
        // $el.data('loc', options.part.node.peek().loc);
        // console.log("progressbar INIT", options.part.ICEID, options.part.container.peek().loc);

    },
    update: function(element, valueAccessor, allBindingsAccessor, data, context) {
       //update logic;
        var options = valueAccessor();
        var $el = $(element);
        // var part = options.part;
        // var loc = part.container() ? part.container().loc : null;


        var old_subs = $el.data('progressbar_subs') || false;
       // console.log("progressbar update", part.ICEID, loc);;
        if(old_subs) {
            // console.log("Disposing old subs", $el.data('loc'));;
            old_subs.sub1.dispose();
            old_subs.sub2.dispose();
        }

        /// XXX: Memory leak here?
        var value = ko.computed(options.value);
        var max = ko.computed(options.max);

        options.value = value.peek();
        options.max = max.peek();

        // console.log("Creating progressbar on ", element);
        $el.progressbar(options);

         // console.log("progressbar subscribing", part.ICEID, loc);;

        var sub1 = value.subscribe(function() {
            // console.log("Updating value ", part.ICEID, $el.data('loc'), loc, $el[0]);
            $el.progressbar('value', value());
        });

        var sub2 = max.subscribe(function() {
            $el.progressbar('option', 'max', max());
        });

        var progressbar_subs = {
            'sub1': sub1,
            'sub2': sub2,
        }

        // console.log("in progressbar part is ", part);
        if(!old_subs) {

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                if($el[0] !== element) return;
                // console.log("Unsubscribing", part? part.ICEID: null, loc);
                // console.log("Destroying progressbar on ", element);
                  $(element).progressbar("destroy");
                  sub1.dispose();
                  sub2.dispose();
             });
        }

        //console.log("End update");
    },
    dispose: function(element) {
            //console.log("Disposing old subs 3");
    	// $(element).progressbar('destroy');
                var old_subs = $el.data('progressbar_subs') || false;
        if(old_subs) {
            // console.log("Disposing old subs4", $(element).data('loc'));;
            old_subs.sub1.dispose();
            old_subs.sub2.dispose();
        }
    }
};

Node.directions = {
	'e': 0,
	'ne': 60,
	'nw': 120,
	'w': 180,
	'sw': 240,
	'se': 300,
};

Node.coord_translations = {
	'e': new Point(1, 0),
	'w': new Point(-1, 0),
	'ne': new Point(0, -1),
	'nw': new Point(-1, -1),
	'se': new Point(1, 1),
	'sw': new Point(0, 1)
}

Node.locations = [
	'ctr',
	'e',
	'ne',
	'nw',
	'w',
	'sw',
	'se',
	'e2',
	'ene',
	'ne2',
	'n',
	'nw2',
	'wnw',
	'w2',
	'wsw',
	'sw2',
	's',
	'se2',
	'ese'
]

Node.translations = {
    ctr: [],
	e: ['e'],
	ne: ['ne'],
	nw: ['nw'],
	w: ['w'],
	sw: ['sw'],
	se: ['se'],
	e2: ['e','e'],
	ene: ['e','ne'],
	ne2: ['ne','ne'],
	n: ['ne', 'nw'],
	nw2: ['nw', 'nw'],
	wnw: ['w', 'nw'],
	w2: ['w', 'w'],
	wsw: ['w', 'sw'],
	sw2: ['sw', 'sw'],
	s: ['se', 'sw'],
	se2: ['se', 'se'],
	ese: ['e', 'se']
};


Node.opposites = {
	e: 'w',
	ne: 'sw',
	nw: 'se',
	w: 'e',
	sw: 'ne',
	se: 'nw'
};
