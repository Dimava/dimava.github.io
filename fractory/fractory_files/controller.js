// I'm gonna try and do roughly the same trick as I did with tooltips.
// However, I'm probably going to try to cache them since you shouldn't be able to have more than one up at the same time.
// (Maybe.)



Controller = Ice.$extend('Controller', {
    __init__: function(obj) {
      this.$super();
      // We don't really have to construct these, since I probably already have them open somewhere.
      this.obj = obj;

      this.$dialog = null;
      this.is_open = false;
      this.obj.$el.on('click', _.bind(this.open, this));



    },
    open: function() {
        if(!this.$dialog) {
            this.obtain_dialog();
        }

        // We don't stay bound to the element unless
        // we're being shown.
        this.bind_to_obj();
        this.render_controller();
        //obj.render_controller(this, this.$dialog);

        if(Controller.active_controller) {
            Controller.active_controller.close();
        }

        this.$dialog.dialog({
            resize: false,
            //Title defaults to $dialog's title attr,
            // which construct_controller will set.
            closeOnEscape: true,
            width: '360px',
            height: 280,
            close: _.bind(this.onClose, this)
        });

        Controller.active_controller = this;

    },
    close: function() {
        this.$dialog.dialog("destroy");
    },
    onClose: function() {
        this.obj.unsub(this);
    },
    obtain_dialog: function() {
        this.$dialog = TEMPLATES.clone('controller_dialog', this);
        this.construct_controller();
    },
    construct_controller: function() {
        this.obj.construct_controller(this, this.$dialog);
    },
    render_controller: function() {
        //console.log(this.obj.pretty());
        this.obj.render_controller(this, this.$dialog);
    },
    bind_to_obj: function() {
        this.obj.evChanged.sub(this.onObjChange, this);
    },
    onObjChange: function(obj, obs, eargs) {
        this.render_controller();
        //this.obj.render_controller(this, this.$dialog);
    }
});