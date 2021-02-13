Junction = Ice.$extend('Junction', {
    __init__: function() {
        //console.group("Junction.__init__");
        var self = this;
        this.$super();

        // I think junctions don't really have an el
        // themselves.  Links and choices will use
        // the junctionanim.

        /*this.$el = TEMPLATES.clone('junction', this);
        this.elsize = new Point(113, 21);
        this.$el.css(this.elsize.size());

        */


        // They will both move, touching each other, until
        // the right one would be off screen, then they will
        // jump back to the start.  I can probably do this with a css animation!

        this.direction = IceObservable(this, 'e');
        this.flow_direction = IceObservable(this, 1);
        this.imgsrc = IceObservable(this, '');

        this.link = IceObservable(this, null);
        //this.onLinkChanged = IceObservable(this, null);
        this.link.subChanged(this.onLinkChanged, this);

        this.source_node = IceObservable(this, null);
        this.destination_node = IceObservable(this, null);

        this.source_node.subChanged(this.onNodeChange, this);
        this.destination_node.subChanged(this.onNodeChange, this);

        this.source_part = IceObservable(this, null);
        this.destination_part = IceObservable(this, null);

        this.source_part.subChanged(this.onPartChanged, this);
        this.destination_part.subChanged(this.onPartChanged, this);
        // We're gonna make this ugly.
        // When link changes, set/subscribe nodes.
        // When nodes change, set/subscribe parts.

        //non-slotted junctions won't have a link, but
        // may have nodes and parts so that they can
        // display and configure hypothetically.

        //Nodes and parts won't have their junctions set until
        // it's actually slotted into a link.
        this.anim = new JunctionAnim(this);

        //console.groupEnd();
    },

    onLinkChanged: function(self, eargs){
        //console.group('junction.onLinkChanged');
        // I should already have direction at this point.
        var direction = this.direction();
        var opposite = Node.opposites[direction];

        // If I have a source node, I definitely have a destination node.
        if(this.source_node()) {
            //console.log("Have a source_node, going to clear and unbind from them.");
            //this.source_node.unbind(this);

            //Unlink from the nodes' junctions.
            var dfd = this.source_node().junctions[direction](null, 'deferred');

            // Fire: destination clear, source clear.
            this.destination_node().junctions[opposite](null);
            dfd();

            /*-- I think I can do this in the part change event.
            If my source part changes to null, make the old one stop providing me.
            Also, unlink me.

            // If the source part was providing me, I need it to stop.
            // Because the slotted part
            if(this.source_part()) {
                this.source_part().stop_providing(this);
            }*/

            this.source_node(null);
            this.destination_node(null);
            //console.log("Done clearing parts.");
        }
        if(this.link()) {
            this.destination_node(this.link().nodes[direction]);
            this.source_node(this.link().nodes[opposite]);

            // link to the nodes' junctions.
            dfd = this.source_node().junctions[direction](this, 'deferred');
            dfd2 = this.destination_node().junctions[opposite](this, 'deferred');
            // Fire: source change, destination change.
            dfd();
            dfd2();
            //this.$el.appendTo(this.link().$junction_holder);
            this.anim.start_anim();

            //Now that I'm linked, I should be able to tell the
            // source part to provide me.
            //console.log("Asking part ", this.source_part().pretty(), " to provide ", this.pretty());
            this.source_part().provide_junction(this);
        }
        //console.groupEnd();
    },
    onNodeChange: function(self, eargs) {
        // I bound both nodes to this, which is fine.
        if(eargs.oldval) {
            //Unsubscribe to the node's part observable.
            eargs.oldval.part.unsub(this);
        }
        if(eargs.val) {
            // Subscribe to the node's part observable.
            eargs.val.part.subChanged(this.onNodePartChanged, this);
        }
        this.sync_parts();
    },
    onNodePartChanged: function(node, eargs) {
        this.sync_parts();
    },
    sync_parts: function() {
        var source_part = destination_part = null;

        if(this.source_node()) {
            source_part = this.source_node().part();
        }
        if(this.destination_node()) {
            destination_part = this.destination_node().part();
        }
        this.source_part(source_part);
        this.destination_part(destination_part);
    },
    onPartChanged: function(self, eargs) {
        //console.group("Junction.onPartChanged ", this.pretty());
        //console.log("self=", self, " eargs=", eargs);
        // I don't understand why I did this.  If I lost my link, and thus my source
        // part, I should stop providing.
        //if(eargs.obs == this.source_part && !eargs.val && this.link()) {
        if(eargs.obs == this.source_part) {
            //console.log("Setting source part.  oldval=", eargs.oldval, ' link=', this.link());
            if(eargs.oldval) {
                eargs.oldval.stop_providing(this);
                // If I'm slotted in a link but my source part is gone, remove me.
                //(Maybe the weird condition above was for this?)
                if(this.link()) {
                    this.link().set_junction(null);
                }
            }
        }
        //I'm not actually binding to anything on the part
        //but if I was, I'd bind/unbind here.

        /*if(eargs.oldval) {
            eargs.oldval.unsub(this);
        }
        if(eargs.val) {
            eargs.oldval.sub(this);
        }*/
        //console.groupEnd();
    },


    is_valid: function() {
        // The base one is never valid.  Hah!
        return false;
    },
    construct_controller: function(jc, $stats, $opts) {
        //console.group('Junction.construct_controller');
        jc.stats = [];
        //$stats.html('Apple<br/>bannana<br/>canteloupe');
        jc.$name.text(this.name());
        jc.$desc.text(this.description());
        //console.groupEnd();
    },
    render_controller: function(jc, $stats, $opts) {

    },
    name: function() {
        return this.$class.$classname + ' #' + this.ICEID;
    },
    description: function() {
        return 'This is not the description for ' + this.$class.$classname + ' junctions.  This is only a tribute.';
    }



});
Junction.rotate_from_dir = function(dir) {

    return {
        'se': ' rotate(60deg)',
        'nw': ' rotate(240deg)',
        'ne': ' rotate(-60deg)',
        'nw': ' rotate(-120deg)',
        'w': ' rotate(180deg)',
        'sw': 'rotate(120deg)'
    }[dir];
    
    if(_.contains(['nw', 'se'], dir)) {
        return ' rotate(60deg)';
    } else if(_.contains(['ne', 'sw'], dir)) {
        return ' rotate(-60deg)';
    } else {
        return '';
    }
}


