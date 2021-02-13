Part = Ice.$extend('Part', {
    __init__: function() {

        var self = this;
        this.$super();

        //size may be variable depending on what I'm dropping it into.
        this.elsize = new Point(60, 60);

        self.mana = ko.observable(30);

        /* Hrm.  Probably a custom binding.
        this.$el.draggable({
            'revert': 'invalid',
            'scope': 'parts',
            'snap': '.part_holder',
            'snapMode': 'inner',
            'snapTolerance': 25,
            'revertDuration': 250,
            'helper': 'clone',
            'opacity': '0.5',
            'zIndex': 999,
            'appendTo': $('body')
        }) */

        self.container = ko.observable(null);
        self.node = ko.computed({
            'write': self.container,
            'read': function() {
                return Ice.isa(self.container(), Node) ? self.container() : null;
            }
        });
        // Super redundant.
        self.islot = ko.computed({
            'write': self.container,
            'read': function() {
                return Ice.isa(self.container(), InventorySlot) ? self.container() : null;
            }
        });
        // This is likely to have a fuckton of other methods later, but for now this is all I need.

        self.focused = ko.observable(false);
        self.starved = ko.observable(false);
        self.improved = ko.observable(false);

        self.stats_list = ko.observableArray([]);
        self.stats = ko.computed(function() {
            return _.indexBy(self.stats_list(), function(st) {
                return st.code();
            });
        });


        self.highest_stats = ko.observableArray([]);
        self.highest_stats.recompute = function() {
            var old = self.highest_stats();
            self.stats_list(_.filter(self.stats_list(), function(sv) {
                return sv.total();
            }));
            var new_sorted = _.chain(self.stats_list()).filter(function(sv) {
                return !sv.mech().props().uncounted && sv.total();
            }).sortBy(function(st) {
                if(st.code() === 'Flaw') return Infinity;

                return -1 * st.value();
            }).value();

            if(old.length != new_sorted.length) {
                self.highest_stats(new_sorted);
                return;
            }
            var all_same = _.all(old, function(stat, i) {
                return stat === new_sorted[i];
            });
            if(all_same) return;
            self.highest_stats(new_sorted);

        }
        self.glyph_holder_css = ko.computed(function() {
            var len = self.highest_stats().length;
            if(len >= 3) return 'three_glyphs';
            if(len == 2) return 'two_glyphs';
            if(len == 1) return 'one_glyph';
            return 'no_glyphs';
        });

        self.glyph_classes = ko.computed(function() {
            return [
                self.highest_stats()[0] ? self.highest_stats()[0].mech().props()['glyph'] : 'none',
                self.highest_stats()[1] ? self.highest_stats()[1].mech().props()['glyph'] : 'none',
                self.highest_stats()[2] ? self.highest_stats()[2].mech().props()['glyph'] : 'none',

            ];
        });

        // self.buffs_list = ko.observableArray([]);
        // self.buffs = ko.computed(function() {
        //     return _.indexBy(self.buffs_list(), function(st) {
        //         return st.code();
        //     });
        // });

        self.refinement = ko.observable(0);
        self.tier = ko.observable(1);
        self.base_max_refinement = ko.computed(function() {
            return Math.pow(100, self.tier());
        });
        self.max_refinement = ko.computed(function() {
            var luster = self.stats().Luster;
            return self.base_max_refinement() + (luster ? luster.value() : 0);
        });
        self.mana_cost = ko.computed(function() {
            var sv = self.stats()['Flaw'];
            return (
                    self.max_refinement() +
                    self.refinement() +
                    -3 * (sv ? sv.value() : 0)


                ) * 10 * Math.pow(100, self.tier() - 1);
        });

        self.downstream_parts = ko.computed(function() {
        	var ds = [];
        	var node = self.node();
        	if(!node) return ds;

        	_.each(node.links, function(l) {
        		if(l.active_flow() === 'down') {
        			var link_node = l.link_node();
        			if(link_node && link_node.part()) {
                                        var part = link_node.part();
                                        if(Ice.isa(part, RelayPart)) {
                                            part = part.find_target();
                                        }
                                        if(part && !_.contains(ds, part)) {
                                            ds.push(part);
                                        }
                                }
        		}
        	});
        	return ds;
        });
        self.upstream_parts = ko.computed(function() {
        	var ds = [];
        	var node = self.node();
        	if(!node) return ds;

        	_.each(node.links, function(l) {
        		if(l.active_flow() === 'up') {
        			var link_node = l.link_node();
        			if(link_node && link_node.part()) {
        				ds.push(link_node.part());
        			}
        		}
        	});
        	return ds;
        });

        self.shines = [];
        for(var x=0;x<6;x++) {
            self.shines.push(Rand.int(0,4));
        }
    },
    raph: function(element, raph) {
        var self = this;

        if(!raph) {
            raph = Raphael(element, self.elsize.x, self.elsize.y);
            raph.outline = raph.path();
            raph.outline.attr('path', poly_path(self.elsize.center(), 27, 6, Math.PI/2));
            raph.outline.attr('stroke-width', 3);
            var fills = generate_hex_fills(self.elsize.center(), 24, 6, Math.PI/2);
            // console.log("Got fills ", fills);
            raph.fills = [];
            _.each(fills, function(path, i) {
                var fill = raph.path();
                fill.attr('path', path);
                fill.attr('name', 'fill_' + i);
                fill.attr('stroke', 'transparent');
                raph.fills.push(fill);
            });
            raph.shines = [];
            var pos = 0;
            _.each(fills, function(path, i) {
                var fill = raph.path();
                fill.attr('path', path);
                fill.attr('name', 'fill_' + i);
                var shine_color = {
                    0: 'rgba(0,0,0,0.125)',
                    1: 'rgba(0,0,0,0.075)',
                    2: 'rgba(255,255,255,0.125)',
                    3: 'rgba(255,255,255,0.075)',
                    4: 'transparent',
                }[self.shines[pos++]]
                // console.log("Shine color will be ", shine_color);
                fill.attr('stroke', 'transparent');
                fill.attr('fill', shine_color);
                raph.shines.push(fill);
            });

            raph.outer_outline = raph.path();
            raph.outer_outline.attr('path', poly_path(self.elsize.center(), 30, 6, Math.PI/2));
            raph.outer_outline.attr('stroke-width', 3);
            raph.focus = raph.path();
            raph.focus.attr('path', poly_path(self.elsize.center(), 33, 6, Math.PI/2));
            raph.focus.attr('stroke-width', 5);
            // raph.part_label = raph.text(self.elsize.x/2, self.elsize.y/2);
            // raph.part_label.attr('font-family', 'magi');
            // raph.order_label = raph.text(self.elsize.x/2, self.elsize.y/2 + 8);
        }

        var tier_colors = [
            '#A57164', // bronze
            '#757575', // silver
            '#aC8C48', // gold
            '#c0c0c0', // platinum
            '#2E5894', // lapis
            '#9C2542', // ruby
            '#319177', // emerald
            '#D98695', // rose
             '#58427C', // amethyst
             '#8FD400', // mithril
        ]

        var inner = (self.tier() - 1) % tier_colors.length;
        var outer = self.tier() < tier_colors.length ? 'transparent' :
                    tier_colors[Math.floor((self.tier() - tier_colors.length) / tier_colors.length) % tier_colors.length];

        inner = tier_colors[inner];


        raph.outline.attr('stroke', inner);
        raph.outer_outline.attr('stroke', outer);
        raph.outer_outline.attr('stroke-opacity', outer === 'transparent' ? '0' : '1');

        // raph.outline.attr('stroke', 'silver');
        // raph.outline.attr('fill', 'transparent');


        var focus_color = self.focused() ? 'yellow' :
                            self.starved() ? 'red' :
                            null;
        raph.focus.attr('stroke', focus_color || 'transparent')
        raph.focus.attr('stroke-opacity', focus_color ? '1' : '0');
        raph.focus.attr('str')
        // raph.part_label.attr('text', self.label());
        // raph.order_label.attr('text', self.node() && self.node().order() ? self.node().order() : 'none');

        // First three are the first stat
        // next three are each stat after that, or the first

        var colors;
        if(Ice.isa(self, ConduitPart)) {
            colors = ['#eee', '#999', '#eee', '#eee', '#999', '#eee'];
        } else if(Ice.isa(self, HopperPart)) {
            colors = ['#eef', '#c99', '#eef', '#eef', '#d99', '#eef'];
        } else if(Ice.isa(self, RelayPart)) {
            colors = ['#cc9', '#9cc', '#cc9', '#cc9', '#9cc', '#cc9'];
        } else if(Ice.isa(self, CapacitorPart)) {
            colors = ['#eee', '#fbb', '#eee', '#eee', '#fbb', '#eee'];
        } else if(Ice.isa(self, CorePart)) {
            colors = ['#f00', '#f99', '#ff0', '#0f9', '#09f', '#f0f'];
        } else if(Ice.isa(self, BlankGeneratorPart)) {
            colors = ['#fbb000', '#fbb000', '#fbb000', '#fbb000', '#fbb000', '#fbb000'];
        } else if(self.highest_stats().length === 0) {
            colors = [
            '#111','#111','#111','#111', '#111', '#111',
            ];
        } else if(self.highest_stats().length === 1) {
            var c = self.highest_stats()[0].color();
            colors = [c,c,c,c,c,c,c];
        } else if(self.highest_stats().length === 2) {
            var c1 = self.highest_stats()[0].color();
            var c2 = self.highest_stats()[1].color();
            colors = [c2, c1, c1, c1, c1, c2];
        } else if(self.highest_stats().length >= 3) {
            var c1 = self.highest_stats()[0].color();
            var c2 = self.highest_stats()[1].color();
            var c3 = self.highest_stats()[2].color();
            colors = [c2, c1, c1, c1, c3, c2];

        }
        // console.log('making part colors ', colors);

        _.each(raph.fills, function(fill, i) {
            var color = colors[i];
            fill.attr('fill', color);
        });

        var stats= self.highest_stats();
        // raph.part_label.attr('text', stats.length ? stats[0].mech().props().noun : 'Nothing');
        return raph;

    },
    double_tap: function() {
        var self = this;
        // console.log("double tap on part");
        // if(!self.node()) return;

        // var empty = _.find(game.inventory_slots(), function(is) {
        //     return !is.part();
        // });
        // if(!empty) return;

        // empty.set_part(self);
        if(!Ice.isa(self.container(), ShopSlot)) return;
        game.move_to_empty_slot(self)
    },
    tap: function(ev) {
        var self = this;
        if(ev.mouseButton == 2) return;
        //console.log("Tapping part");
        if(Ice.isa(self.container(), ShopSlot)) return;
        game.focus_part(self);
    },
    __keys__: function() {
        var self = this;
        return this.$super().concat(['stats_list', 'refinement', 'tier']);
    },
    update_from_jsonable: function(jsonable) {
        var self = this;
        self.$super(jsonable);
        if(!self.stats_list()) {
            self.stats_list([]);
        }
        self.highest_stats.recompute();
    },
    stat_value: function(code) {
        var self = this;
        var sv = self.stats()[code];
        if(!sv) return 0;
        return sv.boosted_total();
    },
    stat_factor: function(code) {
        var self = this;

        return Mechs[code].factor(self.stat_value(code));
    },
    name: Ice.kocomputed(function() {
        var self = this;
        var stats = self.highest_stats();

        if(stats.length == 0) {
            return 'Crystal';
        }
        var highest = stats[0];
        var name = 'Crystal of ' + highest.mech().props().noun;

        if(stats[1])
            name = stats[1].mech().props().adjective + ' ' + name;
        if(stats[2])
            name = stats[2].mech().props().adjective + ' ' + name;
        return name;
    }),
    label: function() {
        var self = this;
        var stats = self.highest_stats();

        if(stats.length == 0) {
            return 'Crystal';
        }
        return stats[0].mech().props().noun;
    },
    can_add_stat: function(code, val) {
        var self = this;

        var sv = self.stats()[code];
        var mech = Mechs[code];
        if(val < 0) {
            if(!sv) {
                return 0;
            }
            if(sv.value() + val < 0) {
                val = -1 * sv.value();
            }
        }

        if(!mech.props().uncounted) {
            return Math.min(val, self.max_refinement() - self.refinement());
            // console.log("Capped to ", capped_amt);
        }
        return val;
    },
    add_stat: function(code, val) {
        var self = this;

        // console.log("Granting ", self.node().loc, code, val);

        var sv = self.stats()[code];
        var mech = Mechs[code];

        var capped_amt = self.can_add_stat(code, val);
        var refinement_cost = mech.props().uncounted ? 0 : capped_amt;

        if(!sv) {
            sv = StatValue();
            sv.code(code);
            sv.value(0);

            self.stats_list.push(sv);
        }
        sv.value.inc(capped_amt);
        self.refinement.inc(refinement_cost);

        if(capped_amt > 0) {
            self.improved(true);
        }
        else
            if(code === 'Flaw')
                self.improved(true);
        return capped_amt;

    },
    add_buff: function(code, buff) {
        var self = this;
        buff = Math.floor(buff);
        var mech = Mechs[code];
        if(mech.props().uncounted) return; // No buffing uncountables!

        sv = self.stats()[code];
        if(sv) {
            sv.buff(sv.buff() + buff);
        } else {
            sv = StatValue(code, 0);
            sv.buff(buff);

            self.stats_list.push(sv);
        }
    },
    clear_buffs: function() {
    	var self = this;
    	// return;
        _.each(self.stats_list(), function(sv) {
            sv.buff(0);
        });
        self.improved(false);
        return;

        // self.stats_list(_.filter(self.stats_list(), function(sv) {
        // 	if(!sv.value()) return false;
        // 	sv.buff(0);
        // 	return true;
        // }));
    },
    tick: function() {
        var self = this;
        // console.log("Ticking part ", self);
        self.starved(false);

        _.each(self.stats(), function(sv) {
            if(!sv.total()) return;
            var mech = Mechs[sv.code()];

            var cost = mech.mana_cost_per_tick(game, self, sv.total(), sv.factor());
            var spent = 0;
            if(cost) {
                spent = game.spend_mana(
                    self,
                    mech.props().cost_reason || mech.props().noun,
                    cost);
            }
            if(cost && !spent) {
                self.starved(true);
                return;
            }

            if(mech.tick) {
                mech.tick(game, self, sv.total(), sv.factor());
            }
        });
    },
    apply: function(game) {
    	var self = this;
        if(!self.starved()) {
        	_.each(self.stats(), function(sv) {
                if(!sv.total()) return;

                var mech = Mechs[sv.code()];
                if(mech.apply) {
                    mech.apply(game, self, sv.total(), sv.factor());
                }
            });
        }
        self.highest_stats.recompute();
    },
    can_move: function(node) {
        return true;
    },
    is_block: function() {
        return false;
    },
    next_tier_at: function() {
        var self = this;
        return Math.pow(10, 0.5 * (self.tier() + 2) * (self.tier() + 3) - 2);
    }
});

