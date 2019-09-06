async function start_loading_json() {

    let b = document.querySelector('button');
    b.disabled = true;
    b.innerText = 'Loading...';

    luaName = 'seablock';

    json_wait = fetch(`./data_raw_${luaName}_processed.json?v=001`).then(r=>r.text());

    json_data_raw = await json_wait;

    __init__;

    [raw,entry_list] = just_load_json();

    start_inventory_vue();

}