PumpJunction = Junction.$extend('PumpJunction', {
    __init__: function() {
        //console.group('PumpJunction.__init__');
        this.$super();

        this.pump_per_tick = IceObservable(this, 1.5);

        // Mutating this to
        this.pump_colors = new ManaPumpColors();
        this.pump_colors.evChanged.sub(this.onColorsModified, this);

        this.imgsrc('/images/junctions/red_pump.png');

        //console.groupEnd();


    },
    is_valid: function() {
        // The biggest question here is whether or not I am 'provided' by an attached part.
        // I could calculate this on the fly, but it might be better for me to keep counters.
        return this.source_part() && this.destination_part();

    },
    onColorsModified: function() {
        this.evChanged();
    },
    construct_controller: function(ctrl, $stats, $opts) {
        //console.group('PumpJunction.construct_controller');
        this.$super(ctrl, $stats, $opts);

        var self = this;
        $stats.append('<p>Mana Pump Rate: <span class="pump_per_tick"></span> m/tick');
        ctrl.$pump_per_tick = $stats.find('.pump_per_tick');

        ctrl.flow_options = {};
        ctrl.color_options = {};

        _.each(['Push', 'Pull'], function(fd) {
            var $opt = $('<span class="pump_direction"></span>').text(fd);
            $opt.bind('click', function() {
                self.flow_direction(fd == 'Push' ? 1 : -1);
            })
            $opts.append($opt);
            ctrl.flow_options[fd] = $opt;
        });

        $opts.append($('<br />'));
        $opts.append($('<br />'));


        _.each(ManaColors, function(color) {
            var $opt = $('<span class="pump_color"></span>').text(color);
            $opt.bind('click', function() {self.toggle_color(color);});

            $opts.append($opt);
            ctrl.color_options[color] = $opt;
        });

        //console.groupEnd();

    },
    render_controller: function(ctrl, $stats, $opts) {
        //console.group('PumpJunction.render_controller');
        var self = this;
        this.$super(ctrl, $stats, $opts);

        ctrl.$pump_per_tick.text(this.pump_per_tick());
        _.each(ctrl.color_options, function($opt, color) {
            //console.log(color, !!self.pump_colors[color]())
            $opt.toggleClass('active', !!self.pump_colors[color]());
        });
        _.each(ctrl.flow_options, function($opt, fd) {
            var active = ((fd == 'Push' ? 1 : -1) == self.flow_direction());
            $opt.toggleClass('active', active);
        })
        //console.groupEnd();
    },
    toggle_color: function(color) {
        //console.log("Toggling ", color);

        this.pump_colors[color](!this.pump_colors[color]());
    },
    description: function() {
        return 'This is a mana pump junction.  You can specify which colors it will pump, and which it will ignore.';
    }
});


ManaPumpColors = Ice.$extend('ManaPumpColors', {
    __init__: function() {
        this.$super();
        var self = this;
        _.each(ManaColors, function(color) {
            self[color] = IceObservable(self, false);
        })
        this.White(true);
    }
})