function solve() {
    if (!globalThis.data)
        return;
    boxs = data.solution.boxs
    if (boxs.length < 2)
        return;

    its = {};
    for (let[i,box] of Object.entries(boxs)) {
        for (let inp of box.ins) {
            if (!its[inp.name]) {
                its[inp.name] = Array(boxs.length).fill(0);
                its[inp.name].out = its[inp.name].ins = 0;
            }
            its[inp.name].ins++;
            its[inp.name][i] = -inp.amount;
        }
        for (let out of box.out) {
            if (!its[out.name]) {
                its[out.name] = Array(boxs.length).fill(0);
                its[out.name].out = its[out.name].ins = 0;
            }
            its[out.name].out++;
            its[out.name][i] = +out.amount;
        }
    }
    its2 = Object.filter(its, e=>e.ins && e.out)
    its3 = Object.filter(its, e=>!e.ins && e.out)

    mx = Object.values(its2)

    out_name = Object.entries(its3)[0][0];
    mx.unshift(its[out_name]);

    mx
    m = new Mx(mx)
    m.push_col(m.map((e,i)=>!i))

    if (!m.gauss_try_solve()) {
        console.warn('unsolvable!');
        // return;
    } else {
        console.log('solvable');
    }
    for (let i = Math.min(m.length - 1, m[0].length - 2); i >= 0; i--)
        m.gauss_step_up(i)
    m.rounded()

    result = m.nth_col(-1).slice(0, m[0].length - 1);
    while (result.length < m[0].length - 1) result.push(0);

    for (let i = 0; i < boxs.length; i++) {
        boxs[i].multi = result[i];
    }

    data.solution.items = Object.map(its, (v,k)=>({
        item: data.raw.entries[k],
        ins: v.ins,
        out: v.out,
        used: v.ins && v.out || k == out_name,
        amount: Math.round(Mx.mul_ar_ar(v, result) * 1e6)/1e6,
    }))

}

solution_fns = {
    solution_push(recipe) {
        let raw = this.raw;
        if (typeof recipe == 'string')
            recipe = raw.recipe[recipe];
        function recbox_itemize({name, type, static_amount}) {
            return {
                name,
                amount: static_amount,
                item: raw.entries[name],
                text: '',
            };
        }
        let recbox = {
            recipe,
            ins: recipe.ingredients.map(recbox_itemize),
            out: recipe.results.map(recbox_itemize),

            multi: 1,
            prod: 1,

            text: '',
        };
        this.solution.boxs.push(recbox);
        solve();
    },
    solution_pop(index) {
        this.solution.boxs.splice(index, 1);
        solve();
    },
    solution_save() {
        return this.solution.boxs.map(e=>e.name);
    },
    solution_load(s) {
        let boxs = Array.isArray(s) ? s : JSON.parse(s || prompt());
        for (let box of boxs) {
            this.solution_push(box);
        }
    },

}

// soltest = {
//     raw,
//     solution: {
//         boxs: [],
//         multi: 1,
//     },
//     ...solution_fns,
// }

// soltest.solution_load(["angelsore3-chunk-processing", "angelsore3-chunk", "angelsore3-crushed", "slag-processing-3", //
// "slag-processing-filtering-1", "slag-processing-dissolution", "stone-crushed-dissolution", "crystal-slurry-filtering-conversion-1", //
// "filter-coal", "crystal-dust-liquify", "geode-blue-processing", "geode-purple-processing", "geode-yellow-processing", //
// "geode-lightgreen-processing", "geode-cyan-processing", "geode-red-processing", "solid-geodes"]);


// soltest.solution.boxs[0]