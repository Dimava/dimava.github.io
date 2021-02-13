
Analytics = Ice.$extend('Analytics', {
    __init__: function() {
        var self = this;
        self.$super();
        self.pulse_interval = window.setInterval(_.bind(self.pulse, self), 60000);
        self.pulse();
    },
    pulse: function(category, action, label, value) {
        var self = this;
        self.report_idle();
    },

    /*
        'gameplay', 'unlocked_tier', kind, tier
        'gameplay', 'prestige', 'earned_bonus', prestige_preview
        'gameplay', 'checkin', 'idle', 1
    */
    send_event: function(category, action, label, value) {
        try {
            if(!ga) {
                return;
            }
            ga('send', 'event', category, action, label, value||1);

        } catch(e) {}
    },
    report_idle: function() {
        var self = this;
        self.send_event('gameplay', 'checkin', 'idle', 1);
    },

});