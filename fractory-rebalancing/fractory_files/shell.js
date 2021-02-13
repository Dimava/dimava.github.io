
Shell = Ice.$extend('Shell', {
	__init__: function() {
		var self = this;
		// Size is either 'large' or 'medium'

		self.size = ko.observable('large');
		self.edge_suffix = ko.computed(function() {
			return self.size() === 'large' ? '2' : '';
		});
		self.elsize = new Point(720, 640);
		self.nodes = {};

		self.in_part = ko.observable(null);
		self.construct_nodes();
		self.zoom_in = ko.observable(false);
		self.zoom_out = ko.observable(false);
		self.fade_out = ko.observable(false);
		self.fade_in = ko.observable(false);
		self.drawn = ko.observable(true);

		self.name = ko.observable('Shell');
		self.depth = ko.observable(1);

		self.draw_event = ko.observable(false);

	},
	__keys__: function() {
		return this.$super().concat(['size', 'name']);
	},
	update_from_jsonable: function(jsonable) {
		var self = this;
		self.$super(jsonable);
		//console.log("Loading shell ", self.name());
		_.each(jsonable.links, function(link) {
			var node =  self.nodes[link.loc];
			var link = node.links[link.dir];
			//console.log("Loading to on ", link.text());
			link.active(true);
			if(link.pair_link()) link.pair_link().active(true);
		});
		_.each(jsonable.parts, function(part, loc) {
			self.nodes[loc].set_part(part, true);
		});
		if(Ice.isa(self.nodes.ctr.part(), CorePart)) {
			self.refresh_all_flow();
		}
	},
	as_jsonable: function() {
		var self = this;
		var jsonable = self.$super();
		jsonable.parts = {};
		jsonable.links = [];
		_.each(self.nodes, function(node, loc) {
			if(node.part()) {
				jsonable.parts[loc] = node.part();
			}
			_.each(node.links, function(link, dir) {
				if(link.active() && link.primary()) {
					jsonable.links.push({
						'loc': loc,
						'dir': dir,
					});
				}
			});
		});

		return jsonable;
	},
	construct_nodes: function() {
		var self = this;

		var locs;
		if(self.size == 'medium') {
			locs = _.first(Node.locations, 7);
		} else {
			locs = Node.locations;
		}

		_.each(locs, function(loc) {
			var child = new Node(self, loc);
			self.nodes[loc] = child;

			// Now, with the new node, search for any others that have a link.
			_.each(self.nodes, function(neighbor) {
				var dir1to2 = child.is_adjacent(neighbor);
				if(dir1to2) {
					var link = new Link(self, child, dir1to2, true);
					var link2 = new Link(self, neighbor, Node.opposites[dir1to2], false);
					link.pair_link(link2);
					link2.pair_link(link);
				}
			});
		});

		_.each(['e', 'ne', 'nw', 'w', 'sw', 'se'], function(d) {
			new Link(self, self.nodes[d + self.edge_suffix()], d, true);
		});

	},
	refresh_all_flow: function() {
		var self = this;
		var connected_nodes = [];
		var all_nodes = [];
		// This should only be called on game.shell()
		if(Ice.isa(self.nodes.ctr.part(), CorePart)) {
			self.clear_depth(all_nodes);

			var node = self.nodes.ctr;
			connected_nodes = node.apply_order(connected_nodes);
			game.connected_nodes(connected_nodes);
		}
		game.all_nodes(all_nodes);

		// Find all relay parts.

		// _.each(_.difference(all_nodes, connected_nodes), function(n) {

		// });

		self.draw_event(!self.draw_event());

	},
	clear_depth: function(nodes) {
		var self = this;
		nodes = nodes || [];
		if(self.in_part()) {
			if(self.in_part().node()) {
				self.depth(self.in_part().node().shell.depth() + 1);
			} else {
				self.depth(null);
			}
		} else {
			self.depth(1);
		}
		_.each(self.nodes, function(node) {
			nodes.push(node);
			node.order(null);
			if(node.part() && node.part().shell && node.part().shell()) {
				node.part().shell().clear_depth(nodes);
			}
			_.each(node.links, function(l) {
				l.flow('disconnected');
				l.connected(false);
			});

		});
		return nodes;
	},
    right_click: function(event) {
        var self = this;
        //console.log("right click on shell");
        game.zoom_out();
    },
	double_tap: function() {
		//console.log("zooming out");
		game.zoom_out();
	},
	link_externals: function() {
		var self = this;
		if(!self.in_part()) return;
		var outside_node = self.in_part().node();

		_.each(['e', 'ne', 'nw', 'w', 'sw', 'se'], function(d) {
			var node = self.nodes[d + self.edge_suffix()];
			if(!node) return;
			var link = node.links[d];
			if(!link) return;

			var act = false;
			var opposite_link = outside_node ? outside_node.links[d] : null;

			if(!outside_node) act = false;
			else if(!outside_node.links[d]) act = false;
			else act = outside_node.links[d].active();
			//console.log('linking external on ', self.name() + '.' +  node.loc, ' towards ', link.text(), ' setting ', act);
			if(opposite_link)
				//console.log('Opposite link is ', opposite_link.text(), opposite_link.active());
			link.set_active(act, true);

		});
		game.shell().refresh_all_flow();

	}
});

