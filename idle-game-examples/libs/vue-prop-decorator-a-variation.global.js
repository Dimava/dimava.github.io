/**
  * vue-prop-decorator-a-variation v0.4.0
  * (c) 2021-present Dimava
  * @license MIT
  */
var VueDAV = (function (exports, vue, vueClassComponent) {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _wrapRegExp() {
    _wrapRegExp = function (re, groups) {
      return new BabelRegExp(re, void 0, groups);
    };

    var _super = RegExp.prototype,
        _groups = new WeakMap();

    function BabelRegExp(re, flags, groups) {
      var _this = new RegExp(re, flags);

      return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
    }

    function buildGroups(result, re) {
      var g = _groups.get(re);

      return Object.keys(g).reduce(function (groups, name) {
        return groups[name] = result[g[name]], groups;
      }, Object.create(null));
    }

    return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
      var result = _super.exec.call(this, str);

      return result && (result.groups = buildGroups(result, this)), result;
    }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
      if ("string" == typeof substitution) {
        var groups = _groups.get(this);

        return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
          return "$" + groups[name];
        }));
      }

      if ("function" == typeof substitution) {
        var _this = this;

        return _super[Symbol.replace].call(this, str, function () {
          var args = arguments;
          return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
        });
      }

      return _super[Symbol.replace].call(this, str, substitution);
    }, _wrapRegExp.apply(this, arguments);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    Object.defineProperty(subClass, "prototype", {
      value: Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      }),
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * Makes valudator out of definition array
   * *Class check requires the constructor which is bad for treeshaking* - fixme
   */

  function makeValidator(propDefinition, key) {
    var types = {
      number: Number,
      string: String,
      bigint: BigInt,
      "boolean": Boolean,
      symbol: Symbol,
      object: Object,
      "function": Function,
      undefined: undefined
    };
    var list = Array.isArray(propDefinition) ? propDefinition : typeof propDefinition == 'function' ? [propDefinition] : [types[_typeof(propDefinition)]];
    var allowedValues = list.flatMap(function (e) {
      return Array.isArray(e) ? e : [];
    });
    var allowedTypes = list.flatMap(function (e) {
      return typeof e == 'function' && types[e.name.toLowerCase()] == e ? [e.name.toLowerCase()] : [];
    });
    var allowedClasses = list.flatMap(function (e) {
      return typeof e == 'function' && types[e.name.toLowerCase()] != e ? [e] : [];
    });
    return function (value) {
      if (allowedValues.includes(value)) return true;
      if (allowedTypes.includes(_typeof(value))) return true;
      if (allowedClasses.find(function (c) {
        return value instanceof c;
      })) return true;
      var typeName = [].concat(_toConsumableArray(allowedValues), _toConsumableArray(allowedTypes.map(function (e) {
        return 'type:' + e;
      })), _toConsumableArray(allowedClasses.map(function (e) {
        return 'class:' + e.name;
      })));
      vue.warn("Invalid prop: type check failed for prop %o. Expected one of %o, got %o. ", key, typeName, value);
      return false;
    };
  }

  function makePropClass(propDefinitionObject) {
    var props = {};

    for (var key in propDefinitionObject) {
      var source = propDefinitionObject[key];

      if (_typeof(source) == 'object') {
        if (source == null) {
          props[key] = {
            required: false
          };
          continue;
        } else if (!Array.isArray(source)) {
          props[key] = source;
          continue;
        }
      }

      var required = Array.isArray(source) ? !!source.find(function (e) {
        return Array.isArray(e) && e.length == 0;
      }) : typeof source == 'function' ? true : false;
      var defaultV = Array.isArray(source) ? source.find(function (e) {
        return !Array.isArray(e) && typeof e != 'function';
      }) : typeof source == 'function' ? undefined : source;
      var validator = makeValidator(source, key);
      props[key] = {
        required: required,
        "default": defaultV,
        validator: validator
      };
    }

    return /*#__PURE__*/function () {
      function _class() {
        _classCallCheck(this, _class);

        return props;
      }

      return _createClass(_class);
    }();
  }

  function convertTemplate(descriptor) {
    var _ref, _descriptor$value;

    var template = '';
    var value = (_ref = (_descriptor$value = descriptor.value) !== null && _descriptor$value !== void 0 ? _descriptor$value : descriptor.get) !== null && _ref !== void 0 ? _ref : '';

    if (typeof value == 'function') {
      var _template$match$reduc, _template$match;

      var g0 = /`([^]*)`/; // fixme I would like ability to use objects inside
      //   /  (?<opn>  = | =" | =' | \{\{ | \{ |)  \$  \{  (?<val>[^}]+)  \}  (?<cls> \}\} | \} | " | ' |)  /g 

      var g2 = /*#__PURE__*/_wrapRegExp(/(=|="|='|\{\{|\{|)\$\{((?:(?!\})[\s\S])+)\}(\}\}|\}|"|'|)/g, {
        opn: 1,
        val: 2,
        cls: 3
      });

      var f2 = function f2(_s, groups) {
        var opn = groups.opn,
            val = groups.val,
            cls = groups.cls;
        var os = "".concat(opn, "_").concat(cls);
        if (os == '=_') return "".concat(opn, "\"").concat(val.replaceAll('"', '\"'), "\"").concat(cls);
        if (os == '{_}') return "".concat(opn, "{").concat(val, "}").concat(cls);
        return "".concat(opn).concat(val).concat(cls);
      };

      template = (value + '').match(g0)[1].trim().replaceAll(g2, function (s) {
        var _ref2;

        return f2(s, (_ref2 = (arguments.length <= 1 ? 0 : arguments.length - 1) - 1 + 1, _ref2 < 1 || arguments.length <= _ref2 ? undefined : arguments[_ref2]));
      });
      var whitespace = (_template$match$reduc = (_template$match = template.match(/\n[ \t]*/g)) === null || _template$match === void 0 ? void 0 : _template$match.reduce(function (v, e) {
        return v.length < e.length ? v : e;
      })) !== null && _template$match$reduc !== void 0 ? _template$match$reduc : '\n';
      template = template.replaceAll(whitespace, '\n');
    } else if (typeof value == 'string') {
      var _template$match$reduc2, _template$match2;

      template = value;

      var _whitespace = (_template$match$reduc2 = (_template$match2 = template.match(/\n[ \t]*/g)) === null || _template$match2 === void 0 ? void 0 : _template$match2.reduce(function (v, e) {
        return v.length < e.length ? v : e;
      })) !== null && _template$match$reduc2 !== void 0 ? _template$match$reduc2 : '\n';

      template = template.replaceAll(_whitespace, '\n');
    } else {
      throw new Error('Template descriptor is not a string or a function');
    }

    return template;
  }
  function Template(target, propertyKey, descriptor) {
    var _t$__o;

    var t = typeof target == 'function' ? target : target.constructor;
    var template = '';

    if (descriptor) {
      template = convertTemplate(descriptor);
    } else {
      template = convertTemplate(target[propertyKey]);
    }

    t.__o = Object.assign((_t$__o = t.__o) !== null && _t$__o !== void 0 ? _t$__o : {}, {
      template: template
    });
  }

  var globalComponents = {};
  function GlobalComponent() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function convert(target) {
      var _comp$__o, _comp$__o$name;

      var comp = target;
      comp.__o = Object.assign(comp.__o || {}, options);
      (_comp$__o$name = (_comp$__o = comp.__o).name) !== null && _comp$__o$name !== void 0 ? _comp$__o$name : _comp$__o.name = target.name; // comp.__o.__sauce = comp;

      globalComponents[comp.__o.name] = comp;

      if (!comp.__o.template) {
        var templateKeys = ['__t', '_t', 'Template', 'template'];

        if (templateKeys.find(function (k) {
          return k in comp.prototype;
        })) {
          var _iterator = _createForOfIteratorHelper(templateKeys),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var k = _step.value;

              if (Object.prototype.hasOwnProperty.call(comp.prototype, k)) {
                comp.__o.template = convertTemplate(Object.getOwnPropertyDescriptor(comp.prototype, k));
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }

      return comp;
    }

    if (typeof options == 'function') {
      var target = options;
      options = {};
      return convert(target);
    } else {
      return convert;
    }
  }
  var known = {
    install: function install(app) {
      for (var k in globalComponents) {
        app.component(k, globalComponents[k]);
      }

      return app;
    }
  };
  var custom = {
    install: function install(app) {
      app.config.compilerOptions.isCustomElement = function (tag) {
        return tag.toUpperCase() == tag;
      };

      return app;
    }
  };

  var VueWithProps = function VueWithProps(propDefinitionObject) {
    return vueClassComponent.Vue["with"](makePropClass(propDefinitionObject));
  };
  var createApp = function createApp() {
    return vue.createApp.apply(void 0, arguments).use(known).use(custom);
  };

  exports.Component = GlobalComponent;
  exports.Template = Template;
  exports.VueWithProps = VueWithProps;
  exports.createApp = createApp;
  exports.custom = custom;
  exports.globalComponents = globalComponents;
  exports.known = known;
  exports.makeClass = makePropClass;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, Vue, VueClassComponent);