CorePart = Part.$extend('CorePart', {
    __init__: function() {
        var self = this;
        self.$super();
        self.max_refinement = ko.observable(Infinity);

        self.glyph_holder_css = ko.computed(function() {
            return 'one_glyph';

        });

        self.glyph_classes = ko.computed(function() {
            return ['icon-core']
        });

    },
    can_move: function(node) {
        return false;
    }
});

FractalPart = Part.$extend('FractalPart', {
    __init__: function() {
        var self = this;
        self.$super();

        self.shell = ko.observable(Shell());
        self.shell().in_part(self);

        self.mana_cost = ko.computed(function() {
            return Math.pow(10000, self.tier());
        });
    },
    __keys__: function() {
        return this.$super().concat(['shell']);
    },
    update_from_jsonable(jsonable) {
        var self = this;
        //console.log("Begin ufj on fractalpart");
        self.$super(jsonable);
        self.shell().in_part(self);
        //console.log("End ufj on fractalpart");
    },
    can_move: function(node) {
        var self = this;
        if(!Ice.isa(node, Node))
            return true;

        return node.shell.depth() <= self.tier();
    },
    double_tap: function() {
        var self = this;
        // if(game.animating_shell()) return;
        // if(!self.node()) return; // Not in islots!
        // game.zoom_to_fractal(self);
        if(!Ice.isa(self.container(), ShopSlot)) return;
        game.move_to_empty_slot(self);
    },
    raph: function(element, raph) {
        var self = this;
        if(!raph) {
            raph = self.$super(element, raph);
            raph.multipolys = {};
            raph.links = {};
            _.each(self.shell().nodes, function(n) {
                var path = raph.multipolys[n.loc] = raph.path();
                var pip_ctr = n.pos.times(0.055).plus(12, 14);
                path.attr('path', poly_path(pip_ctr, 2, 6, Math.PI/2));
                _.each(n.links, function(l) {
                    if(!l.primary()) return;
                    var link_path = raph.path();
                    raph.links[n.loc + '.' + l.direction()] = link_path;
                    var angle = {
                        'e': 60 * 0,
                        'ne': 60 * 1,
                        'nw': 60 * 2,
                        'w': 60 * 3,
                        'sw': 60 * 4,
                        'se': 60 * 5,
                    }[l.direction()];
                    var start_point = pip_ctr.translate(angle, 2);
                    var end_point = start_point.translate(angle, 4);
                    var svg = [
                        'M', start_point.x, start_point.y,
                        'L', end_point.x, end_point.y,
                    ].join(' ');
                    link_path.attr('path', svg);
                    link_path.attr('stroke', 'transparent');
                })
            });
            _.each(self.shell().links, function(l) {

                var path = raph.multipolys[n.loc] = raph.path();
                path.attr('path', poly_path(n.pos.times(0.055).plus(9, 14), 2, 6, Math.PI/2));
            });

        } else {
            raph = self.$super(element, raph);
        }

        self.shell().draw_event();

        _.each(raph.multipolys, function(path, loc) {
            var n = self.shell().nodes[loc];
            if(n.part()) {
                var part_color = 'black';
                var part_stroke = 'black';
                var highest = n.part().highest_stats()[0];
                if(Ice.isa(n.part(), FractalPart)) {
                    part_color = 'white';
                    part_stroke = 'yellow';
                }
                else if(highest) {
                    part_color = highest.color();
                    part_stroke = part_color;
                } else {
                    part_color = 'black';
                    part_stroke = 'silver';
                }
                path.attr('fill', part_color);
                path.attr('stroke', part_stroke);
                path.attr('fill-opacity', 1);
            } else {
                path.attr('fill', 'transparent');
                path.attr('stroke', 'rgba(255,255,255,0.3)');
            }
            // console.log("Setting loc ", loc, " to ", path.attr('fill'));

            _.each(n.links, function(l, dir) {
                if(!l.primary()) return;
                var lp = raph.links[n.loc + '.' + l.direction()];
                if(l.active()) {
                    lp.attr('stroke', 'white');
                    lp.attr('stroke-opacity', 1);
                } else {
                    lp.attr('stroke', 'transparent');
                }
            });
        });
        raph.outline.attr('fill', 'rgba(50,50,50,0.3)')


        return raph;

    }

});

