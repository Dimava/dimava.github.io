Boost = Ice.$extend('Boost', {
    __init__: function(code) {
        var self = this;
        self.$super();

        self.code = ko.observable(code);
        self.factor = ko.observable(1);
    },
    __keys__: function() {
        return this.$super().concat([
            'code', 'factor'
        ]);
    }
});