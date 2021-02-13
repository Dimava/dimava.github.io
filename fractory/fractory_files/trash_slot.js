TrashSlot = InventorySlot.$extend('TrashSlot', {
	__init__: function(mode) {
		var self = this;
		self.$super();



	},
	can_accept: function(part) {
		return true;
	},
	on_part_change: function(part) {
		var self = this;
		
		self.part(null);
	}

});