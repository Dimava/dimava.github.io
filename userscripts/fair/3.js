identityData

window._getCookie ??= getCookie;
getCookie = cname => {
    if (cname == '_uuid') {
    	let hash = location.hash.slice(1)
    	if (hash.length == 36) return hash;
    	if (hash.startsWith('acc') && localStorage[hash]) return localStorage[hash];
    }
    return _getCookie(cname);
}
setTimeout(() => {
	localStorage['acc' + identityData.udid] = identityData.accountId;
	localStorage['acc' + identityData.accountId] = identityData.uuid;
}, 10e3)