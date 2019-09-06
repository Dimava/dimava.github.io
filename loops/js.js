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

    get data() {
        return data;
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
    label: "Explored",
})

class ActionPrototype extends PrototypeProtytype {
    constructor() {
        super();
        this.loops = 1;
        this.loopsDone = 0;
        this.loopsLeft = 1;
        this.loopProgress = 0;
        this.complete = false;
    }
}

data.extend({
    type: 'action',

    name: "Wander",
    townNum: 0,

    tooltip: "Explore the town, look for hidden areas and treasures.",
    label: "Wander",

    varName: "Wander",
    cost: {
        mana: 250,
    },

    finishRevard: {
        type: 'progress',
        name: 'Wander',
        value: 200,
        // multiplier: {
        //     name: 'glasses',
        //     value: 4,
        // },
    },

    img: 'img/wander.svg',
    affectedImg: 'img/buyGlasses.svg',

})

data.compile();

log(data)
a = new data.action_prototypes.Wander();
log(a);

game = new Game();

game.mana = 100;
game.maxMana = 250;

game.townNum = 0;

game.town = {
    name: 'Beginnersville',
    vars: [{
        type: 'progressvar',
        label: 'Explored',
        levelLabel: '%',
        level: 75,
        maxLevel: 100,
        exp: 600,
        maxExp: 1000,
        totalExp: 50250,
    }, {
        type: 'checkvar',
        label: 'Pots Smashed',

        left: 4,

        totalFound: 500,

        levelLabel: '%',
        level: 75,
        maxLevel: 100,
        exp: 600,
        maxExp: 1000,
        totalExp: 50250,

        looted: 5,
        left: 15,
        good: 20,
        unchecked: 33,
        found: 500,
        complete: 789,
    }],
    actions: [new data.action_prototypes.Wander(), ],
}

game.actionListCurrent = [];

a = new data.action_prototypes.Wander();
a.complete = true;
a.loopsDone = a.loopProgress = 1;
b = new data.action_prototypes.Wander();
b.loops = 2;
b.loopProgress = 0.5;
c = new data.action_prototypes.Wander();
game.actionListCurrent.push(a,a,a,b,c,c);


function townAddAction(action) {
    console.log(action);
    game.actionListCurrent.push(new action.constructor())
}

vue = new Vue({
    el: '#game',
    data: game,
    methods: {
        townAddAction,
    },
})
