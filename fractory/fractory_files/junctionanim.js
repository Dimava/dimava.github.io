JunctionAnim = Ice.$extend('JunctionAnim', {
    __init__: function(junction) {
        //console.group("JunctionAnim.__init__");
        var self = this;
        this.$super();

        this.junction = IceObservable(this, null);
        this.junction.subChanged(this.onJunctionChange, this);

        this.$el = TEMPLATES.clone('junctionanim', this);
        this.elsize = new Point(113, 21);

        this.$leader = this.$el.children('.leader');
        this.$follower = this.$el.children('.follower');

        this.$both = this.$leader.add(this.$follower);

        this.direction = IceObservable(this, 'e');

        // These are always prerotated.  Links are of course rotated,
        // and junction selectors have a container for these, with their
        // own border graphic, which has to be rotated (so that the border
        // is rotated too.)

        // 1 means forward, -1 means backwards, affects the animation
        // direction.  Kind of like a reflip.
        this.flow_direction = IceObservable(this, 1);

        this.imgsrc = IceObservable(this, '');

        _.each([this.flow_direction, this.direction,
                this.imgsrc], function(obs) {
            obs.subChanged(self.render, self);
        })

        this.paused = true;
        //console.log("About to set junction to ", junction);
        this.junction(junction);

        this.render();
        //console.groupEnd();
    },
    onJunctionChange: function(self, eargs) {
        var self = this;
        if(eargs.oldval) {
            eargs.oldval.unsub(this);
        }
        if(eargs.val) {
            _.each(['imgsrc', 'direction', 'flow_direction'], function(obsname) {
                //console.log("Subscribing, self.junction() is ", self.junction().pretty());
                //console.log("Subscribing to ", obsname, ", ", self.junction()[obsname]);
                self.junction()[obsname].subChanged(self.sync_attrs, self);
            });
            this.sync_attrs();
        }
    },
    sync_attrs: function() {
        this.imgsrc(this.junction().imgsrc());
        this.direction(this.junction().direction());
        this.flow_direction(this.junction().flow_direction());
    },
    anim_direction: function() {
        return (this.flip_img() ? -1 : 1) * this.flow_direction();
    },
    flip_img: function() {
        return this.direction().indexOf('e') == -1;
    },
    render: function() {
        //console.group('JunctionAnim.render ', this.pretty());
        this.$el.css(this.elsize.size());
        this.$both.css(this.elsize.size());


        this.$both.attr('src', this.imgsrc());
        if(this.flip_img()) {
            this.$both.addClass('flip');
        } else {
            this.$both.removeClass('flip');
        }

        if(!this.paused) {
            this.start_anim();
        }
        //console.groupEnd();

    },
    start_anim: function() {
        var self = this;

        this.paused = false;
        // We need to flip the image if the direction is westerly.
        function restart() {
            if(self.paused) {
                return;
            }
            self.start_anim();
        }

        this.$both.stop();
        //this.$leader.position(new Point(0,0).lt());
        var zero = new Point(0,0);
        this.$leader.css(zero.lt());

        var anim_direction = this.anim_direction();

        if(anim_direction === 1) {
            this.$follower.css(new Point(this.elsize.x * -1, 0).lt());
            // Slide them right.
            this.$leader.animate({left: this.elsize.x}, 2000, 'linear', restart);
            this.$follower.animate({left: '0px'}, 2000, 'linear', restart);
        } else {
            this.$follower.css(new Point(this.elsize.x, 0).lt());
            // slide them left.
            this.$leader.animate({left: this.elsize.x * -1}, 2000, 'linear', restart);
            this.$follower.animate({left: '0px'}, 2000, 'linear', restart);
        }
    },
    stop_anim: function() {
        this.paused = true;
        this.$leader.stop();
        this.$follower.stop();
    },

});