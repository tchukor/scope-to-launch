import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as ChokurLogo } from "./ChokurLogo-CWOZocP3.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-showcase-BgmgHOnG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OverviewDemo = (0, import_react.lazy)(() => import("./OverviewView-DCNWwoB3.mjs").then((m) => ({ default: m.OverviewView })));
var MarksEntryDemo = (0, import_react.lazy)(() => import("./MarksEntryView-vPOr3U8Z.mjs").then((m) => ({ default: m.MarksEntryView })));
var RankingsDemo = (0, import_react.lazy)(() => import("./RankingsView-CLzvr7Jd.mjs").then((m) => ({ default: m.RankingsView })));
var ReportCardsDemo = (0, import_react.lazy)(() => import("./ReportCardsView-C7ld80B0.mjs").then((m) => ({ default: m.ReportCardsView })));
var GradeDistributionDemo = (0, import_react.lazy)(() => import("./GradeDistributionView-Bhctqp8N.mjs").then((m) => ({ default: m.GradeDistributionView })));
var StudentsClassesDemo = (0, import_react.lazy)(() => import("./StudentsClassesView-D0x92aOW.mjs").then((m) => ({ default: m.StudentsClassesView })));
var SubjectAnalysisDemo = (0, import_react.lazy)(() => import("./SubjectAnalysisView-DReBtbCy.mjs").then((m) => ({ default: m.SubjectAnalysisView })));
var SettingsDemo = (0, import_react.lazy)(() => import("./SettingsView-cpbnj2iD.mjs").then((m) => ({ default: m.SettingsView })));
function UIShowcaseRoot() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background text-foreground font-body-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShowcaseShell, {})
	});
}
function ShowcaseShell() {
	const [activeDemo, setActiveDemo] = import_react.useState("overview");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto max-w-[1400px] flex h-14 items-center justify-between px-4",
				"aria-label": "Showcase navigation",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 shrink-0",
						title: "Back to Chokur App",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChokurLogo, {
							variant: "symbol",
							size: 28,
							className: "text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline font-headline-sm text-foreground",
							children: "Chokur"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-1 items-center justify-center gap-1 overflow-x-auto px-4 pb-1 scrollbar-hide",
						role: "tablist",
						"aria-label": "Demo views",
						children: DEMOS.map((demo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							role: "tab",
							"aria-selected": activeDemo === demo.key,
							onClick: () => setActiveDemo(demo.key),
							className: `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${activeDemo === demo.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[18px]",
								children: demo.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden xs:inline",
								children: demo.label
							})]
						}, demo.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/ui-components",
						className: "shrink-0 flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[18px]",
							children: "widgets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Components"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-[1400px] flex-1 p-4 md:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoSkeleton, {}),
				children: DEMOS.find((d) => d.key === activeDemo)?.component
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "border-t border-border bg-background/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chokur Design System v1.0 — Built with shadcn/ui + TanStack Start" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ui-components",
						className: "hover:text-foreground transition-colors",
						children: "Component Library"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "https://github.com/tchukor/scope-to-launch",
						target: "_blank",
						rel: "noopener",
						className: "hover:text-foreground transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[18px] align-middle",
							children: "code"
						}), "GitHub"]
					})]
				})]
			})
		})
	] });
}
function DemoSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-pulse space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-1/4 bg-muted rounded" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [...Array(4)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 bg-muted rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 bg-muted rounded-xl" })
		]
	});
}
var DEMOS = [
	{
		key: "overview",
		label: "Overview",
		icon: "dashboard",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Overview Dashboard",
			description: "System-wide stats, recent activity, and quick actions",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewDemo, {}),
				" "
			]
		})
	},
	{
		key: "marks-entry",
		label: "Marks Entry",
		icon: "edit_note",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Marks Entry",
			description: "Spreadsheet-style marks entry with inline validation",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarksEntryDemo, {}),
				" "
			]
		})
	},
	{
		key: "rankings",
		label: "Rankings",
		icon: "format_list_numbered",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Class Rankings",
			description: "Student rankings with percentile, stream filters, and export",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankingsDemo, {}),
				" "
			]
		})
	},
	{
		key: "report-cards",
		label: "Report Cards",
		icon: "badge",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Report Cards",
			description: "Official KCSE-format printable report cards",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCardsDemo, {}),
				" "
			]
		})
	},
	{
		key: "grade-distribution",
		label: "Grade Distribution",
		icon: "bar_chart",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Grade Distribution",
			description: "Subject and class grade analytics with charts",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeDistributionDemo, {}),
				" "
			]
		})
	},
	{
		key: "students",
		label: "Students & Classes",
		icon: "group",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Students & Classes",
			description: "Student roster, class management, and enrollment",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentsClassesDemo, {}),
				" "
			]
		})
	},
	{
		key: "subject-analysis",
		label: "Subject Analysis",
		icon: "analytics",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Subject Analysis",
			description: "Deep-dive subject performance analytics",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectAnalysisDemo, {}),
				" "
			]
		})
	},
	{
		key: "settings",
		label: "Settings",
		icon: "settings",
		component: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DemoWrapper, {
			title: "Settings & Backups",
			description: "App configuration, data management, and offline sync",
			children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDemo, {}),
				" "
			]
		})
	}
];
function DemoWrapper({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-headline-lg text-foreground tracking-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground text-body-md",
				children: description
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[12px]",
						children: "verified"
					}), "Live Component"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-card border border-border rounded-xl overflow-hidden",
			children
		})]
	});
}
//#endregion
export { UIShowcaseRoot as component };
