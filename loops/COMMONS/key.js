(() => {
	let w = nw.Window.get();
    key = function key(key, callback, prevent = false, method = 'keydown') {
        // like "Ctrl+KeyD"
        function pressCode(e) {
            return `${e.ctrlKey?'Ctrl+':''}${e.altKey?'Alt+':''}${e.shiftKey?'Shift+':''}${e.code}`;
        }

        function onkeypress(e) {
            let code = pressCode(e);
            // console.log(code);

            if (code == key)
                if (callback(key, e) || prevent)
                    e.preventDefault();
        }
        if (key)
	        document.addEventListener(method, onkeypress, true);
	    else
	    	document.addEventListener(method, function(e){
	    		console.log(pressCode(e));
	    	},true);

        return function stop() {
            document.removeEventListener(method, onkeypress, true);
        }
    }

    key('F11', () => {
        if (w.isFullscreen)
            w.restore();
        else
            w.enterFullscreen();
    });
    key('Escape', () => {
        if (w.isFullscreen)
            w.restore();
    });

    key('Ctrl+Minus',()=>{
         console.log('Zoom:',w.zoomLevel,'>',w.zoomLevel -= 0.5);
    });
    key('Ctrl+Equal',()=>{
         console.log('Zoom:',w.zoomLevel,'>',w.zoomLevel += 0.5);
    });
    key('Ctrl+Digit0',()=>{
         console.log('Zoom:',w.zoomLevel,'>',w.zoomLevel = 0);
    });

    key('Ctrl+KeyR',()=>{
         location.reload();
    });


})();