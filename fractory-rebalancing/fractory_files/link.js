
Link = Ice.$extend('Link', {
	__init__: function(shell, node, direction, primary) {
		// Every node pair gets a link- we simply may not SHOW them.
		// we'll go ahead and clone the element though.
		// The entire div is rotated depending on the necessary orientation.
		// If we want anything on it that isn't rotated (the button, I guess,
		// if I can't get the imagemap thing working)
		// then it'll have to be flipped.
		this.$super();

		var self = this;

                self.hovered = ko.observable(false);
                
		self.shell = ko.observable(shell);
		self.node = ko.observable(node);
		self.pair_link = ko.observable(null);
		self.pair_node = ko.computed(function() {
			if(!self.pair_link()) return null;
			return self.pair_link().node();
		});

		self.direction = ko.observable(direction);

		self.link_node = ko.computed(function() {
			//It is not possible to burrow, then unburrow (I don't think), but it is possible to
			//unburrow, then burrow again.

			// console.log("Starting link_node");
			//Unburrow search.
			var chain_link = self;
			while(chain_link && !chain_link.pair_link()) {
				// If I'm pointing out
				//If there's no out to point to, either because we're top shell or because the part
				// isn't in a node.
				if(!chain_link.shell().in_part()) return null;
				var in_node = chain_link.shell().in_part().node()
				if(!in_node) return;

				// console.log("Chaining out from ", chain_link.node(), chain_link.direction(), ' to ',
				// 	in_node, in_node.links[chain_link.direction()]);
				// console.log("in_node has links ", in_node.links);
				chain_link = in_node.links[chain_link.direction()];
			}

			if(!chain_link || !chain_link.pair_node()) return null;
			var ln = chain_link.pair_node();
			// burrow search
			while(ln && ln.part() && ln.part().shell && ln.part().shell()) {
				var l = Node.opposites[chain_link.direction()];
				ln = ln.part().shell().nodes[l + ln.part().shell().edge_suffix()];
			}
			return ln;
		});
		self.link_part = ko.computed(function() {
			var n = self.link_node();
			if(!n) return null;
			return n.part();
		});


		self.junction = ko.observable(null);

		// And its position.
		self.elsize = Point(110, 24);
		self.ctr = node.ctr.translate(Node.directions[direction], Link.distance/2);
		self.pos = self.ctr.plus(self.elsize.center().negative());
		self.rotate_transform = Junction.rotate_from_dir(self.direction());

		self.active = ko.observable(false);
		// Is drawn, can be turned on, is saved.
		self.primary = ko.observable(primary);
		self.flow = ko.observable(null);
		self.connected = ko.observable(false);

		self.flow_direction = ko.computed(function() {
			if(!self.active()) return 'inactive';
			if(!self.connected()) return 'disconnected';
			if(self.flow() === 'down') return self.direction();
			if(self.flow() === 'up') return Node.opposites[self.direction()];
			return null;
		});
		self.active_flow = ko.computed(function() {
			return self.active() && self.flow();
		});

		node.links[direction] = self;


	},
	text: function() {
		var self = this;
		return self.shell().name() + '.' + self.node().loc + '.' + self.direction();
	},
	unburrow_link: function() {
		var self = this;
		if(self.pair_link()) {
			return null;
		}
		var outside_part = self.shell().in_part();
		if(!outside_part) return null; // There's nowhere to go.

		var outside_node = outside_part.node();
		// The outside part may not be in a node.
		if(!outside_node) return null;
		return outside_node.links[self.direction()] || null;
	},
	burrow_link: function() {
		var self = this;

		if(!self.pair_link()) {
			// If I'm an external, I should return my own nested external if the part I'm on is a fractal
			var part = self.node().part();
			if(part && part.shell && part.shell()) {
				var sh = part.shell();
				var d = self.direction();
				return sh.nodes[self.node().loc].links[d];
			}
			return null;
		} else {
			var part = self.pair_node().part();
			if(part && part.shell && part.shell()) {
				var sh = part.shell();
				var d = self.direction();
				var node = sh.nodes[Node.opposites[d] + sh.edge_suffix()];
				if(!node) return null;
				return node.links[Node.opposites[d]];
			}
			return null;
		}
	},
	congruent_links: function(first_set) {
		var self = this;


		// Second attempt.
		// Let's borrow all the way down on the original without adding, then burrow all the way up.

		var links = [];
		// Then, burrow all the way down on the remote.
		function dbg(text) {
			// console.log(text, _.map(links, function(l) { return l.text();}).join(', '));
		}
		var l = self;
		var b;
		while(b=l.burrow_link())
			l = b;

		// console.log("Burrowed locally down to ", l.text());

		var last_unburrow = null;
		while(l) {
			links.push(l);
			l = l.unburrow_link();
			if(l) last_unburrow = l;
		}
		// dbg("Unburrowed back up to " + (last_unburrow ? last_unburrow.text() : last_unburrow));

		if(!last_unburrow) {
			l = self.pair_link();
			if(!self.pair_link()) {
				//console.log("Couldn't reburrow because last unburrow was null and there's no pair");
				return links; //?
			}

		} else {
			if(last_unburrow.pair_link())
					links.push(last_unburrow.pair_link());  // I won't be coming back after this.
			l = last_unburrow.burrow_link();
		}

		// var l = last_unburrow;
		// console.log("Burrowing down from ", (l ? l.text() : l));
		while(l) {
			links.push(l);
			l = l.burrow_link();
		}

		dbg("Finished");
		return links;

		/*
		var links = first_set || [];
		links.push(self);

		var l = self;
		var last_unburrow = self;
		dbg("Phase 1", links);
		while(l) {
			//if(l !== self) links.push(l);
			l = l.unburrow_link();
			if(l) last_unburrow = l;
		}
		//console.log("Unburrowed to top: ", last_unburrow.text());
		if(last_unburrow !== self) links.push(last_unburrow);

		dbg("Phase 2", links);
		l = last_unburrow.burrow_link();
		var last_burrow = l || last_unburrow;
		while(l) {
			//if(l !== self) links.push(l);
			l = l.burrow_link();
			if(l) last_burrow = l;
		}
		//console.log("reburrowed to remote bottom: ", last_burrow.text());

		dbg("Phase 3");
		// The last burrow will be an external facing the opposite direction,
		// or null.
		// If I did unburrow, then unburrow back up from the bottom.
		if(last_burrow) {
			// If I did reburrow, then walk back up.
			l = last_burrow.unburrow_link();
			while(l && l !== last_unburrow) {
				if(l !== self) links.push(l);
				l = l.unburrow_link();

			}
		}
		//console.log("Unburrowed from remote bottom ")
		dbg("Phase 4", links);
		// Now burrow all the way down in the inverse direction from last_unburrow
		// which means burrowing from either the inverse or, if there is no inverse, itself.
		var inverse = last_unburrow.pair_link() || last_unburrow;
		//console.log("From ", inverse.text());
		l = inverse.burrow_link();
		last_burrow = l;

		if(!last_unburrow.burrow_link()) {
			links.push(inverse);
		}
		//console.log("Last burrow is ", last_burrow);
		while(l) {
			if(l !== self && l) links.push(l);
			l = l.burrow_link();
			if(l) last_burrow = l;
		}
		//console.log("Burrowed to local bottom: ", last_burrow ? last_burrow.text() : last_burrow);

		dbg("Phase 5", links);
		// Lastly, burrow all the way back up until self.
		// Last burrow will be an external facing the original direction, or null?
		/*l = last_burrow.unburrow_link();
		while(l && l !== self) {
			links.push(l);
			l = l.unburrow_link();
		}

		//console.log("Unburrowed back to self");
		*/
		return links;
	},
	set_active: function(act, skip_refresh) {
		var self = this;


		_.each(self.congruent_links(), function(l) {
			l.active(act);
		});

		game.shell().refresh_all_flow();


		return;

		self.active(act);

		if(self.pair_link()) {
			self.pair_link().active(act);

			//If either side of this is a fractal, I need to toggle its external in the opposite direction.

			//self.pair_link().refresh_flow();
		} else {
			// I am clicking an external link.
			// So I can be semi-active, which is good.  If I am, then I need to activate the one above too.
			var outside_part = self.shell().in_part();
			if(!outside_part) {
				// I can't burrow out because the outside shell doesn't fully have its stuff together.
			} else {


				var outside_node = outside_part.node();
				// By turning that one ON, if that one also extends out, it should turn THAT on too.
				//console.log("Attempting escape on ", outside_node.loc, ' direction ', self.direction());
				outside_node.links[self.direction()].set_active(act, true);
			}
		}
		_.each([self, self.pair_link()], function(l) {
			if(!l) return;
			var part = l.node().part();
			if(part && part.shell && part.shell()) {
				// Then this link is burrowing into a part with a shell.  In that shell, find
				// the reverse edge link.
				var sh = part.shell();
				var d = l.direction();
				//console.log("Attempting burrow on ", d + sh.edge_suffix(), " direction ", d);
				var node = sh.nodes[d + sh.edge_suffix()];
				if(!node) return;
				var ext_link = node.links[d];
				if(!ext_link) return;
				ext_link.set_active(act, true);
			}
		});

		if(!skip_refresh) {
			if(window.game && game.shell()) {
				game.shell().refresh_all_flow();
			}
		}
		// determine flow
	},
	click: function() {
		var self = this;
		// if(!self.pair_link()) return;

		self.set_active(!self.active());
	},
	/*refresh_flow: function() {
		var self = this;
	},*/
	set_junction: function(junction){
		//console.group('Link.set_junction ', this.pretty());
		if(junction === this.junction()) {
			//console.warn("No change, aborting.");
			//console.groupEnd();
			return;
		}
		if(junction && this.junction()) {
			//console.warn("Cannot put a junction in a link that already has one.");
			return;
		}

		//Junctions don't really move.  They're just destroyed.  So there's
		// basically just two operations here: set and clear.
		if(!junction) {
			//console.log("Setting to null.");
			// I don't need the animation on me anymore.
			this.junction().anim.$el.detach();
			this.junction().anim.stop_anim();

			//clear
			var dfd = this.junction().link(null, 'defer');
			var dfd2 = this.junction(null, 'defer');;

			dfd2();
			dfd();


		} else {
			//set.
			var dfd = this.junction(junction, 'defer');
			//console.log("Trying to set junction's link to me, junction=", junction.pretty(), ", this=", this.pretty())
			//console.log("This.junction()=", this.junction().pretty());
			var dfd2 = this.junction().link(this, 'defer');

			// Put the element on me.
			this.$junction_holder.append(junction.anim.$el);

			// Fire events.
			dfd();
			dfd2();


		}
		//console.groupEnd();
	},
	onJunctionChanged: function(self, eargs) {

	},
	onClick: function() {
		//console.log("Link clicked.");
	},

	stripe_holder_css: function() {
		var self = this;

		return self.flow();

	},
        
        hover: function(event) {
            if(event.ctrlKey) {
                this.click();
            }
        }

});

Link.distance = 150;
