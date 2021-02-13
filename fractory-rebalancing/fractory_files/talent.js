Talents = {};

Talent = Ice.$extend('Talent', {
    __init__: function(opts) {
        var self = this;
        self.$super();

        self.code = opts.code || self.$class.$name;
        self.name = ko.observable(opts.name);

        self.min_level = ko.observable(opts.min_level || 0);
        self.points = ko.observable(0);
        self.max_points = opts.max_points_fn || function(game) { return Infinity; };

        // level + 1 is shop tier
        self.shop_mode = ko.observable(opts.shop_mode);
        // increases up to 3 + level
        self.adds_inventory_slots = ko.observable(opts.adds_inventory_slots);
        // unlocks stat
        self.unlocks_stat = ko.observable(opts.unlocks_stat);

        // Adds stats to core.  This is only occasionally useful.
        self.core_upgrade = ko.observable(null);

        self.opts = opts;

        Talents[self.code] = self;

        self.boost_mech_code = ko.observable(opts.boost_mech_code);
        self.boost_mech = ko.computed(function() {
            return Mechs[self.boost_mech_code()];
        });
    },
    // This class is never serialized, we're going to do magic in ufj in game
    clone: function() {
        var self = this;
        return Talent(self.opts);
    },
    available: function(game) {
        var self = this;
        if(game.level() < self.min_level()) return false;

        return true;
    },
    can_buy: function(game) {
        var self = this
        if(game.unspent_tp() < 1) return false;
        if(self.points() + 1 > self.max_points(game)) return false;
        return true;
    },
    boost_factor: function(points) {
        var self = this;
        if(!self.boost_mech()) return null;
        if(points === undefined) points = self.points();
        if(self.unlocks_stat() != self.boost_mech_code() && points > 0) points += 1;
        return self.boost_mech().talent_boost_factor(points);
    },
    apply: function(game) {
        var self = this;
        if(self.shop_mode()) {
            var iss = _.indexBy(game.shop_slots(), function(ss) {
                return ss.mode();
            });
            var ss = iss[self.shop_mode()];
            if(!ss) {
                ss = ShopSlot();
                ss.mode(self.shop_mode());
                ss.restock();
                game.shop_slots.push(ss);

            }
            var base = _.contains(['blank', 'single', 'multi'], self.shop_mode()) ? 1 : 0;
            ss.max_tier(Math.max(ss.max_tier(), self.points() + base));
        }
        if(self.unlocks_stat()) {
            if(!_.contains(game.unlocked_stats_list(),self.unlocks_stat()))
                game.unlocked_stats_list.push(self.unlocks_stat());
        }
        if(self.adds_inventory_slots()) {
            while(game.inventory_slots().length < 6 + self.points()*3) {
                game.inventory_slots.push(InventorySlot());
            }
        }
        if(self.core_upgrade()) {
            var core = game.shell().nodes.ctr.part();
            _.each(self.core_upgrades(), function(val, code) {
                core.add_stat(code, val * self.level());
            });
        }

        return;
    },
    css: function(game) {
        var self = this;
        if(!self.available(game)) return 'unavailable';
        if(!self.can_buy(game)) return 'cannot_buy';
        return 'can_buy';
    }
});

_.each(Mechs, function(mech) {
    if(mech.props().uncounted || mech.props().non_upgrade) return;

    new Talent({
        code: 'boost_' + mech.code(),
        name: mech.props().noun,
        boost_mech_code: mech.code(),
        unlocks_stat: _.contains(Mech.STARTING_MECHS, mech.code()) ? null: mech.code(),
        min_level: mech.talent_unlock_level() || 0,
        max_points_fn: _.bind(mech.max_talent_points, mech),
    });
});

new Talent({
    code: 'bigger_inventory',
    name: 'Bigger Inventory',
    adds_inventory_slots: true,
    min_level: 1,
    max_points_fn: function(game) {
        return Math.min(5, Math.floor(game.level() / 10) + 1);
    }
});

new Talent({
    code: 'better_blanks',
    name: 'Better Blanks',
    shop_mode: 'blank',
    min_level: 20,
    max_points_fn: function(game) {
        return Math.floor((game.level() - 20)/ 20 + 1);
    }
});

new Talent({
    code: 'better_blank_generator',
    name: 'Better Blank Generator',
    shop_mode: 'blank_generator',
    min_level: 25,
    max_points_fn: function(game) {
        return (Talents['better_blanks'].points()+1);
    }
});

new Talent({
    code: 'better_simple',
    name: 'Better Simple',
    shop_mode: 'single',
    min_level: 30,
    max_points_fn: function(game) {
        return Math.floor((game.level() - 30)/ 20 + 1);
    }
});

new Talent({
    code: 'better_multi',
    name: 'Better Complex',
    shop_mode: 'multi',
    min_level: 10,
    max_points_fn: function(game) {
        return Math.floor((game.level() - 10)/ 20 + 1);
    }
});

new Talent({
    code: 'better_fractal',
    name: 'Fractals',
    shop_mode: 'fractal',
    min_level: 2,
    max_points_fn: function(game) {
        return Math.floor((game.level() - 2)/ 20 + 1);
    }
});



new Talent({
    code: 'conduits',
    name: 'Conduits',
    shop_mode: 'conduit',
    min_level: 5,
    max_points_fn: function(game) {
        return 1;
    }
});

new Talent({
    code: 'hoppers',
    name: 'Hoppers',
    shop_mode: 'hopper',
    min_level: 5,
    max_points_fn: function(game) {
        return 1;
    }
});

new Talent({
    code: 'capacitors',
    name: 'Capacitors',
    shop_mode: 'capacitor',
    min_level: 5,
    max_points_fn: function(game) {
        return 1;
    }
});

new Talent({
    code: 'relays',
    name: 'Relays',
    shop_mode: 'relay',
    min_level: 5,
    max_points_fn: function(game) {
        return 1;
    }
});


