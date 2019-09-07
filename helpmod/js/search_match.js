/*
    used in search bar
*/

function full_match(str) {
    let parts = str.match(/([^\s"]+|".*?")+/g);
    if (!parts)
        return ()=>true;
    try {
        let fns = parts.map(part_match);
        return (item)=>fns.every(fn=>fn(item));
    } catch (e) {
        return ()=>true
    }
}
function part_match(part) {
    let m = part.match(/^([^":]*:)?("?)([^:"]*?)("?)$/);
    if (!m)
        return item=>true;
    let[s_s,s_in,s_quote,s_name] = m;
    let s = {
        s_s,
        s_in,
        s_quote,
        s_name
    }

    let fn = item=>true;
    if (s_in == ':' && !s_name) {
        fn = item=>false;
    } else if (s_in == 'in:' || s_in == 'i:') {
        if (s_quote) {
            fn = (recipe)=>recipe.type == 'recipe' && recipe.ingredients.find(e=>e.name == s_name);
        } else {
            fn = (recipe)=>recipe.type == 'recipe' && recipe.ingredients.find(e=>e.name.includes(s_name));
        }
    } else if (s_in == 'out:' || s_in == 'o:') {
        if (s_quote) {
            fn = (recipe)=>recipe.type == 'recipe' && recipe.results.find(e=>e.name == s_name);
        } else {
            fn = (recipe)=>recipe.type == 'recipe' && recipe.results.find(e=>e.name.includes(s_name));
        }
    } else if (s_in == 'io:') {
        if (s_quote) {
            fn = (recipe)=>recipe.type == 'recipe' && (recipe.ingredients.find(e=>e.name == s_name) || recipe.results.find(e=>e.name == s_name));
        } else {
            fn = (recipe)=>recipe.type == 'recipe' && (recipe.ingredients.find(e=>e.name.includes(s_name)) || recipe.results.find(e=>e.name.includes(s_name)));
        }
    } else if (s_in == 'cat:') {
        if (s_quote) {
            fn = (recipe)=>recipe.type == 'recipe' && recipe.category == s_name;
        } else {
            fn = (recipe)=>recipe.type == 'recipe' && recipe.category.includes(s_name);
        }
    } else if (!s_in && s_name == '*') {
        fn = (item)=>true;
    } else if (!s_in) {
        if (s_quote) {
            fn = (item)=>item.name == s_name;
        } else {
            fn = (item)=>item.name.includes(s_name);
        }
    } else if (s_in == ':' && s_name) {
        if (s_name == 'p') {
            fn = (item)=>item.placed;
        } else if (s_name == 'r' || s_name == 'recipe') {
            fn = (item)=>item.type == 'recipe';
        } else if (s_name == 'i' || s_name == 'item') {
            fn = (item)=>item.type == 'item';
        } else if (s_name == 'f' || s_name == 'fuel') {
            fn = (item)=>item.fuel_value;
            // } else if ('recipe'.startsWith(s_name)) {
            //     fn = (item)=>item.type == 'recipe';
            // } else if ('item'.startsWith(s_name)) {
            //     fn = (item)=>item.type == 'item';
            // } else if ('fuel'.startsWith(s_name)) {
            //     fn = (item)=>item.fuel_value;
        } else {
            fn = (item)=>item.type.startsWith(s_name) || item.placed && item.placed.type.startsWith(s_name);
            // if (s_quote) {
            //     fn = (recipe)=>recipe.type == 'recipe' && (recipe.ingredients.find(e=>e.name == s_name) || recipe.results.find(e=>e.name == s_name));
            // } else {
            //     fn = (recipe)=>recipe.type == 'recipe' && (recipe.ingredients.find(e=>e.name.includes(s_name)) || recipe.results.find(e=>e.name.includes(s_name)));
            // }
        }
    } else {
        console.log('Search string is invalid: %o', s_s, s);
    }
    return fn;
}
