
Tooltip = Ice.$extend('Tooltip', {
    __init__: function(obj) {
        this.$super(obj);
        var self = this;
        this.obj = obj;
        this.structure = null;
        obj.$el.addClass('.tooltipped');
        //obj must have an $el which has a backwards reference to it.
        //this.$el = TEMPLATES.clone('tooltip', this);
        //console.log(obj.$el);
        $(obj.$el).tooltip({
            content: function(callback) {self.generate_content(this, callback);},
            items:obj.$el,
            open: function(event, ui) { self.open_tooltip(event, tooltip); },
            close: function(event, ui) { self.hide_tooltip(event, tooltip); }
        });
    },
    generate_content: function(el, callback) {
        //console.log('generate_content, this=', this);
        if(!this.structure) {
            this.structure = $('<div>');
            this.structure.addClass('tooltip');
            this.obj.generate_tooltip(this, this.structure);
        }

        this.obj.render_tooltip(this);

        callback( this.structure);

    },
    open_tooltip: function(event, tooltip) {
        this.obj.render_tooltip(this);
        this.obj.evChanged.sub(this.rerender, this);
        //potato.x; // force the tooltip to die.
        return true;

    },
    hide_tooltip: function(event, tooltip) {
        this.obj.evChanged.unsub(this);
    },
    rerender: function() {
        this.obj.render_tooltip(this);
    }
});
Tooltip.structures = {};