ConduitPart = Part.$extend('ConduitPart', {
    __init__: function() {
        var self = this;
        self.$super();
        self.max_refinement = ko.observable(0);

        self.mana_cost = ko.computed(function() {
            return Math.pow(10000, self.tier());
        });

        self.glyph_holder_css = ko.computed(function() {
            return 'one_glyph';

        });

        self.glyph_classes = ko.computed(function() {
            return ['icon-conduit']
        });
    },
    can_move: function(node) {
        return true;
    },
    is_block: function() {
        return true;
    },
    // No ticking.
    tick: function() {
        return;
    },
    reverse_apply: function(game) {
        var self = this;

        var ups = _.filter(self.upstream_parts(), function(up) {
            // console.log("Can I move ", up, "?  ", !up.is_block());
            return !up.is_block()
        });
        var up = ups[0];
        if(!up) return;



        // I have a part, now look for the next downstream I can put it.
        var node_queue = [self.node()];
        var empty_node = null;
        for(var x = 0; x < node_queue.length; x++) {

            var node = node_queue[x];
            // console.log("Scanning ", node.loc);
            if(!node.part()) {
                empty_node = node;
                break;
            }
            if(node.part() !== self && node.part().is_block()) {
                // Don't search past this.
                continue;
            }

            _.each(node.links, function(l) {
                if(l.active_flow() === 'down') {
                    var link_node = l.link_node();
                    if(link_node) node_queue.push(link_node);
                }
            });
        }

        if(!empty_node) return;
        empty_node.set_part(up);
    }
});

