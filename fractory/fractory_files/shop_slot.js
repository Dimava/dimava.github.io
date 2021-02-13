ShopSlot = InventorySlot.$extend('ShopSlot', {
	__init__: function(mode) {
		var self = this;
		self.$super();

		// blank, single, multi, fractal
		self.mode = ko.observable(mode || 'blank');
		self.tier = ko.observable(1);
		self.max_tier = ko.observable(1);

		self.focused_stat = ko.observable(0);

	},
	__keys__: function() {
		return this.$super().concat(['mode', 'tier', 'max_tier']);
	},
	restock: function() {
		var self = this;
		self.set_part(self.generate_part(), true);
	},
	next_stat: function() {
		var self = this;
		self.focused_stat((self.focused_stat() + 1) % game.unlocked_stats_list().length);
		self.restock();
	},
	prev_stat: function() {
		var self = this;
		self.focused_stat(self.focused_stat()-1);
		if (self.focused_stat()<0){
			self.focused_stat(game.unlocked_stats_list().length-1);
		}
		self.restock();
	},
	generate_part: function() {
		var self = this;

		var part = null;
		var tier = self.tier();


		// max refinement is probably like 100^tier.
		// There should be a penalty.  Higher for single.
		// So...
		var max_refinement = Math.pow(100, tier);
		var refinement_used, budget;
		refinement_used = _.random(0, max_refinement);

		if(self.mode() === 'fractal') {
			part = FractalPart();
			part.tier(tier);
		} else if(self.mode() === 'blank') {
			part = Part();
			part.tier(tier);

		} else if(self.mode() === 'single') {
			part = Part();
			part.tier(tier);
			budget = Math.floor(refinement_used * 0.5);

			var flaw = Math.floor(refinement_used - budget);
			part.add_stat('Flaw', flaw);

			var stat_used = game.unlocked_stats_list()[self.focused_stat()];
			if(!stat_used) {
				stat_used = _.sample(game.unlocked_stats());
			}

			part.add_stat(stat_used, budget);
			part.refinement(refinement_used);
		} else if(self.mode() === 'multi') {
			part = Part();
			part.tier(tier);
			budget = Math.floor(refinement_used * 0.5);

			var flaw = Math.floor(refinement_used - budget);
			part.add_stat('Flaw', flaw);


			var used_budget = 0;
			while(used_budget < budget && budget - used_budget >= 1) {
				var sp = _.random(budget);
				if(used_budget + sp > budget) sp = budget - used_budget;
				used_budget += sp;

				stat_used = _.sample(game.unlocked_stats());
				part.add_stat(stat_used, sp);
			}
			part.refinement(refinement_used);
		} else if(self.mode() === 'conduit') {
			part = ConduitPart();
			part.tier(tier);
		} else if(self.mode() === 'capacitor') {
			part = CapacitorPart();
			part.tier(tier);
		} else if(self.mode() === 'relay') {
			part = RelayPart();
			part.tier(tier);
		} else if(self.mode() === 'hopper') {
			part = HopperPart();
			part.tier(tier);
		} else if(self.mode() === 'blank_generator') {
			part = BlankGeneratorPart();
			part.tier(tier);
		}
		part.highest_stats.recompute();
		return part;
	},
	can_accept: function(part) {
		return false;
	},
	can_release: function(part, new_location) {
		var self = this;
		var cost = part ? part.mana_cost() : 0;
		if(Ice.isa(new_location, TrashSlot)) {
			cost *= 0.25;
		}
		//console.log("Can release?  Part costs ", cost);
		return game.mana() >= cost;

	},
	on_part_change: function(part, old_part, old_part_new_location) {
		var self = this;

		// console.log("PART CHANGE FOR SHOP");

		var cost = old_part ? old_part.mana_cost() : 0;

		if(Ice.isa(old_part_new_location, TrashSlot)) {
			cost *= 0.25;
			cost = 0;
		}
		if(old_part_new_location === null) {
			cost = 0;
		}
		cost = Math.floor(cost);
		game.mana(game.mana() - cost);

		// console.log("Checking for restock");
		if(!self.part()) {
			return self.restock();
		}
	}

});