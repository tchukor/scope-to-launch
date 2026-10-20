import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime, g as Primitive } from "./@radix-ui/react-accordion+[...].mjs";
//#region node_modules/@radix-ui/react-aspect-ratio/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var AspectRatio = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AspectRatio2(props, forwardedRef) {
	const { ratio = 1 / 1, style, ...aspectRatioProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "relative",
			width: "100%",
			paddingBottom: `${100 / ratio}%`
		},
		"data-radix-aspect-ratio-wrapper": "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			...aspectRatioProps,
			ref: forwardedRef,
			style: {
				...style,
				position: "absolute",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		})
	});
}, "AspectRatio"));
//#endregion
export { AspectRatio as t };