BlankGeneratorPart = Part.$extend('BlankGeneratorPart', {
    __init__: function() {
        var self = this;
        self.$super();
        self.max_refinement = ko.observable(0);

        self.mana_cost = ko.computed(function() {
            return Math.pow(10000, self.tier());
        });

        self.glyph_holder_css = ko.computed(function() {
            return 'one_glyph';

        });

        self.glyph_classes = ko.computed(function() {
            return ['icon-conduit']
        });
    },
    can_move: function(node) {
        return true;
    },
    is_block: function() {
        return true;
    },
    // No ticking.
    tick: function() {
        return;
    },
    reverse_apply: function(game) {
        var self = this;
        self.starved(false);
        
        var blank = Part();
        blank.tier(self.tier());
        
        var node = self.node();

        _.each(node.links, function(l) {
            if(l.active_flow() === 'down') {
                var link_node = l.link_node();
                if(!link_node.part())
                {
                    if(game.mana()<blank.mana_cost())
                    {
                        self.starved(true);
                        return;
                    }
                    link_node.set_part(blank);
                    game.mana.inc((-1)*blank.mana_cost());
                }
            }
        });
        }
});

CapacitorPart = Part.$extend('CapacitorPart', {
    __init__: function() {
        var self = this;
        self.$super();
        self.max_refinement = ko.observable(0);

        self.mana_cost = ko.computed(function() {
            return Math.pow(10000, self.tier());
        });

        self.glyph_holder_css = ko.computed(function() {
            return 'one_glyph';

        });

        self.glyph_classes = ko.computed(function() {
            return ['icon-capacitor']
        });
    },
    is_block: function() {
        return true;
    },
    can_move: function(node) {
        return true;
    },
    // No ticking.
    tick: function() {
        return;
    },
    reverse_apply: function(game) {
        var self = this;

        //console.log("Ticking capacitor");
        var ups = _.filter(self.upstream_parts(), function(up) {
            return !up.is_block() && !up.improved();
        });
        var up = ups[0];
        if(!up) return;



        // I have a part, now look for the next downstream I can put it.
        var node_queue = [self.node()];
        var empty_node = null;
        for(var x = 0; x < node_queue.length; x++) {

            var node = node_queue[x];
            if(!node.part()) {
                empty_node = node;
                break;
            }
            if(node.part() !== self && node.part().is_block()) {
                // Don't search past this.
                continue;
            }

            _.each(node.links, function(l) {
                if(l.active_flow() === 'down') {
                    var link_node = l.link_node();
                    if(link_node) node_queue.push(link_node);
                }
            });
        }

        if(!empty_node) return;
        empty_node.set_part(up);
    }
});


