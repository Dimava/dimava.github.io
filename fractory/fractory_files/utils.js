function ShowFullErrorStacks() {

     window.onerror = function (errorMsg, url, lineNumber, columnNumber, errorObject) {
                var errMsg;
                //check the errorObject as IE and FF don't pass it through (yet)
                if (errorObject && errorObject !== undefined) {
                        errMsg = errorObject.message;
                    }
                    else {
                        errMsg = errorMsg;
                    }
                console.error('Error: ' + errMsg);
        };

        (function() {
              var existing = ko.bindingProvider.instance;

                ko.bindingProvider.instance = {
                    nodeHasBindings: existing.nodeHasBindings,
                    getBindings: function(node, bindingContext) {
                        var bindings;
                        try {
                           bindings = existing.getBindings(node, bindingContext);
                        }
                        catch (ex) {
                           if (window.console && console.log) {
                               console.log("binding error", ex.message, node, bindingContext);
                           }
                        }

                        return bindings;
                    }
                };

            })();
}

luhn = function(cardNumber) {
    if(typeof cardNumber !== 'string' || cardNumber.length < 2)
        return false;
    var digits = cardNumber.split('').reverse().map(function(x) {
        return parseInt(x, 10);
    }).filter(function(x) {
        return !isNaN(x);
    });
    var s1 = digits.filter(function(x, i) {
        return i % 2 === 0;
    }).reduce(function(a, x) {
        return a + x;
    }, 0);
    var s2 = digits.filter(function(x, i) {
        return i % 2 === 1;
    }).map(function(x) {
        return (x * 2).toString().split('').reduce(function(a, x) {
            return a + parseInt(x, 10);
        }, 0);
    }).reduce(function(a, x) {
        return a + x;
    }, 0);
    return (s1 + s2) % 10 === 0;
};




function loadExternalKnockoutTemplates(src_prefix, callback) {
    var sel = 'div[kot]:not([loaded]),script[kot]:not([loaded])';
    var $toload = $(sel);
    function oncomplete() {
        console.log("Loaded this", this);
        this.attr('loaded', true);
        var $not_loaded = $(sel);
        if(!$not_loaded.length) {
            callback();
        }
    }
    if(!$toload.length) {
        callback();
        return;
    }

    _.each($toload, function(elem) {
        var $elem = $(elem);
        var kot = $elem.attr('kot');
        var src = (src_prefix || '') + kot;
        $elem.attr('id', 'kot/'+kot);
        $elem.attr('type', 'text/html');
        $elem.attr('src', src);
        // console.log("Trying to load for ", $elem);
        $elem.load(src, _.bind(oncomplete, $elem));
        // console.log("Loaded in theory.");
    });
}

function LazyTemplate(src_prefix, template) {
    if(template === undefined) {
        template = src_prefix;
        src_prefix = LazyTemplate.default_path;
        console.log("Auto prepending ", src_prefix, " to ", template);
    }

    var computed = LazyTemplate.computeds[template];
    if(computed) {
        // console.log('returning computed()', computed());
        return computed();
    }

    var signal = LazyTemplate.signals[template];
    if(!signal) {
        signal = LazyTemplate.signals[template] = ko.observable(false);
    }

    computed = window.lt_obs = ko.computed(function() {
        signal();
        // Try to find the template.
        var sel = 'div[type="text/html"][loaded][id="' + template + '"]';
        sel += ',script[type="text/html"][loaded][id="' + template + '"]';
        //console.log("Looking for", sel);
        var s = $(sel);
        if(s.length) {
            // console.log('I am going to return the normal one.', template);
            return template;
        }

        // Are we loading it?
        s = $('div[type="text/html"][id="' + template + '"],script[type="text/html"][id="' + template + '"]');
        if(!s.length) {
            // Begin loading it.
            s = $('<div kot="' + template + '" type="text/html" style="display: none">');
            s.appendTo($('body'));
            //console.log(loadExternalKnockoutTemplates);
            loadExternalKnockoutTemplates(src_prefix, function() {
                // One or more may have finished.
                _.each(LazyTemplate.signals, function(signal, template) {
                    var sel = 'div[type="text/html"][loaded][id="' + template + '"]';
                    if($(sel).length) {
                        // Signal this computed to re-evaluate.
                        console.log('Going to signal ', template, 'that it is loaded.');
                        signal(true);
                        signal.notifySubscribers(signal());
                        //computed.notifySubscribers(computed());
                    }
                });
            });
        }
        return 'not_loaded_yet.html';
    });
    computed.signal = signal;
    LazyTemplate.computeds[template] = computed;
    return computed();
}
LazyTemplate.computeds = {};
LazyTemplate.signals = {};
LazyTemplate.default_path;

