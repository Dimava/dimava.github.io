window._getCookie ??= getCookie;
getCookie = cname => {
    if (cname == '_uuid') {
    	let hash = location.hash.slice(1)
    	if (hash.length == 36) {
			return hash;
		}
    	if (hash.startsWith('acc') && localStorage[hash]) return localStorage[hash];
    }
    return _getCookie(cname);
}
setInterval(() => {
	localStorage['acc' + identityData.uuid] = identityData.accountId;
	localStorage['acc' + identityData.accountId] = identityData.uuid;
	if (localStorage.hash == '#' + identityData.uuid) {
		location.hash = 'acc' + localStorage['acc' + hash];
	}
	document.title = `#${ladderData.yourRanker.rank} ${ladderData.yourRanker.username || 'disconnected'} - Fair Game`;
}, 10e3)