HopperPart = Part.$extend('HopperPart', {
    __init__: function() {
        var self = this;
        self.$super();
        self.max_refinement = ko.observable(0);

        self.mana_cost = ko.computed(function() {
            return Math.pow(10000, self.tier());
        });

        self.glyph_holder_css = ko.computed(function() {
            return 'one_glyph';

        });

        self.glyph_classes = ko.computed(function() {
            return ['icon-hopper']
        });
    },
    is_block: function() {
        return true;
    },
    can_move: function(node) {
        return true;
    },
    // No ticking.
    tick: function() {
        return;
    },
    reverse_apply: function(game) {
        var self = this;

        // console.log("Ticking hopper", self.node().loc);
        var ups = _.filter(self.upstream_parts(), function(up) {
            return !up.is_block() && !up.improved();
        });
        var up = ups[0];
        var islot;
        if(up) {
            // console.log("Trying to move a part into the next islot.", up);
            // If there was an up, then put it in my next empty inventory slot.
            islot = _.find(game.inventory_slots(), function(il) {
                return !il.part();
            });
            if(islot) {
                islot.set_part(up);
            }

        }

        //Next, find the first filled inventory slot.
        islot = _.find(game.inventory_slots(), function(il) {
            return il.part() && !il.part().is_block();
        });

        if(!islot) return;

        // console.log("Trying to move a part downstream.", islot.part());
        // I have a part, now look for the next downstream I can put it.
        var node_queue = [self.node()];
        var empty_node = null;
        for(var x = 0; x < node_queue.length; x++) {

            var node = node_queue[x];
            if(!node.part()) {
                empty_node = node;
                break;
            }
            if(node.part() !== self && node.part().is_block()) {
                // Don't search past this.
                continue;
            }

            _.each(node.links, function(l) {
                if(l.active_flow() === 'down') {
                    var link_node = l.link_node();
                    if(link_node) node_queue.push(link_node);
                }
            });
        }

        if(!empty_node) return;
        empty_node.set_part(islot.part());
    }
});