function MonkeypatchKoTemplateBinding() {
    console.log("Monkeypatched ko template");
    var templateWithContext = _.omit(ko.bindingHandlers.template);
    templateWithContext.baseupdate = templateWithContext.update;
    templateWithContext.update = function(element, valueAccessor, allBindings, data, context) {

        var options = ko.utils.unwrapObservable(valueAccessor());
        var extra_context = _.omit(options || {}, ['data', 'name', 'as']);
        extra_context = ko.utils.extend(context.$extra || {}, extra_context);
        ko.utils.extend(context, extra_context);
        ko.utils.extend(context, {'$extra': extra_context});

        return templateWithContext.baseupdate.apply(this, arguments);
    };

    // Good bye knockout template binding, brian just raped you, and you liked it :)
    // console.log("Magic!");
    ko.bindingHandlers.template = templateWithContext;
}

function MonkeypatchKoWithBinding() {
    ko.bindingHandlers.single_with = ko.bindingHandlers.with;

    // This with takes multiple attributes as {}, and keeps those in scope in further children scopes
    // as opposed to the normal with, which will lose them when $data changes and so the implicit $data[] lookup fails.
    // Taken straight out of knockout.  http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html
    ko.bindingHandlers.with = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements
            var childBindingContext = bindingContext.createChildContext(
                bindingContext.$rawData,
                null, // Optionally, pass a string here as an alias for the data item in descendant contexts
                function(context) {
                    ko.utils.extend(context, valueAccessor());
                });
            ko.applyBindingsToDescendants(childBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };
}


var moneyObs = function(init, nullable) {
    function coerce(val) {
        if(val === '' || val === null || val === "undefined") {
            if(nullable) {
                return null;
            } else {
                return 0;
            }
        }
        return parseFloat(val, 10);

    }

    var obs = ko.observable(coerce(init));
    var fixed = ko.computed({
        read: function() {
            if(obs() === null) {
                return '';
            }
            if(!obs().toFixed) {
                console.log("Something's wrong with a money observable.  It has ", obs(), "in it, which isn't a number.");
            }
            return obs().toFixed(2);
        },
        write: function(val) {
            var parsed = coerce(val);

            if(isNaN(parsed)) {
                fixed.notifySubscribers(obs());
                return;
            }
            parsed = Number(parsed.toFixed(2));
            if(obs() === parsed) {
                fixed.notifySubscribers(obs());
            }
            obs(parsed);
        }
    });

    obs.fixed = fixed;
    obs(obs());
    //result(init);
    return obs;

    /*result.fixed = ko.comput
    return result;*/
};


var dateObservable = function(init, nullable, fmt) {
    if(nullable === undefined) nullable = true;

    function coerce(val) {
        if(val === '' || val === null || val === "undefined") {
            if(nullable) {
                return null;
            } else {
                return new Date();
            }
        }
        return new Date(val);

    }

    var obs = ko.observable(coerce(init));
    var date = ko.computed({
        read: function() {
            if(obs() === null) {
                return '';
            }
            if(!obs() instanceof Date) {
                console.log("Something's wrong with a date observable.  It has ", obs(), "in it, which isn't a date.");
            }
            return moment(obs()).strftime(fmt);
        },
        write: function(val) {
            var parsed = coerce(val);

            if(isNaN(parsed)) {
                date.notifySubscribers(obs());
                return;
            }
            obs(parsed);
        }
    });

    obs.date = date;
    obs(obs());
    //result(init);
    return obs;

    /*result.fixed = ko.comput
    return result;*/
};


