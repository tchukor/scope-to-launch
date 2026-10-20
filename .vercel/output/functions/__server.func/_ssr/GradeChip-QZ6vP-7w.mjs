import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var GradeChip = ({ grade, className = "", size = "sm" }) => {
	const g = grade.trim().toUpperCase();
	const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[10px] min-w-[20px] leading-tight" : size === "lg" ? "px-3 py-1 text-sm font-bold min-w-[34px]" : "px-2 py-0.5 text-xs min-w-[26px]";
	if (g === "A" || g === "A-" || g === "B+") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center justify-center font-tabular-sm font-semibold rounded-[2px] bg-[#111111] text-[#FBF8F1] select-none ${sizeClasses} ${className}`,
		children: grade
	});
	if (g === "B" || g === "B-" || g === "C+") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center justify-center font-tabular-sm font-semibold rounded-[2px] border border-[#111111] text-[#111111] bg-transparent select-none ${sizeClasses} ${className}`,
		children: grade
	});
	if (g === "C" || g === "C-" || g === "D+") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center justify-center font-tabular-sm font-medium rounded-[2px] border border-[#5C5850] text-[#5C5850] bg-transparent select-none ${sizeClasses} ${className}`,
		children: grade
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center justify-center font-tabular-sm font-medium rounded-[2px] border border-dashed border-[#9A958A] text-[#9A958A] bg-transparent select-none ${sizeClasses} ${className}`,
		children: grade
	});
};
//#endregion
export { GradeChip as t };
