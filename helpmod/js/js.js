
    luaName = 'seablock';

async function start_loading_json() {

    let b = document.querySelector('button');
    b.disabled = true;
    b.innerText = 'Loading...';

    __init__;

    json_wait = fetch.cached(`./data_raw_${luaName}_processed.json?v=001`).then(r=>r.text());

    json_data_raw = await json_wait;


    [raw,entry_list] = just_load_json();

    start_inventory_vue();

}

void async function() {
    let url = `./data_raw_${luaName}_processed.json?v=001`;

    let cache = await caches.open('fetch');

    let response = await cache.match(url);

    if (response) {
        document.querySelector('span').innerHTML += `
            <br> This file is already cached so it wont use much time.
        `;
    }

}();
