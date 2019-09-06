function start_inventory_vue() {

    
q('body').innerHTML = '';
console.time('inventory vue');

div = elm('#div').appendTo(document.body);
qq('link[href*=awsm]').map(e=>e.remove());

html_icontest = `
<div class="html_icontest">
    <div class="btn" 
                v-for="(group, index) of groups"
                :title="group.name" @click="group_selected = index">
        <img class="img64" :src="itemImage(group)">
    </div>
    <div v-for="group of groups">
        <div v-for="subgroup of group.subgroups">
            <div :class="['btn', 'btn_'+item.type]"
                        v-for="item of subgroup.items"
                        :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))
                            + '\\n: ' + item.desc + (item.type != 'recipe' ? '' : '\\nin: ' + item.made_in)" >
                <img class="img32" :src="itemImage(item)" @click="log($event, jjj(item), book_item_click(item))">
            </div>
        </div>
    </div>
</div>
`
// recipe only:
html_recipe_only = `
<div class="html_recipe_only">
    <table>
        <tr v-for="(recipe_line,recipe_index) of solution.boxs" @contextmenu.prevent="solution_pop(recipe_index)">
            <td class="recbox_recipe">
                <div :class="['btn', 'btn_'+item.type]" v-for="item of [recipe_line.recipe]"
                            :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))
                                + '\\n: ' + item.desc + (item.type != 'recipe' ? '' : '\\nin: ' + item.made_in)" >
                    <img class="img32" :src="itemImage(item)" @click="log($event, jjj(item))">
                </div>
            </td>
            <td class="recbox_input">
                <div class="inline" v-for="input in recipe_line.recipe.ingredients">
                    <div :class="['btn', 'btn_'+item.type]" v-for="item of [raw[input.type][input.name]]"
                                :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                        <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'in')">
                    </div>x{{ input.static_amount }}
                </div>
            </td>
            <td class="recbox_output">
                <div class="inline" v-for="input in recipe_line.recipe.results">
                    <div :class="['btn', 'btn_'+item.type]" v-for="item of [raw[input.type][input.name]]"
                                :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                        <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'out')">
                    </div>x{{ input.static_amount }}
                </div>
            </td>
        </tr>
    </table>
</div>
`
html_recipe_val = `
<div class="html_recipe_val">
    <table>
        <tr v-for="(recbox,recipe_index) of solution.boxs" @contextmenu.prevent="solution_pop(recipe_index)">
            <td class="recbox_recipe">
                <div :class="['btn', 'btn_'+item.type]" v-for="item of [recbox.recipe]"
                            :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))
                                + '\\n: ' + item.desc + (item.type != 'recipe' ? '' : '\\nin: ' + item.made_in)" >
                    <img class="img32" :src="itemImage(item)" @click="log($event, jjj(item))">
                </div>
            </td>
            <td class="recbox_input">
                <div class="inline" v-for="inp of recbox.ins">
                    <div :class="['btn', 'btn_'+item.type]" v-for="item of [inp.item]"
                                :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                        <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'in')">
                    </div>
                    <div class="in3line">
                        <input v-model="inp.text">
                        <input readonly :value="'x'+fround(inp.amount * recbox.multi, 8)">
                        <input readonly :value="'x'+fround(inp.amount, 8)">
                    </div>
                </div>
            </td>
            <td class="recbox_output">
                <div class="inline" v-for="out of recbox.out">
                    <div :class="['btn', 'btn_'+item.type]" v-for="item of [out.item]"
                                :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                        <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'out')">
                    </div>
                    <div class="in3line">
                        <input v-model="out.text">
                        <input readonly :value="'x'+fround(out.amount * recbox.multi * recbox.prod, 8)">
                        <input readonly :value="'x'+fround(out.amount, 8)">
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <div>
        <br><br>
        <div class="inline" v-for="item in solution.items" v-if="!item.ins && item.out">
            <div :class="['btn', 'btn_'+item.type]" v-for="item of [item.item]"
                        :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'out')">
            </div>
            <div class="in3line">
                <input model="out.text">
                <input readonly :value="item.out + ' -> ' + item.ins + (!item.used ? '' : ' used')">
                <input readonly :value="'x'+fround(item.amount, 8)">
            </div>
        </div>
        <br><br>
        <div class="inline" v-for="item in solution.items" v-if="item.ins && item.out">
            <div :class="['btn', 'btn_'+item.type]" v-for="item of [item.item]"
                        :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'out')">
            </div>
            <div class="in3line">
                <input model="out.text">
                <input readonly :value="item.out + ' -> ' + item.ins + (!item.used ? '' : ' used')">
                <input readonly :value="'x'+fround(item.amount, 8)">
            </div>
        </div>
        <br><br>
        <div class="inline" v-for="item in solution.items" v-if="item.ins && !item.out">
            <div :class="['btn', 'btn_'+item.type]" v-for="item of [item.item]"
                        :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))" >
                <img class="img32" :src="itemImage(item)" @click="recipe_ingridient_click(item,'out')">
            </div>
            <div class="in3line">
                <input model="out.text">
                <input readonly :value="item.out + ' -> ' + item.ins + (!item.used ? '' : ' used')">
                <input readonly :value="'x'+fround(-item.amount, 8)">
            </div>
        </div>
    </div>
</div>
`
// search:
html_search = `
<div class="html_search">
    <div class="html_search_input">
        <input v-model="filter_string"> <button @click="filter_string=''">x</button>
    </div>
    <div class="html_search_groups">
        <div class="btn" :class="group_selected == index?'selected':''" 
                    v-for="(group, index) of groups"
                    v-if="group.subgroups.find(e=>e.items.find(ee=>filter_by_string(ee)))"
                    :title="group.name" @click="group_selected = index">
            <img class="img64" :src="itemImage(group)">
        </div>
    </div>
    <div class="html_search_items">
        <div v-for="subgroup in groups[group_selected].subgroups">
            <div :class="['btn', 'btn_'+item.type]"
                        v-for="item of subgroup.items"
                        v-if="filter_by_string(item)"
                        :title="item.type + '\\n' + item.name + '\\norder: ' + item.order + '\\nicon: ' + (item.icon||stringify(item.icons))
                            + '\\n: ' + item.desc + (item.type != 'recipe' ? '' : '\\nin: ' + item.made_in) + (item.placed ? '\\nplaced: ' + item.placed.type : '')" >
                <img class="img32" :src="itemImage(item)" @click="book_item_click(item)">
            </div>
        </div>
    </div>
</div>
`

div.innerHTML = html_search + html_recipe_only;
div.innerHTML = html_search + html_recipe_val;



var [vue_raw, vue_entrylist] = just_load_json();


data = {
    groups: vue_raw['item-group'],
    group_selected: Object.keys(vue_raw['item-group'])[0],

    raw: vue_raw,

    solution: {
        boxs: [],
        multi: 1,
        items: {},
    },

    filter_string: "",
}
methods = {
    itemImage(item) {
        if (item.icon_data) {
            return item.icon_data;
        }
        if (typeof item.icon == 'string') {
            return './data/' + item.icon;
        }

        return './data/__base__/graphics/icons/info.png'

    },
    log(...a) {
        return console.log(...a);
    },
    stringify: JSON.stringify,
    jjj,

    book_item_click(item) {
        if (item.type == 'recipe') {
            this.solution_push(item);
        } else {
            data.filter_string = `io:"${item.name}"`;
        }
    },

    filter_by_string(item) {
        if (this.filter_by_string.str == data.filter_string)
            return this.filter_by_string.filter(item);

        let str = this.filter_by_string.str = data.filter_string;

        let fn = this.filter_by_string.filter = full_match(str);

        return this.filter_by_string(item);
    },

    recipe_ingridient_click(item, io='io') {
        let fs = data.filter_string;
        if (io == 'in')
            io = 'out';
        else if (io == 'out')
            io = 'in';
        data.filter_string = `${io}:"${item.name}"`;
        let alike = raw.grouped_list.filter(e=>this.filter_by_string(e));
        if (alike.length == 1) {
            this.book_item_click(alike[0]);
            data.filter_string = fs;
        }
    },

    fround(n, p) {
        if (!n) return n;
        let s = Math.sign(n);
        if (s == -1) {
            n = -n;
            p--;
        }
        let pw = 10 ** p;
        if (n < 1 && n * pw > 1)
            return s * Math.round(n * pw) / pw;
        let m = 1;
        while (n < pw) {
            n *= 10;
            m *= 10;
        }
        return s * (n - n % 1 + Math.round(n % 1)) / m;
    },

    ...solution_fns,
}

if (this.vue)
    vue.$destroy()
vue = new Vue({
    el: div,
    data,
    methods,
})

vue.solution_load(["angelsore3-chunk-processing", "angelsore3-chunk", "angelsore3-crushed", "slag-processing-3",//
 "slag-processing-filtering-1", "slag-processing-dissolution", "stone-crushed-dissolution",//
  "crystal-slurry-filtering-conversion-1", "filter-coal", "crystal-dust-liquify", "geode-blue-processing",//
   "geode-purple-processing", "geode-yellow-processing", "geode-lightgreen-processing", "geode-cyan-processing", "geode-red-processing", "solid-geodes"]);

console.timeEnd('inventory vue');

}