function quantityObservable(initial) {
    var internal_obs = ko.observable(initial);
    var computed = ko.computed({
        'read': internal_obs,
        'write': function(new_val) {
            if(isNaN(Number(new_val)) || new_val === '') {
                computed.revert();
                return;
            }
            if(new_val % 1 !== 0) {
                computed.revert();
                return;
            }
            if(new_val < 1) {
                internal_obs(1);
                computed.revert();

            } else {
                internal_obs(Number(new_val));
            }
        }

    });
    computed.revert = function () {

        computed.notifySubscribers(computed());
        internal_obs.notifySubscribers(internal_obs());
    };
    return computed;
}

function cloneObservable(obs) {
    return ko.computed({
        read: obs,
        write: obs,
    });
}


function clampObservable(obs, min, max, nullable) {
    var clamped = ko.computed({
        read: obs,
        write: function(val) {

            if(val === '') {
                if(!nullable) {
                    clamped.revert();
                    return;
                }
                else {
                    obs(null);
                    return;
                }
            }

            if(isNaN(Number(val))) {
                clamped.revert();
                return;
            }

            if(min !== undefined && min !== null && val < min) {
                val = min;
            } else if(max !== undefined && max !== null && val > max) {
                val = max;
            }
            obs(Number(val));
            clamped.revert();

        }
    });
    clamped.revert = function () {
        obs.notifySubscribers(obs());
        clamped.notifySubscribers(clamped());
    };
    obs.clamped = clamped;
    return obs;
}



function tidyObservable(dirtyobs, val, is_already_wrapped) {
    var obs;
    if(!is_already_wrapped) {
        obs = ko.observable(val);
    } else {
        //console.log("Not wrapping because obs is ", obs);
        obs = val;
    }
    //var
    //obs.tidy = window.tidyCount++;
    obs.subscribeChanged(function(newValue, oldValue) {
        //console.log("changed, newvalue is ", newValue, "oldvalue is ", oldValue);
        if(newValue === oldValue) {
            return;
        }
        if(newValue === "" && oldValue === null) {
            obs(null); // No, go back to null.
            return;
        }
        if(newValue === null && oldValue === "") {
            return;
            // this is from me coercing it in the immediately preceding if.
        }
        if(!dirtyobs()) {
            // console.log("Making dirty from ", oldValue, newValue);
            //window.dirtything = obs;
            dirtyobs.newValue=newValue;
            dirtyobs.oldValue=oldValue;
            dirtyobs(true);
        }
    });
    return obs;
}

// http://stackoverflow.com/questions/18016718/using-knockout-js-how-do-bind-a-date-property-to-a-html5-date-picker
ko.bindingHandlers.datePicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        // Register change callbacks to update the model
        // if the control changes.
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor();
            var target_date = element.valueAsDate;
            var truncated = new Date(target_date.getFullYear(), target_date.getMonth(), target_date.getDate());
            //console.log("value in the thing is ", element.valueAsDate);
            value(truncated);
        });
    },
    // Update the control whenever the view model changes
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value =  valueAccessor();
        var unwrapped = ko.utils.unwrapObservable(value());
        //console.log("Unwrapped is now ", unwrapped);
        if(unwrapped === undefined || unwrapped === null) {
            element.value = '';
        } else {
            element.valueAsDate = unwrapped;//.toISOString();
        }
    }
};


function flash($el, color) {

    $el.stop(true, true);
    $el.effect({
        effect: 'highlight',
        color: color
    });
}