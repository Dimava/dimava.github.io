Upgrade = Ice.$extend('Upgrade', {
    __init__: function(code) {
        var self = this;
        self.$super();
        self.code = code;
        self.mech = ko.computed(function() {
            return Mechs[self.code];
        });

        self.name = ko.computed(function() {
            if(!self.mech()) return null;
            return self.mech().props().noun;
        });
        self.points = ko.observable(0);

        self.arcana_cost = ko.computed(function() {
            if(!self.mech()) return null;
            return self.mech().upgrade_arcana_cost(self.points() + 1);
        });
        
        self.max_buyable = ko.computed(function() {
            if(!self.mech()) return null;
            return Math.floor((Math.log((game.arcana()*(1.5-1))/(100*Math.pow(1.5,self.points())) +1))/Math.log(1.5));
        });
        
        self.buy_max_cost = ko.computed(function() {
            if(!self.mech()) return null;
            return Math.floor(100*((Math.pow(1.5,self.points()))*(Math.pow(1.5,self.max_buyable())-1))/(1.5-1));
        });

    },
    __keys__: function() {
        return this.$super().concat([
            'code', 'points',
        ]);
    },
    available: function(game) {
        var self = this;

        if(!self.mech()) return null;
        return self.mech().upgrade_available(game);
    },
    can_buy: function(game) {
        var self = this;

        if(!self.mech()) return null;
        if(!self.available(game)) return false;
        if(game.arcana() < self.arcana_cost()) return false;
        if(self.points() >= self.max_points(game)) return false;
        return true;

    },
    boost_factor: function(points) {
        var self = this;
        if(points === undefined) points = self.points();

        if(!self.mech()) return null;
        return self.mech().upgrade_factor(points);
    },
    max_points: function(game) {
        var self = this;

        if(!self.mech()) return null;
        return self.mech().max_upgrade_points(game);
    },
    css: function(game) {
        var self = this;
        var classes = self.code;
        if(!self.available(game)) classes += ' unavailable';
        else if(!self.can_buy(game)) classes += ' cannot_buy';
        else classes += ' can_buy';
        return classes;
    }
});

