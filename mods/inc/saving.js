// saving.js
// ctrl+C for fast export
// ctrl+V, ctrl+V, Enter for fast import
// ctrl+S is not implemented yet, please wait

// you may use this by adding `<script src="https://dimava.github.io/mods/inc/saving.js"></script>` to index.html
// or putting a local copy of it next to index.html and adding `<script src="saving.js"></script>`
// https: version has autoupdates, but local version is more safe in case you don't trust me because it has no autoupdates

// pooplib
q = s => document.querySelector(s);

addEventListener('keydown', event => {
	if (event.code == 'KeyC' && event.ctrlKey) {
		q('#option-export-save-button').click();
	}
	if (event.code == 'KeyV' && event.ctrlKey) {
		q('#option-import-save-button').click();
		q('#import-save-textarea').focus();
	}
});

setTimeout(()=>{
	q('#import-save-textarea').onkeydown = event => {
		if (event.code == 'Enter') {
			event.preventDefault();
			q('#import-save-confirm-button').click();
		}
	}
});