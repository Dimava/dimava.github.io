
ko.bindingHandlers.double_tap = {
    init: function(element, valueAccessor) {
        // console.log("Setting up double_tap");
        interact(element).on('doubletap', valueAccessor());

    },
    dispose: function(element, valueAccessor) {
        // console.log("Disposing doubletap");
        interact(element).unset();

    }
}


ko.bindingHandlers.tap = {
    init: function(element, valueAccessor) {
        // console.log("Setting up double_tap");
        interact(element).on('tap', function(event) {
            valueAccessor(event)
        });

    },
    dispose: function(element, valueAccessor) {
        // console.log("Disposing doubletap");
        interact(element).unset();

    }
}


ko.bindingHandlers.right_click = {
    init: function(element, valueAccessor) {
        $(element).on('contextmenu', function(event) {
            //console.log("binding element trying");
            valueAccessor()(event);
            event.preventDefault(true);
        });
    },
    dispose: function(element, valueAccessor) {
        $(element).off('contextmenu', valueAccessor());
    }
}