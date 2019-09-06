/*
    load raw, generate groups
*/

function just_load_json(luaName=globalThis.luaName) {
    let raw = JSON.parse(json_data_raw);

    let entry_list = Object.values(raw).flatMap(Object.values);

    raw.entries = {};

    for (let it of entry_list) {

        if (it.placed && typeof it.placed == 'string')
            it.placed = raw[it.placed][it.place_result];

        if (it.type == 'item-subgroup' && typeof it.items[0] == 'string')
            it.items = it.items.map(e=>{
                let[a,b] = e.split('.');
                return raw[a][b];
            }
            );

        if (it.type == 'item-group' && typeof it.subgroups[0] == 'string')
            it.subgroups = it.subgroups.map(e=>raw['item-subgroup'][e]);

        if (it.type == 'item' || it.type == 'fluid' || !raw.entries[it.name])
            raw.entries[it.name] = it;
    }

    raw.entry_list = entry_list;
    raw.grouped_list = entry_list.filter(e=>e.subgroup);

    return [raw, entry_list];
}

function dig(o, p='raw', fn=log) {
    if (typeof (o) != 'object' || !o)
        return;
    if (!fn(o, p))
        for (let k in o) {
            dig(o[k], k == '0' || +k ? `${p}[${k}]` : k.includes('-') ? `${p}["${k}"]` : `${p}.${k}`, fn)
        }
}

function jjj(j) {
    return JSON.parse(JSON.stringify(j));
}
