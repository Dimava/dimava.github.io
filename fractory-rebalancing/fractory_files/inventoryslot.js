InventorySlot = Ice.$extend('InventorySlot', {
	__init__: function() {
		var self = this;
		self.$super();


		self.part = ko.observable(null);

	},
	__keys__: function() {
		return this.$super().concat([]);
	},
	as_jsonable: function() {
		var self = this;
		var jsonable = self.$super();
		jsonable.part = self.part();
		return jsonable;
	},
	update_from_jsonable: function(jsonable) {
		var self = this;
		self.$super(jsonable);
		if(jsonable.part) {

			self.set_part(jsonable.part, true);
		}
	},
	set_part: function(part, force) {
		var self = this;
		var console = silence;
		//console.group("Moving part");
		var old_location = part.container();
		var old_part = self.part();

		if(part === game.dragging_part() || game.old_part === game.dragging_part()) {
			interact.stop();
		}

		try {

			if(Ice.isa(old_location, ShopSlot) && old_part) {
				var empty = _.find(game.inventory_slots(), function(is) {
					return !is.part();
				});
				if(!empty) return false;

				//console.log("moving current part to empty slot.");
				empty.set_part(old_part);
				//console.log("Done");
				old_part = self.part();
			}

			if(!force) {
				if(!part.can_move(self)) {
					return false;
				}
				if(!self.can_accept(part)) {
					return false;
				}

				if(old_location && !old_location.can_release(part, self)) {
					return false;
				}

				if(old_part && !self.can_release(old_part, old_location)) {
					return false;
				}

				if(old_part && old_location) {
					if(!old_part.can_move(old_location)) {
						return false;
					}
					if(!old_location.can_accept(old_part)) {
						return false;
					}
				}

			}


			if(old_location) {
				if(old_part) {
					// console.log("Setting old_part ", old_part, " container to ", old_location);
					old_part.container(old_location);
				}

				// console.log("Putting old_part ", old_part, "in old_location ", old_location);
				// There should pretty much always be one.
				//console.log("For swap, putting old part ", old_part, " in old location", old_location);
				old_location.part(old_part);
			}

			// console.log("Setting part ", part, " container to ", self);
			part.container(self);
			// console.log("Putting part ", part, "in container ", self);
			self.part(part);
			// console.log("Move complete.");

			// Fix externals.
			if(part.shell && part.shell()) {
				part.shell().link_externals();
			}
			if(old_part && old_part.shell && old_part.shell()) {
				old_part.shell().link_externals();
			}
			if(old_location) {
				//console.log("Notifying old_location", old_location, " of a part change.");
				old_location.on_part_change(old_location.part(), part, self);
			}
			self.on_part_change(self.part(), old_part, old_location);

			game.last_moved_part(part);
		} finally {
			//console.groupEnd();
		}
	},
	on_part_change: function(part) {

	},
	can_accept: function(part) {
		return true;
	},
	can_release: function(part) {
		return true;
	}


})
