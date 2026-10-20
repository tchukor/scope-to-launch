import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { x as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ci4KC7SX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Fallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-[#FEF9EF]" });
}
function Index() {
	(0, import_react.useEffect)(() => {
		if ("serviceWorker" in navigator && true) navigator.serviceWorker.register("/sw.js").catch((err) => {
			console.warn("[SW] Registration failed:", err);
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fallback, {}) });
}
//#endregion
export { Index as component };
