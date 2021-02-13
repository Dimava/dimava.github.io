TALENT_UNLOCKS = {
     "Flaw":          1,
     "Waxing":      3,
     "Conductivity":  3,
     "Glow":          6,
     "Radiance":      8,
     "Imbuing":       10,
     "Infusing":      12,
     "Brilliance":    14,
     "Mystery":       16,
     "Reflection":       18,
     "Arcana":        20,
     "Vividity":      24,
     "Power":         28,
     "Shine":         32,
     "Lens":          40,
     "Resonance":    50,
     "Prism":         60,
     "Shimmer":        70,
     "Seal":          80,
     "Purity":        90,
     "Gleam":         100
};

Mech = Ice.$extend('Mech', {
    __init__: function() {
        var self = this;
        self.$super();
        self.code = ko.observable(self.$class.$name);
    },
    props: function() {
        return {
            'noun': 'Somethingness',
            'adjective': 'Somethingish',
            'uncounted': true,
        };
    },
    factor: function(val) {
        return val;
    },
    mana_cost_per_tick: function(factor) {
        return 0;
    },
    talent_unlock_level: function() {
        var self = this;
        return TALENT_UNLOCKS[self.code()] || Infinity;
    },
    max_talent_points: function(game) {
        var self = this;
        return Math.floor((game.level() - self.talent_unlock_level())/4) + 1;
    },
    max_upgrade_points: function(game) {
        return Infinity;
    },
    upgrade_arcana_cost: function(points) {
        return Math.floor(100 * Math.pow(1.5, points - 1));
    },
    upgrade_factor: function(points) {
        return Math.pow(1 + points * 0.10, 2);
    },
    talent_boost_factor: function(points) {
        return Math.pow(2, 0.5 * Math.max(0, points-1));
    },
    upgrade_available: function(game) {
        var self = this;
        return _.contains(game.unlocked_stats(), self.code());
    },
    mana_cost_per_work: function(game, part) {
        return 0;
    },
    spend_for_work: function(game, part, max_points) {
        var self = this;
        var mcpw = self.mana_cost_per_work(game, part);

        var potential_cost = max_points * mcpw;
        var spent = game.spend_mana(
            part,
            self.props().cost_reason || self.props().noun,
            potential_cost,
            mcpw);
        var afforded = Math.min(max_points, Math.floor(spent/mcpw));
        if(spent < potential_cost) {
            part.starved(true);
        }
        return afforded;
    }
});

window.log5 = Math.log(5);
window.log100 = Math.log(100);

// scaled on logs, underwhelming
// function buff_factor_a(val) {
//     return Math.pow(2, Math.log(val)/log10 - 1);
// }

// function buff_factor_b(val) {
//     return Math.pow(2, Math.log(val)/log10 * 0.5 - 1);
// }

// function mult_factor_a(val) {
//     return Math.max(1, Math.pow(2, Math.log(val)/log10));
// }

// function mult_factor_b(val) {
//     return Math.max(1, Math.pow(2, Math.log(val)/log10));
// }

// function mult_factor_c(val) {
//     return Math.max(1, Math.pow(2, Math.log(val)/log10));
// }

// Praying to the god of exponents, I should work on my calculus
function buff_factor_a(val) {
    // radiance, lens, prism (buff another piece factor)
    return Math.pow(2, Math.max(0, Math.log(val)) / Math.log(10));
    // return Math.pow(1.1 + 0.0005 * val, 0.5) - 1;
}

function mult_factor_a(val) {
    // used for mystery, brilliance, power (buff this piece factor)
    return Math.pow(2, Math.max(0, Math.log(val)) / Math.log(10))
    // return Math.pow(1 + 0.01 * val, 2);
}

function mult_factor_b(val) {
    // used for vividity (just mana and power, caution)
    return Math.pow(2, Math.max(0, Math.log(val)) / Math.log(10))
    // return Math.pow(1 + 0.005 * val, 2);
}