RelayPart = Part.$extend('RelayPart', {
    __init__: function() {
        var self = this;
        self.$super();
        self.max_refinement = ko.observable(0);

        self.mana_cost = ko.computed(function() {
            return Math.pow(10000, self.tier());
        });

        self.glyph_holder_css = ko.computed(function() {
            return 'one_glyph';

        });

        self.glyph_classes = ko.computed(function() {
            return ['icon-relay']
        });
    },
    can_move: function(node) {
        return true;
    },
    // No ticking.
    tick: function() {
        return;
    },
    find_target: function() {
        var self = this;
        if(!self.node()) return;

        //console.log("Searching for relay target.");
        var target = null;
        var links = _.filter(self.node().links, function(l) {
            return l.active_flow() === 'down';
        });
        //console.log("Found links from relay:", links);
        while(links.length === 1) {
            var link_node = links[0].link_node();
            //console.log("Link node is ", link_node);
            if(!link_node) return null;

            if(link_node && link_node.part() && !Ice.isa(link_node.part(), RelayPart)) {
                //console.log("Link node has a non-relay part", link_node.part());
                return link_node.part();
            }

            links = _.filter(link_node.links, function(l) {
                return l.active_flow() === 'down';
            });
        }
        //console.log("Found no part.");
        return null;

    }
});



