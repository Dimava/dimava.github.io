KeyBindings = Ice.$extend('KeyBindings', {
    __init__: function(game) {
        this.game = game;

        var self = this;

        function selfdot(fn) {
            return _.bind(fn, self);
        }
        
        self.binds = ko.observableArray();
        self.set_defaults();
        
    },
    
    reset_to_defaults: function() {
        var self = this;
        if(window.confirm("This will reset all the hotkeys to their defaults, continue?")) {
            _.each(self.binds(), function(keybind){
                Mousetrap.unbind(keybind.key());
                keybind.key(keybind.default);
            });
            self.bind_all_keys();
        }
    },
    
    set_defaults: function() {
        var self = this;
        self.binds(
            [
            {default:'e', shop_mode:'blank', description: 'Place a blank crystal.'},
            {default:'b', shop_mode:'blank', description: 'Place a blank crystal.'},
            {default:'q', shop_mode:'single', description: 'Place currently selected simple gem from the shop.'},
            {default:'f', shop_mode:'fractal', description: 'Place a fractal.'},
            {default:'r', shop_mode:'relay', description: 'Place a relay.'},
            {default:'c', shop_mode:'conduit', description: 'Place a conduit.'},
            {default:'a', shop_mode:'capacitor', description: 'Place a capacitor.'},
            {default:'h', shop_mode:'hopper', description: 'Place a hopper.'},
            {default:'g', shop_mode:'blank_generator', description: 'Place a blank generator.'},
            {default:'d', fn:self.delete, description: 'Delete the crystal under your cursor.'},
            {default:'[', fn:self.copy_fractal_links, description: 'Copy the link layout of current fractal.'},
            {default:']', fn:self.paste_fractal_links, description: 'Paste the copied link layout.'},
            {default:'shift+space', fn:self.toggle_pause, description: 'Pause or unpause the game.'},
            {default:'shift+]', fn:self.clear_fractal_links, description: 'Clear all the links in the current fractal.'},
            {default:'shift+[', fn:self.fill_fractal_links, description: 'Activate all links in the current fractal.'}
            ]);
        
        //Default hotkeys for all crystal types
        var digit = 1;
        var bound_key;
        _.each(Mechs, function(mech){
            if(digit<10)
                bound_key = digit.toString();
            else if(digit==10)
                bound_key = '0';
            else if(digit>10 && digit<20)
                bound_key = 'shift+'+(digit%10).toString();
            else if(digit==20)
                bound_key = 'shift+0';
            else 
                bound_key = 'alt+'+(digit%10).toString();
            
            if(!(mech.props().uncounted || mech.props().non_upgrade))
            {
                var mech_name = mech.$class.$name;
                self.binds().push({default : bound_key, fn : function() {self.quick_crystal(mech_name);},description: 'Place '+mech_name+'.', mech: mech_name});
                digit++;
            }
        });
        
        _.each(self.binds(), function(keybind){
            keybind.key = ko.observable(keybind.default);
        });
    },
    
    bind_all_keys: function() {
        var self = this;
        //Makes the hotkeys update in controls pane when rebinding them
        //Add default hotkeys == the ones in code; bind the hotkeys 
        _.each(self.binds(), function(keybind){
            self.do_binding(keybind);
        });
    },
    
    do_binding: function(keybind) {
        var self = this;
        if(keybind.key() == 'Unbound') return;
        if(keybind.key() == 'esc') {
            keybind.key(keybind.default);
        }
        
        if(keybind.shop_mode)
            Mousetrap.bind(keybind.key(), function(){self.quick_buy(keybind.shop_mode);});
        else
            Mousetrap.bind(keybind.key(), _.bind(keybind.fn, self), keybind.on ? keybind.on : "keydown");
    },
    
    unlocked: function(keybind) {
        if(keybind.mech)
            return _.contains(game.unlocked_stats_list(),keybind.mech);
        else if(keybind.shop_mode)
            return _.contains(_.map(game.shop_slots(), function(ss){return ss.mode();}),keybind.shop_mode);
        else
            return true;
    },
    
    rebind: function(keybind, old_key, new_key) {
        var self = this;
        
        if(new_key == 'esc')
            new_key = keybind.default;
        var same_key_binding = _.find(self.binds(),function(bind){return bind.key() === new_key});
        
        if(same_key_binding) {
            if(new_key == keybind.default) {
                Mousetrap.unbind(old_key);
                keybind.key('Unbound');
                return;
            }
            
            var conf = window.confirm('"'+same_key_binding.description + '" is already bound to '+new_key+', it will be returned to default or unbound!');
            if(conf) {
                Mousetrap.unbind(old_key);
                Mousetrap.unbind(new_key);
                same_key_binding.key(same_key_binding.default);
                keybind.key(new_key);
                self.do_binding(keybind);
                self.rebind(same_key_binding,'Unbound',same_key_binding.default);
                return;
            }
            else {
                keybind.key(old_key);
                return;
            }
        }

        Mousetrap.unbind(old_key);
        keybind.key(new_key);
        self.do_binding(keybind);
    },
    
    record_rebind: function(keybind) {
        var self = this;
        var old_key = keybind.key();
        keybind.key('Press new key');
        
        Mousetrap.record(function(sequence){
            var bound_sequence = sequence.join(' ');
            self.rebind(keybind, old_key, bound_sequence);
        });
    },
    
    quick_buy: function(shop_mode) {
        var self=this;
        
        if(!window.game) return;
        var shop_slot = _.find(game.shop_slots(), function(ss) {
            return ss.mode() === shop_mode;
        });
        if(!shop_slot) return;

        var container = game.hovered_node() || game.hovered_inventory_slot();
        if(!container) return;       
        if(container.part()) return;

        if(shop_mode==='fractal') {
            self.quick_fractal(shop_slot);
            return;
        }

        var part = shop_slot.part();
        container.set_part(part);
        game.hovered_part(part);
    },
    
    quick_fractal: function(shop_slot) {
        var container = game.hovered_node();
        var requiredTier = container.shell.depth();
        if(requiredTier <= shop_slot.tier()) {
            part = shop_slot.part();
        }
        else {
            if(requiredTier <= shop_slot.max_tier()) {
                shop_slot.tier(requiredTier);
                shop_slot.restock();
                part = shop_slot.part();
            }
        }
        container.set_part(part);
        game.hovered_part(part);
        return;

        container = game.hovered_inventory_slot();
        if(!container) return;
        if(container.part()) return;
        
        part = shop_slot.part();
        container.set_part(part);
        game.hovered_part(part);
    },
    
    delete: function() {
        if(!window.game) return;
        
        var part = game.hovered_part();
        if(!part) return;
        if(part.mana_cost() == Infinity) return;
        if(Ice.isa(part.container(), ShopSlot)) return;
        
        if(game.last_moved_part() == part)
            game.last_moved_part(null);
        part.container().part(null);
        part = null;
                
    },
    
    toggle_pause: function() {
        if(!window.game) return;
        game.paused()?game.unpause():game.pause();
    },
    
    quick_crystal: function(mech_name){
        if(!window.game) return;
        var container = game.hovered_node() || game.hovered_inventory_slot();
        if(!container) return;       
        if(container.part()) return;
        
        if(!_.contains(game.unlocked_stats_list(),mech_name)) return;

        var shop_slot = _.find(game.shop_slots(), function(ss) {
            return ss.mode() === 'single';
        });
        var tier = shop_slot.tier();
        var max_refinement = Math.pow(100, tier);
        var refinement_used, budget;
        refinement_used = _.random(0, max_refinement);
        
        var part = Part();
        part.tier(tier);

        budget = Math.floor(refinement_used * 0.5);

        var flaw = Math.floor(refinement_used - budget);
        part.add_stat('Flaw', flaw);

        part.add_stat(mech_name, budget);
        part.refinement(refinement_used);
        part.highest_stats.recompute();
        
        var cost = Math.floor(part.mana_cost());
        if(game.mana()>=cost)
        {
            container.set_part(part);
            game.hovered_part(part);
            game.mana(game.mana()-cost);
        }
    },
   
    copy_fractal_links: function(){
        if(!window.game) return;
        var pattern = '=';
        var lastState;
        var curRun = 0;
        var counter = 0;
        var goodLinks = [0,1,2,3,4,5,7,8,9,10,11,14,15,16,17,20,21,22,23,26,27,28,29,32,33,34,35,39,40,41,43,44,45,49,52,53,57,60,61,65,68,69,73,76,77,81,84,85];
        Object.keys(game.shell_renders()[game.shell_renders().length - 1].nodes).forEach(function(nodeName) {
            var thisNode = game.shell_renders()[game.shell_renders().length - 1].nodes[nodeName];
            Object.keys(game.shell_renders()[game.shell_renders().length - 1].nodes[nodeName].links).forEach(function(linkName) {
                if (goodLinks.includes(counter)) {
                    var thisLink = game.shell_renders()[game.shell_renders().length - 1].nodes[nodeName].links[linkName];
                    if (counter == 0) {
                        lastState = thisLink.active();
                        if (lastState) {
                            pattern = "+";
                        } else {
                            pattern = "-";
                        }
                    }

                    if (thisLink.active() == lastState) {
                        //console.log("Incrementing.");
                        curRun++;
                    } else {
                        //curRun++;
                        pattern = pattern + curRun + "-";
                        lastState = !lastState
                        //console.log("Resetting to " + lastState + " after " + curRun + " steps.");
                        curRun = 1;
                    }
                    //console.log("Link " + counter + " is " + thisLink.active());
                }
                counter++;
            });
        });
        curRun++;
        pattern = pattern + curRun + "=";
        //console.log(pattern);

        game.saved_fractal_pattern(pattern);
        //console.log("Saving");
        alert("Saved!");
    },
 
    paste_pattern: function(pattern){
        if(!window.game) return;
        var curRun = 0;
        var curRunLength = 0;
        var lastState;
        // Check our first state.
        if (pattern.indexOf('-') == 0) {
            lastState = true;
        } else if (pattern.indexOf('+') == 0) {
            lastState = false;
        } else {
            // Not a valid pattern.
            return;
        }
        // Strip first state character.
        pattern = pattern.substr(1);
        var counter = 0;
        var goodLinks = [0,1,2,3,4,5,7,8,9,10,11,14,15,16,17,20,21,22,23,26,27,28,29,32,33,34,35,39,40,41,43,44,45,49,52,53,57,60,61,65,68,69,73,76,77,81,84,85];
        Object.keys(game.shell_renders()[game.shell_renders().length - 1].nodes).forEach(function(nodeName) {
            var thisNode = game.shell_renders()[game.shell_renders().length - 1].nodes[nodeName];
            Object.keys(game.shell_renders()[game.shell_renders().length - 1].nodes[nodeName].links).forEach(function(linkName) {
                if (goodLinks.includes(counter)) {
                    // Are we starting our next run?
                    if (curRun == curRunLength) {
                        //console.log("Next run length is: " + pattern.substr(0, pattern.indexOf('-')));
                        curRunLength = parseInt(pattern.substr(0, pattern.indexOf('-')));
                        pattern = pattern.substr(pattern.indexOf('-') + 1);
                        lastState = !lastState;
                        curRun = 0;
                    }
                    var thisLink = game.shell_renders()[game.shell_renders().length - 1].nodes[nodeName].links[linkName];
                    curRun++;
                    //console.log("Setting " + thisNode.loc + "/" + thisLink.direction() + " to " + lastState + "(" + curRun + "/" + curRunLength + ")");
                    thisLink.set_active(lastState, true);
                }
                counter++;
            });
        });

        game.shell().refresh_all_flow();
        //console.log("Pasting");
    },
    
    paste_fractal_links: function()
    {
        if(!window.game) return;
        var self = this;
        self.paste_pattern(game.saved_fractal_pattern());
    },
    
    clear_fractal_links: function()
    {
        if(!window.game) return;
        var self = this;
        self.paste_pattern(game.saved_clear_pattern());
    },
    
    fill_fractal_links: function()
    {
        if(!window.game) return;
        var self = this;
        self.paste_pattern(game.saved_filled_pattern());
    },

    save_to_patch: function(patch) {
        var self = this;
        patch.keybindings = {};
        _.each(self.binds(),function(keybind,index) {
            patch.keybindings[index] = {default: keybind.default, key: keybind.key()};
        });
        return patch;
    },
    
    update_from_jsonable: function(jsonable) {
        var self = this;
        if(!jsonable.keybindings)
            return;
        
        _.each(jsonable.keybindings, function(loaded_kb){
           var keybind = _.find(self.binds(),function(kb){return kb.default == loaded_kb.default;}); 
           keybind.key(loaded_kb.key);
        });
    }
    /*shop_next: function() {
        var self = this;
        if(!window.game) return;
        var shop_slot = _.find(game.shop_slots(), function(ss) {
            return ss.mode() === 'single';
        });
        shop_slot.next_stat();
    },
    
    shop_prev: function() {
        var self = this;
        if(!window.game) return;
        var shop_slot = _.find(game.shop_slots(), function(ss) {
            return ss.mode() === 'single';
        });
        shop_slot.prev_stat();
    },*/
});