function mult_factor_c(val) {
    return Math.max(0, Math.log(val)) / Math.log(2)
    // used for gleam (distance buff)
    // return Math.pow(1 + 0.001 * val, 2);
}

/// very old, probably busted
// function buff_factor_a(val) {
//     return (val ? Math.log(val) / log5 : 0);
// }

// function mult_factor_a(val) {
//     return 1 + (val ? Math.log(val) / log5 : 0);
// }

// function mult_factor_b(val) {
//     return 1 + (val ? Math.log(val) / log10 : 0);
// }

// function mult_factor_c(val) {
//     return 1 + (val ? Math.log(val) / log100 : 0);
// }

Flaw = Mech.$extend('Flaw', {
    props: function() {
        return {
            'noun': 'Flaw',
            'adjective': 'Flawed',
            'color': 'hsla(0, 100, 30, 1)',
            'glyph': 'magi_z',
            'non_upgrade': true,
        };
    },
});


Glow = Mech.$extend('Glow', {
    props: function() {
        return {
            'noun': 'Glow',
            'adjective': 'Glowing',
            'color': 'hsla(212, 100, 70, 1)',
            'glyph': 'icon-glow',
        };
    },
    factor: function(val) {
        return Math.max(1, Math.floor(val/4));
    },
    tick: function(game, part, val, factor) {
        var self = this;
        // console.log("ticking Glow, ", val, factor);
        var mana = factor;

        mana *= part.stat_factor('Brilliance');
        mana *= part.stat_factor('Vividity');
        mana = Math.floor(mana);
        // console.log("Glowing mana ", mana);
        if(Number.isNaN(mana)) {
            //console.error("It's nan!");
            //console.trace();
            return;
        }
        game.mana(game.mana() + mana);
        game.mana_generated.inc(mana);
    }
});

// increases mana generation by 1%.
Brilliance = Mech.$extend('Brilliance', {
    props: function() {
        return {
            'noun': 'Brilliance',
            'adjective': 'Brilliant',
            'color': 'hsla(68, 100, 70, 1)',
            'glyph': 'icon-brilliance',
            'min_talent_level': 2,
        };
    },

    factor: function(val) {
        return mult_factor_a(val);
    }
});

// Each downstream part gets x% of this part's stats.
Radiance = Mech.$extend('Radiance', {
    props: function() {
        return {
            'noun': 'Radiance',
            'adjective': 'Radiant',
            'color': 'hsla(354, 100, 70, 1)',
            'glyph': 'icon-radiance',
            'min_talent_level': 2,
        };
    },
    factor: function(val) {
        return buff_factor_a(val);
        //return 0.01 * val;
    },
    apply: function(game, part, val, factor) {
        var self = this;
        _.each(part.downstream_parts(), function(dp) {
            _.each(part.stats(), function(sv) {
                if(sv.code() !== 'Radiance') {
                    // console.log("Applying buff ", sv.code());
                    dp.add_buff(sv.code(), Math.floor(sv.value() * (factor - 1)));
                }
            });
        });

    }
});

// Increases highest stat on downstream
Waxing = Mech.$extend('Waxing', {
    props: function() {
        return {
            'noun': 'Waxing',
            'adjective': 'Waxing',
            'color': 'hsla(128, 100, 70, 1)',
            'glyph': 'icon-waxing',
            'min_talent_level': 3,
        };
    },
    factor: function(val) {
        return Math.max(1, Math.floor(0.12 * val));
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 100 * Math.pow(100, part.tier() -1);
    },
    tick: function(game, part, val, factor) {
        var self = this;
        var dps = part.downstream_parts();
        var each = Math.max(0, Math.floor(factor/dps.length));

        var added = 0;
        _.each(dps, function(dp) {
            var highest = dp.highest_stats()[0];
            if(!highest) return;
            // var amt = Math.min(each, dp.max_refinement() - dp.refinement());
            var could_add = dp.can_add_stat(highest.code(), each);
            var afforded = self.spend_for_work(game, part, could_add);

            added += dp.add_stat(highest.code(), afforded);
        });
    }
});