SHELL_ANIM = 0.5;

ko.bindingHandlers.shell_render = {
	init: function(element, valueAccessor) {
		var shell = valueAccessor();
		$(element).data('shell', shell);
		shell.zoom_out();
		shell.zoom_in();
		shell.drawn();

	},
	update: function(element, valueAccessor) {
		//console.log("update called with ", arguments);
		var shell = valueAccessor();

		shell.zoom_in(), shell.zoom_out(), shell.fade_in(), shell.fade_out();

		if(shell.zoom_in()) {
			game.animating_shell(true);

			// This should happen once, when it is done.
			var $el = $(element);
			// console.log("Setting up zoom_in transition.");
			element.style.transition = '';
			//$el.css('transition', '');
			//$el.css('transform', 'scale(0.75)')
			var tf = ('translate(' +
					  Math.floor(shell.in_part().node().pos.x + 20) +'px, ' +
					  Math.floor(shell.in_part().node().pos.y + 15) +'px)' +
					  ' scale(0.025)'
			);
			// console.log('transforming from ', tf);
			// console.log(element.style.transform);
			// $el.css('transform-origin', 'left top');
			element.style.transformOrigin = 'left top';
			element.style.transform = tf;
			// $el.css('transform', tf);

			// element.style.transform = 'translate(-20px, -50px)';
			///element.style.transform = 'scale(0.0)';
			_.defer(function() {
				element.style.transition = 'transform ' + SHELL_ANIM + 's';
				//$el.css('transition', 'transform 1s');
				element.style.transform = 'translate(0px, 0px) scale(1)';

			    // $el.css('transform', 'scale(1)');
				_.delay(function() {
					// console.log("Turning off transition");
					game.animating_shell(false);
					element.style.transition = '';
					//$el.css('transition', '');
					shell.zoom_in(false);
				}, SHELL_ANIM * 1000);
			});
		}
		if(shell.zoom_out()) {
			game.animating_shell(true);

			var $el = $(element);
			$el.css('transform', 'scale(1.0)')
			element.style.transition = 'transform '+SHELL_ANIM+'s, opacity '+SHELL_ANIM+'s';
			_.defer(function() {
					var tf = ('translate(' +
			  		  Math.floor(shell.in_part().node().pos.x + 20) +'px, ' +
					  Math.floor(shell.in_part().node().pos.y + 15) +'px)' +
					  ' scale(0.025)'
					);

					element.style.opacity = '0.5';
					element.style.transform = tf;

					// $el.css('opacity', '0.5');
					// $el.css('transform', tf);
				_.delay(function() {
					$el.css('transition', '');
					shell.zoom_out(false);
					game.shell_renders.pop();
					game.animating_shell(false);

				}, SHELL_ANIM * 1000);
			});
		}
		if(shell.fade_out()) {
			game.animating_shell(true);

			var $el = $(element);
			$el.css('opacity', '1')
			$el.css('transition', 'opacity '+SHELL_ANIM+'s, transform '+SHELL_ANIM+'s');
			$el.css('opacity', '0');
			_.delay(function() {
				$el.css('transition', '');
				$el.css('transform', '')
				shell.drawn(false);
				shell.fade_out(false);
				game.animating_shell(true);

			}, SHELL_ANIM * 1000);
		}
		if(shell.fade_in()) {
			game.animating_shell(true);

			var $el = $(element);
			shell.drawn(true);
			$el.css('opacity', '0')
			$el.css('transition', 'opacity '+SHELL_ANIM+'s, transform '+SHELL_ANIM+'s');

			$el.css('opacity', '1');
			_.delay(function() {
				$el.css('transition', '');
				shell.fade_in(false);
				game.animating_shell(true);

			}, SHELL_ANIM * 1000);
		}
	},
	dispose: function(element, valueAccessor) {

	}
}



/*
	2016-05-29:
	Shells have links internally, but the corners may have links that extend out of the shell.  These should probably exist all the time
	as objects.

	A pair of links may have a junction.  Junctions will have a direction, and the links will know whether they are upstream or downstream (or sidestream)
	In this case, the direction will be implied and set automatically by distance from core.
	Junction: links, direction, (nodes)
	Link: node, direction, flow (up/down/side)


	old thoughts:
	So there's really two concepts to these links.

	The first is, say, a path:  nodes a and b are near each other on a shell, and therefore those two positions connect.
	These are actually precalculable on positions, like ctr: ['e', 'ne', 'nw', 'w', 'sw', 'se']
	I'm pretty tempted to go with that.

	The next is which PARTS are nearby within the same shell, like {'e': null, 'ne': Node, ...}
	These never change either- they're references.

	The next is which physical nodes are nearby intershell.
	This is trickier- links out should join to the neighbor of the parent node's location,
	And links in in the opposite direction.
	This changes if a fractal piece moves- but only for pieces inside it and pieces adjacent to the pieces the fractal
	moved from/to.

	I think nodes, shells, and links are never actually saved.  Instead we save and load parts and junctions, and their positions.

	The positions of junctions is hardest, but I suspect they're tuples of node position and direction.

	Junctions are probabl
	This one changes whenever a node moves, but only on nodes adjacent to the node(s) that moved.
	The THIRD is which physical nodes are connected, and how, and this is harder.
*/