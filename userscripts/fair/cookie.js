window._getCookie ??= getCookie;
getCookie = cname => {
    if (cname == '_uuid') {
    	let hash = location.hash.slice(1)
    	if (hash.length == 36) {
			if (hash == identityData.uuid) {
				if (localStorage['acc' + hash]) {
					location.hash = localStorage['acc' + hash];
				}
			}
			return hash;
		}
    	if (hash.startsWith('acc') && localStorage[hash]) return localStorage[hash];
    }
    return _getCookie(cname);
}
setInterval(() => {
	localStorage['acc' + identityData.udid] = identityData.accountId;
	localStorage['acc' + identityData.accountId] = identityData.uuid;
	document.title = `#${ladderData.yourRanker.rank} ${ladderData.yourRanker.username || 'disconnected'} - Fair Game`;
}, 10e3)