Conductivity = Mech.$extend('Conductivity', {
    props: function() {
        return {
            'noun': 'Conductivity',
            'adjective': 'Conductive',
            'color': 'hsla(36, 100, 70, 1)',
            'glyph': 'icon-conductivity',
            'min_talent_level': 4,
        };
    },
    factor: function(val) {
        return Math.max(1, Math.floor(0.1 * val));
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 100 * Math.pow(10, part.tier() -1);
    },
    tick: function(game, part, val, factor) {
        var self = this;
        var dps = part.downstream_parts();
        var ups = part.upstream_parts();
        if(!ups.length || !dps.length) {
            // return console.log("Can't transmit with no up and down");
        }
        var each_up = Math.max(0, Math.floor(factor/ups.length));
        var each_down = Math.max(0, Math.floor(each_up/dps.length));
        if(each_down == 0) return; //console.log("Can't transmit 0");;

        _.each(ups, function(up) {
            var candidates = _.filter(up.highest_stats(), function(sv) {
                return sv.total();
            });
            var highest = candidates[candidates.length - 1];
            if(!highest) return;
            _.each(dps, function(dp) {
                var room_for = Math.min(dp.max_refinement() - dp.refinement(), each_down);
                var could_take = up.can_add_stat(highest.code(), -1 * room_for);
                var can_afford_to_take = self.spend_for_work(game, part, -1 * could_take);
                var taken = up.add_stat(highest.code(), -1 * can_afford_to_take);
                if(taken) {

                    dp.add_stat(highest.code(), -1 * taken);

                }
            });
            //var amt = Math.min(each, dp.max_refinement() - dp.refinement());

            //dp.add_stat(highest.code(), amt);
            //dp.refinement.inc(amt);
        });
    }
});


Arcana = Mech.$extend('Arcana', {
    props: function() {
        return {
            'noun': 'Arcana',
            'adjective': 'Arcane',
            'color': 'hsla(267, 100, 70, 1)',
            'glyph': 'icon-arcana',

        };
    },
    factor: function(val) {
        return Math.floor(val);
    },
    tick: function(game, part, val, factor) {
        var self = this;
        // console.log("ticking generation, ", val, factor);
        var arcana = factor;

        arcana *= part.stat_factor('Mystery');
        arcana *= part.stat_factor('Vividity');
        arcana = Math.floor(arcana);
        var afforded = self.spend_for_work(game, part, arcana);
        game.arcana.inc(afforded);
        game.arcana_generated.inc(afforded);
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 1; // * Math.pow(10, part.tier() -1);
    },
    // mana_cost_per_tick: function(game, part, val, factor) {
    //     return Math.max(1, Math.floor(0.2 * val));
    //     return factor * 10;
    // },
});

Mystery = Mech.$extend('Mystery', {
    props: function() {
        return {
            'noun': 'Mystery',
            'adjective': 'Mysterious',
            'color': 'hsla(287, 100, 70, 1)',
            'glyph': 'icon-mystery',
            'min_talent_level': 2,
        };
    },

    factor: function(val) {
        return mult_factor_a(val);
    }
});


// Adds luster to downstream for more refinement
Imbuing = Mech.$extend('Imbuing', {
    props: function() {
        return {
            'noun': 'Imbuing',
            'adjective': 'Imbuing',
            'color': 'hsla(114, 100, 50, 1)',
            'glyph': 'icon-imbuing',
            'min_talent_level': 5,
        };
    },
    tick: function(game, part, val, factor) {
        var self = this;
        var dps = part.downstream_parts();
        var each = Math.max(0, Math.floor(factor/dps.length));

        _.each(dps, function(dp) {
            var amt = each;
            if(dp.$class !== Part) return;
            // var amt = Math.min(each, dp.max_refinement() - dp.refinement());
            var existing = dp.stats().Luster;
            existing = existing ? existing.value() : 0;

            var max = dp.base_max_refinement();
            amt = Math.min(amt, max-existing);

            var afforded = self.spend_for_work(game, part, amt);

            dp.add_stat('Luster', afforded);
            // dp.refinement.inc(amt);
        });
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 100 * Math.pow(100, part.tier() -1);
    },
    factor: function(val) {
        return Math.max(1, Math.floor(1 + val * 0.05));
    }
});

