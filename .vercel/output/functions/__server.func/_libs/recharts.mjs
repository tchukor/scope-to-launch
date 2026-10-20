import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { n as clsx } from "./class-variance-authority+clsx.mjs";
import { a as require_isNil, c as require_isObject, i as require_isString, n as require_isNaN, o as require_get, r as require_isNumber, s as require_isFunction, t as require_throttle } from "./lodash.mjs";
import { t as require_react_is } from "./react-is.mjs";
//#region node_modules/recharts/es6/util/DataUtils.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_isString = /* @__PURE__ */ __toESM(require_isString());
require_isNaN();
require_get();
require_isNumber();
require_isNil();
var isPercent = function isPercent(value) {
	return (0, import_isString.default)(value) && value.indexOf("%") === value.length - 1;
};
require_isFunction();
require_isObject();
require_react_is();
/**
* Get the display name of a component
* @param  {Object} Comp Specified Component
* @return {String}      Display name of Component
*/
var getDisplayName = function getDisplayName(Comp) {
	if (typeof Comp === "string") return Comp;
	if (!Comp) return "";
	return Comp.displayName || Comp.name || "Component";
};
//#endregion
//#region node_modules/recharts/es6/util/LogUtils.js
var warn = function warn(condition, format) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
};
//#endregion
//#region node_modules/recharts/es6/component/ResponsiveContainer.js
/**
* @fileOverview Wrapper component to make charts adapt to the size of parent * DOM
*/
var import_throttle = /* @__PURE__ */ __toESM(require_throttle());
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
var ResponsiveContainer = /*#__PURE__*/ (0, import_react.forwardRef)(function(_ref, ref) {
	var aspect = _ref.aspect, _ref$initialDimension = _ref.initialDimension, initialDimension = _ref$initialDimension === void 0 ? {
		width: -1,
		height: -1
	} : _ref$initialDimension, _ref$width = _ref.width, width = _ref$width === void 0 ? "100%" : _ref$width, _ref$height = _ref.height, height = _ref$height === void 0 ? "100%" : _ref$height, _ref$minWidth = _ref.minWidth, minWidth = _ref$minWidth === void 0 ? 0 : _ref$minWidth, minHeight = _ref.minHeight, maxHeight = _ref.maxHeight, children = _ref.children, _ref$debounce = _ref.debounce, debounce = _ref$debounce === void 0 ? 0 : _ref$debounce, id = _ref.id, className = _ref.className, onResize = _ref.onResize, _ref$style = _ref.style, style = _ref$style === void 0 ? {} : _ref$style;
	var containerRef = (0, import_react.useRef)(null);
	var onResizeRef = (0, import_react.useRef)();
	onResizeRef.current = onResize;
	(0, import_react.useImperativeHandle)(ref, function() {
		return Object.defineProperty(containerRef.current, "current", {
			get: function get() {
				console.warn("The usage of ref.current.current is deprecated and will no longer be supported.");
				return containerRef.current;
			},
			configurable: true
		});
	});
	var _useState2 = _slicedToArray((0, import_react.useState)({
		containerWidth: initialDimension.width,
		containerHeight: initialDimension.height
	}), 2), sizes = _useState2[0], setSizes = _useState2[1];
	var setContainerSize = (0, import_react.useCallback)(function(newWidth, newHeight) {
		setSizes(function(prevState) {
			var roundedWidth = Math.round(newWidth);
			var roundedHeight = Math.round(newHeight);
			if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) return prevState;
			return {
				containerWidth: roundedWidth,
				containerHeight: roundedHeight
			};
		});
	}, []);
	(0, import_react.useEffect)(function() {
		var callback = function callback(entries) {
			var _onResizeRef$current;
			var _entries$0$contentRec = entries[0].contentRect, containerWidth = _entries$0$contentRec.width, containerHeight = _entries$0$contentRec.height;
			setContainerSize(containerWidth, containerHeight);
			(_onResizeRef$current = onResizeRef.current) === null || _onResizeRef$current === void 0 || _onResizeRef$current.call(onResizeRef, containerWidth, containerHeight);
		};
		if (debounce > 0) callback = (0, import_throttle.default)(callback, debounce, {
			trailing: true,
			leading: false
		});
		var observer = new ResizeObserver(callback);
		var _containerRef$current = containerRef.current.getBoundingClientRect(), containerWidth = _containerRef$current.width, containerHeight = _containerRef$current.height;
		setContainerSize(containerWidth, containerHeight);
		observer.observe(containerRef.current);
		return function() {
			observer.disconnect();
		};
	}, [setContainerSize, debounce]);
	var chartContent = (0, import_react.useMemo)(function() {
		var containerWidth = sizes.containerWidth, containerHeight = sizes.containerHeight;
		if (containerWidth < 0 || containerHeight < 0) return null;
		warn(isPercent(width) || isPercent(height), "The width(%s) and height(%s) are both fixed numbers,\n       maybe you don't need to use a ResponsiveContainer.", width, height);
		warn(!aspect || aspect > 0, "The aspect(%s) must be greater than zero.", aspect);
		var calculatedWidth = isPercent(width) ? containerWidth : width;
		var calculatedHeight = isPercent(height) ? containerHeight : height;
		if (aspect && aspect > 0) {
			if (calculatedWidth) calculatedHeight = calculatedWidth / aspect;
			else if (calculatedHeight) calculatedWidth = calculatedHeight * aspect;
			if (maxHeight && calculatedHeight > maxHeight) calculatedHeight = maxHeight;
		}
		warn(calculatedWidth > 0 || calculatedHeight > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
		var isCharts = !Array.isArray(children) && getDisplayName(children.type).endsWith("Chart");
		return import_react.Children.map(children, function(child) {
			if (/*#__PURE__*/ import_react.isValidElement(child)) return /*#__PURE__*/ (0, import_react.cloneElement)(child, _objectSpread({
				width: calculatedWidth,
				height: calculatedHeight
			}, isCharts ? { style: _objectSpread({
				height: "100%",
				width: "100%",
				maxHeight: calculatedHeight,
				maxWidth: calculatedWidth
			}, child.props.style) } : {}));
			return child;
		});
	}, [
		aspect,
		children,
		height,
		maxHeight,
		minHeight,
		minWidth,
		sizes,
		width
	]);
	return /*#__PURE__*/ import_react.createElement("div", {
		id: id ? "".concat(id) : void 0,
		className: clsx("recharts-responsive-container", className),
		style: _objectSpread(_objectSpread({}, style), {}, {
			width,
			height,
			minWidth,
			minHeight,
			maxHeight
		}),
		ref: containerRef
	}, chartContent);
});
//#endregion
export { ResponsiveContainer as t };
