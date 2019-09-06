(() => {
    async function promise_map(ar, fn, threads = 5) {
        if (!ar || !ar.length) return [];
        threads = (+threads) > 1 ? +threads : 1;
        let result = ar.slice ? ar.slice(0) : Array.prototype.slice.call(ar, 0);
        let inProgress = 0;
        let wait, done;
        let empty = () => wait = new Promise(r => done = r);
        empty();
        for (let i = 0; i < ar.length; i++) {
            if (!ar.hasOwnProperty(i)) continue;
            next(i);
            if (inProgress < threads) continue;
            await wait;
            empty();

        }
        while (inProgress) {
            await wait;
            empty();
        }
        return result;
        async function next(i) {
            inProgress++;
            result[i] = await fn(result[i], i, result);
            inProgress--;
            done();
        }
    };
    Array.prototype.pmap = function(f, t = 5) { return promise_map(this, f, t) };
    Promise.map = promise_map;
    Promise.mapSeries = (...a) => promise_map(...a, t);
    Promise.wait = Promise.delay = (t=10) => new Promise(r => setTimeout(r, t));
    Promise.frame = (n) => +n ? Promise.resolve().frame(n) :  new Promise(r => requestAnimationFrame(r));
    Promise.empty = (r, j) => ({ p: new Promise((res, rej) => (r = res, j = rej)), r, j });

    Promise.prototype.wait = Promise.prototype.delay = async function(t=10){
    	let val = await this;
    	await Promise.wait(t);
    	return val;
    };
    Promise.prototype.frame = async function (n) {
    	let val = await this;
    	await new Promise(r => requestAnimationFrame(r));
    	if (typeof n == 'number'){
    	    for(n--;n>0;n--)
            	await new Promise(r => requestAnimationFrame(r));
    	}
    	return val;
    }
})();