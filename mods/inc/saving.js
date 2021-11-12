// saving.js

// you may use this by adding `<script src="https://dimava.github.io/mods/inc/saving.js"></script>` to index.html
// please note that using https: copy of this script instead of a file copy is a security vulnerability 

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