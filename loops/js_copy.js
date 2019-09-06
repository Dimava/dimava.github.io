class Game {
    constructor(save) {
        if (save)
            Object.assign(this, save);

        this.tick = 0;
        this.now = performance.now();
    }

    tick() {
        let now = performance.now();
        let deltaTime = now - this.now;
        this.now = now;

    }

}

class Data {
    constructor() {
        this.raw = {
            all: [],
        };
    }
    extend(o) {
        if (!this.raw[o.type])
            this.raw[o.type] = [];
        this.raw[o.type].push(o);
        this.raw.all.push(o);
    }

    compile() {
        for (let o of this.raw.action) {
            this.addPrototype(class Action extends ActionPrototype {
            }
            , o);
        }
        for (let o of this.raw.progress) {
            this.addPrototype(class Action extends PrototypeProtytype {
            }
            , o);
        }
    }

    addPrototype(c, o) {
        let ptype = `${o.type}_prototypes`;
        if (!this[ptype]) {
            this[ptype] = {};
        }
        Object.assign(c.prototype, o);
        this[ptype][o.name] = c;
    }
}

data = new Data();

class PrototypeProtytype {
    constructor(save) {
        Object.assign(this, {
            type: this.type,
            name: this.name,
        });
        if (save) {
            Object.assign(this, save);
        }
    }
}

class ProgressPrototype extends PrototypeProtytype {

}

data.extend({
    type: 'progress',
    name: 'Wander',
})

class ActionPrototype extends PrototypeProtytype {
}

data.extend({
    type: 'action',

    name: "Wander",
    // expMult: 1,
    townNum: 0,

    tooltip: "Explore the town, look for hidden areas and treasures.",
    label: "Wander",
    // labelDone: "Explored",

    varName: "Wander",
    // stats: {
    //     Per: 0.2,
    //     Con: 0.2,
    //     Cha: 0.2,
    //     Spd: 0.3,
    //     Luck: 0.1
    // },
    // affectedBy: 'glasses',
    cost: {
        mana: 250,
    },
    // visible: true,
    // unlocked: true,

    finishRevard: {
        type: 'progress',
        name: 'Wander',
        value: 200,
        // multiplier: {
        //     name: 'glasses',
        //     value: 4,
        // },
    },

})

data.compile();

log(data)
a = new data.action_prototypes.Wander();
log(a);