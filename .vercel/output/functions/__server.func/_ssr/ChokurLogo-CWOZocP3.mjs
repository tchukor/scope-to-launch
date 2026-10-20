import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var ChokurLogo = ({ variant = "horizontal", size, className = "", showSubtitle = true, accentColor = "#C2410C", onClick }) => {
	const isClickable = Boolean(onClick);
	if (variant === "symbol") {
		const defaultSize = size || 28;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			width: defaultSize,
			height: defaultSize,
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: `inline-block shrink-0 ${isClickable ? "cursor-pointer" : ""} ${className}`,
			onClick,
			"aria-label": "Chokur System Symbol",
			role: "img",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Chokur System Symbol" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "4",
					y: "4",
					width: "4",
					height: "24",
					fill: "#111111"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "4",
					width: "20",
					height: "4",
					fill: "#111111"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "14",
					width: "13",
					height: "4",
					fill: "#111111"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "24",
					width: "8",
					height: "4",
					fill: accentColor
				})
			]
		});
	}
	if (variant === "stacked") {
		const defaultWidth = size || 80;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `inline-flex flex-col items-center justify-center text-center select-none ${isClickable ? "cursor-pointer" : ""} ${className}`,
			onClick,
			role: isClickable ? "button" : "img",
			"aria-label": "Chokur System",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 32 32",
					width: Number(defaultWidth) * .45 || 36,
					height: Number(defaultWidth) * .45 || 36,
					fill: "none",
					xmlns: "http://www.w3.org/2000/svg",
					className: "mb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "4",
							y: "4",
							width: "4",
							height: "24",
							fill: "#111111"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "8",
							y: "4",
							width: "20",
							height: "4",
							fill: "#111111"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "8",
							y: "14",
							width: "13",
							height: "4",
							fill: "#111111"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "8",
							y: "24",
							width: "8",
							height: "4",
							fill: accentColor
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans font-black tracking-widest text-xs text-[#111111] leading-none uppercase",
					children: "CHOKUR"
				}),
				showSubtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[9px] tracking-wider text-[#5C5850] uppercase mt-0.5",
					children: "SYSTEM"
				})
			]
		});
	}
	if (variant === "monochrome-dark") {
		const defaultHeight = size || 28;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `inline-flex items-center gap-2.5 select-none ${isClickable ? "cursor-pointer" : ""} ${className}`,
			onClick,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 32 32",
				height: defaultHeight,
				width: defaultHeight,
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: "shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "4",
						y: "4",
						width: "4",
						height: "24",
						fill: "#111111"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "4",
						width: "20",
						height: "4",
						fill: "#111111"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "14",
						width: "13",
						height: "4",
						fill: "#111111"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "24",
						width: "8",
						height: "4",
						fill: "#111111"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-1.5 leading-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans font-black text-sm tracking-wider text-[#111111]",
						children: "CHOKUR"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[9px] font-bold tracking-widest text-[#111111]",
						children: "SYSTEM"
					})]
				}), showSubtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans text-[8px] font-medium tracking-tight text-[#5C5850] uppercase mt-0.5",
					children: "Academic Ledger"
				})]
			})]
		});
	}
	if (variant === "monochrome-light") {
		const defaultHeight = size || 28;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `inline-flex items-center gap-2.5 select-none ${isClickable ? "cursor-pointer" : ""} ${className}`,
			onClick,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 32 32",
				height: defaultHeight,
				width: defaultHeight,
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: "shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "4",
						y: "4",
						width: "4",
						height: "24",
						fill: "#F6F1E7"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "4",
						width: "20",
						height: "4",
						fill: "#F6F1E7"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "14",
						width: "13",
						height: "4",
						fill: "#F6F1E7"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "24",
						width: "8",
						height: "4",
						fill: "#F6F1E7"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-1.5 leading-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans font-black text-sm tracking-wider text-[#F6F1E7]",
						children: "CHOKUR"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[9px] font-bold tracking-widest text-[#DDD6C7]",
						children: "SYSTEM"
					})]
				}), showSubtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans text-[8px] font-medium tracking-tight text-[#9A958A] uppercase mt-0.5",
					children: "Academic Ledger"
				})]
			})]
		});
	}
	const defaultHeight = size || 30;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `inline-flex items-center gap-2.5 select-none ${isClickable ? "cursor-pointer group" : ""} ${className}`,
		onClick,
		role: isClickable ? "button" : "img",
		"aria-label": "Chokur System - Marks to Insight",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			height: defaultHeight,
			width: defaultHeight,
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "shrink-0 transition-transform duration-150 group-hover:scale-105",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "4",
					y: "4",
					width: "4",
					height: "24",
					fill: "#111111"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "4",
					width: "20",
					height: "4",
					fill: "#111111"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "14",
					width: "13",
					height: "4",
					fill: "#111111"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "24",
					width: "8",
					height: "4",
					fill: accentColor
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-1.5 leading-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans font-black text-sm tracking-widest text-[#111111]",
					children: "CHOKUR"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[9px] font-bold tracking-widest text-[#5C5850]",
					children: "SYSTEM"
				})]
			}), showSubtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-sans text-[8.5px] font-semibold tracking-wider text-[#9A958A] uppercase mt-0.5",
				children: "Marks to Insight"
			})]
		})]
	});
};
//#endregion
export { ChokurLogo as t };