Luster = Mech.$extend('Luster', {
    props: function() {
        return {
            'noun': 'Luster',
            'adjective': 'Lustrous',
            'color': 'hsla(114, 100, 50, 1)',
            'glyph': 'magi_h',
            'uncounted': true,
        };
    },
    factor: function(val) {
        return val;
    }
});

// improves tier
Infusing = Mech.$extend('Infusing', {
    props: function() {
        return {
            'noun': 'Infusing',
            'adjective': 'Infusing',
            'color': 'hsla(176, 100, 50, 1)',
            'glyph': 'icon-infusing',
            'min_talent_level': 6,
        };
    },
    tick: function(game, part, val, factor) {
        var self = this;
        var dps = part.downstream_parts();
        var each = Math.max(0, Math.floor(factor/dps.length));

        _.each(dps, function(dp) {
            if(dp.tier() > part.tier()) return;
            if(dp.$class !== Part) return;

            var amt = each;
            // var amt = Math.min(each, dp.max_refinement() - dp.refinement());
            var existing = dp.stats()['Infused'];
            if(existing) {
                var max = dp.next_tier_at();
                // var max = 10 * Math.pow(1000, dp.tier());
                amt = Math.min(amt, max-existing.value());
                if(dp.tier() > part.tier()) amt = 0;
            }
            var afforded = self.spend_for_work(game, part, amt);

            dp.add_stat('Infused', afforded);
            // dp.refinement.inc(amt);
        });
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 100 * Math.pow(100, part.tier() -1);
    },

    factor: function(val) {
        return Math.max(1, Math.floor(1 + val * 0.05));
    }
});

Infused = Mech.$extend('Infused', {
    props: function() {
        return {
            'noun': 'Infused',
            'adjective': 'Infused',
            'color': 'hsla(176, 100, 50, 1)',
            'glyph': 'magi_i',
            'uncounted': true,
        };
    },
    factor: function(val) {
        return val;
    },
    apply: function(game, part, val, factor) {
        var self = this;
        var max = part.next_tier_at();

        if(factor >= max) {
            part.stats()['Infused'].value(0);
            part.tier.inc(1);
        }
    },
});

//increases mana and arcana
Vividity = Mech.$extend('Vividity', {
    props: function() {
        return {
            'noun': 'Vividity',
            'adjective': 'Vivid',
            'color': 'hsla(95, 100, 70, 1)',
            'glyph': 'icon-vividity',
            'min_talent_level': 8,
        };
    },

    factor: function(val) {
        return mult_factor_b(val);
    }
});

