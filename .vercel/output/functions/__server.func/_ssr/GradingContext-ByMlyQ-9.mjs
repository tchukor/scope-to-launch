import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GradingContext-ByMlyQ-9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
require_jsx_runtime();
var ctxStore = globalThis;
var GradingContext = ctxStore.__chokurGradingContext ?? (ctxStore.__chokurGradingContext = (0, import_react.createContext)(void 0));
var useGrading = () => {
	const context = (0, import_react.useContext)(GradingContext);
	if (!context) throw new Error("useGrading must be used within a GradingProvider");
	return context;
};
//#endregion
export { useGrading as t };
