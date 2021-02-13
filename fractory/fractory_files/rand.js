Rand = {};
Rand.int = function(min, max) {
    // Inclusive.
    return min + Math.floor(Math.random() * (max-min+1));
};
Rand.choose = function(array) {
    return array[Rand.int(0, array.length-1)];
};