StatValue = Ice.$extend('StatValue', {
    __init__: function(code, val) {
        var self = this;
        self.$super();

        self.code = ko.observable(code || 'Mech');
        self.value = ko.observable(val || 0);
        self.value2 = self.value;
        self.buff = ko.observable(0);
        self.total = ko.computed(function() {
            return self.value() + self.buff();
        });
        self.boosted_total = ko.computed(function() {
            return self.total() * game.get_boost_factor(self.code());
        });
        self.mech = ko.computed(function() {
            return Mechs[self.code()];
        })
        self.factor = ko.computed(function() {
            // //console.log("mech for code ", self.code(), " is ", self.mech());
            return self.mech().factor(self.boosted_total());
        });
        self.color = ko.computed(function() {
            return self.mech().props().color;
        });
    },
    as_jsonable: function() {
    	var self = this;
    	var jsonable = self.$super();

    	jsonable.code = self.mech().$class.$name;
    	return jsonable;
    },
    clone: function() {
        var self = this;
        return StatValue(self.code(), self.value());
    },
    __keys__: function() {
        return this.$super().concat(['code', 'value']);
    },
    mana_cost_per_tick: function() {
        var self = this;
        return self.mech().mana_cost_per_tick(self.factor());
    },
    mech: function() {
        var self = this;
        return Mechs[self.code()];
    }
});