// Increases all other stats on this piece
Power = Mech.$extend('Power', {
    props: function() {
        return {
            'noun': 'Power',
            'adjective': 'Powerful',
            'color': 'hsla(125, 100, 70, 1)',
            'glyph': 'icon-power',
            'min_talent_level': 9,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        _.each(part.highest_stats(), function(sv) {
            if(!(sv.code() === self.code()))
                part.add_buff(sv.code(), sv.total() * (factor - 1))
        });
    },
    factor: function(val) {
        return buff_factor_a(val);
    }
});


// Inceases each non-Shine stat on downstream parts by 1%
Shine = Mech.$extend('Shine', {
    props: function() {
        return {
            'noun': 'Shine',
            'adjective': 'Shining',
            'color': 'hsla(310, 100, 70, 1)',
            'glyph': 'icon-shine',
            'min_talent_level': 10,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        _.each(part.downstream_parts(), function(dp) {
            _.each(dp.highest_stats(), function(sv) {
                if(sv.code() === self.code()) return;

                dp.add_buff(sv.code(), sv.value() * (factor - 1));
            });
        });
    },
    factor: function(val) {
        return buff_factor_a(val);
    }
});

// buffs this piece by 1% of upstream.
Lens = Mech.$extend('Lens', {
    props: function() {
        return {
            'noun': 'Lens',
            'adjective': 'Lensing',
            'color': 'hsla(220, 100, 50, 1)',
            'glyph': 'icon-lens',
            'min_talent_level': 12,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        _.each(part.upstream_parts(), function(up) {
            _.each(up.highest_stats(), function(sv) {
                if(sv.code() === self.code()) return;

                part.add_buff(sv.code(), sv.value() * (factor-1))
            });
        });
    },
    factor: function(val) {
        return buff_factor_a(val);
    }
});

// Buffs each downstram by 1% of single upstream.
Prism = Mech.$extend('Prism', {
    props: function() {
        return {
            'noun': 'Prism',
            'adjective': 'Prismatic',
            'color': 'hsla(70, 100, 50, 1)',
            'glyph': 'icon-prism',
            'min_talent_level': 14,

        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        if(part.upstream_parts().length !== 1) return;
        var up = part.upstream_parts()[0];

        _.each(part.downstream_parts(), function(dp) {
            _.each(up.highest_stats(), function(sv) {
                if(sv.code() === self.code()) return;

                dp.add_buff(sv.code(), sv.value() * (factor - 1))
            });
        });
    },
    factor: function(val) {
        return buff_factor_a(val);

    }
});

// Buffs this piece by 1% for each other stat on it.
Shimmer = Mech.$extend('Shimmer', {
    props: function() {
        return {
            'noun': 'Shimmer',
            'adjective': 'Shimmering',
            'color': 'hsla(350, 100, 50, 1)',
            'glyph': 'icon-shimmer',
            'min_talent_level': 16,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        var f = (part.highest_stats().length - 1) * factor;
        _.each(part.highest_stats(), function(sv) {
            if(sv.code() === self.code()) return;
            part.add_buff(sv.code(), sv.total() * f)
        });
    },
    factor: function(val) {
        return mult_factor_c(val);
    }
});

// Buffs this piece by 1% if it has no downstream.
Seal = Mech.$extend('Seal', {
    props: function() {
        return {
            'noun': 'Seal',
            'adjective': 'Sealing',
            'color': 'hsla(210, 100, 50, 1)',
            'glyph': 'icon-seal',
            'min_talent_level': 18,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        if(part.downstream_parts().length !== 0) return;

        _.each(part.highest_stats(), function(sv) {
            if(sv.code() === self.code()) return;
            part.add_buff(sv.code(), sv.total() * factor)
        });
    },
    factor: function(val) {
        return mult_factor_a(val);
    }
});

// Adds flux to clone upstream stats to downstream.
Resonance = Mech.$extend('Resonance', {
    props: function() {
        return {
            'noun': 'Resonance',
            'adjective': 'Resonant',
            'color': 'hsla(240, 100, 50, 1)',
            'glyph': 'icon-resonance',
            'min_talent_level': 20,
        };
    },
    tick: function(game, part, val, factor) {
        var self = this;
        var dps = part.downstream_parts();
        var each = Math.max(0, Math.floor(factor/dps.length));

        if(part.upstream_parts().length !== 1) return;
        var up = part.upstream_parts()[0];

        var up_total = 0;
        _.each(up.highest_stats(), function(sv) {
            up_total += sv.value();
        });

        _.each(dps, function(dp) {
            var amt = each;
            // var amt = Math.min(each, dp.max_refinement() - dp.refinement());
            var existing = dp.stats()['Flux'];
            if(existing) {
                var max = up_total;
                amt = Math.min(amt, max-existing.value());
            }
            var afforded = self.spend_for_work(game, part, amt);

            dp.add_stat('Flux', afforded);
            // dp.refinement.inc(amt);
            existing = dp.stats()['Flux'];
            if(existing && existing.value() >= up_total) {
                dp.add_stat('Flux', -1 * up_total);
                _.each(up.highest_stats(), function(sv) {
                    dp.add_stat(sv.code(), sv.value());
                });
            }
        });
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 100 * Math.pow(100, part.tier() -1);
    },
    factor: function(val) {
        return Math.max(1, Math.floor(1 + val * 0.05));
    }
});

Flux = Mech.$extend('Flux', {
    props: function() {
        return {
            'noun': 'Flux',
            'adjective': 'Fluctuating',
            'color': 'hsla(270, 100, 50, 1)',
            'glyph': 'icon-flux',
            'non_upgrade': true,
        };
    },
    factor: function(val) {
        return val;
    },
});

// Buffs the highest stat on this part.
Purity = Mech.$extend('Purity', {
    props: function() {
        return {
            'noun': 'Purity',
            'adjective': 'Pure',
            'color': 'hsla(290, 100, 50, 1)',
            'glyph': 'icon-purity',
            'min_talent_level': 22,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        var highest = part.highest_stats()[0];
        if(!highest) return;
        if(highest.code() === self.code()) return;
        var total_base = 0;
        _.each(part.highest_stats(), function(sv) {
            total_base += sv.value();
        });
        if(!total_base || highest.value() / total_base < 0.5) {
            return;
        }

        part.add_buff(highest.code(), highest.total() * factor);
    },
    factor: function(val) {
        return mult_factor_a(val);
    }
});

// Buffs each other stat on this piece by 0.1%/distance.
Gleam = Mech.$extend('Gleam', {
    props: function() {
        return {
            'noun': 'Gleam',
            'adjective': 'Gleaming',
            'color': 'hsla(310, 100, 50, 1)',
            'glyph': 'icon-gleam',
            'min_talent_level': 24,
        };
    },
    apply: function(game, part, val, factor) {
        var self = this;
        var f = part.node().order() * factor;
        _.each(part.highest_stats(), function(sv) {
            if(sv.code() === self.code()) return;
            part.add_buff(sv.code(), f * sv.total());
        });
    },
    factor: function(val) {
        return mult_factor_c(val);
    }
});

// Copies highest stat from one upstream to downstream, limited to upstream's base.
Reflection = Mech.$extend('Reflection', {
    props: function() {
        return {
            'noun': 'Reflection',
            'adjective': 'Reflective',
            'color': 'hsla(330, 100, 70, 1)',
            'glyph': 'icon-reflection',
            'min_talent_level': 3,
        };
    },
    factor: function(val) {
        return Math.max(1, Math.floor(0.12 * val));
    },
    mana_cost_per_work: function(game, part) {
        var self = this;

        return 500 * Math.pow(100, part.tier() -1);
    },
    tick: function(game, part, val, factor) {
        var self = this;
        var dps = part.downstream_parts();
        if(dps.length !== 1) return;
        var ups = part.upstream_parts();
        if(ups.length !== 1) return;

        var dp = dps[0];
        var highest = ups[0].highest_stats()[0];
        //var each = Math.max(0, Math.floor(factor/dps.length));
        if(!highest) return;

        var added = 0;

            var existing = dp.stats()[highest.code()];
            var already_has = existing ? existing.value() : 0;

            var could_add = factor;
            could_add = Math.min(could_add, highest.value() - already_has);

            could_add = dp.can_add_stat(highest.code(), could_add);
            var afforded = self.spend_for_work(game, part, could_add);

            added += dp.add_stat(highest.code(), afforded);
    }
});

//magi_v used by conduit

Mechs = {};
_.each(Mech.$subclasses, function(kls) {
    var m = kls();
    Mechs[m.$class.$name] = m;
});
Mechs['Mech'] = Mech();

Mech.STARTING_MECHS = ['Glow', 'Arcana'];