import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { n as exportTableToCSV, r as getGradeFromScore } from "./grading-BEvvYsTK.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SubjectAnalysisView-DReBtbCy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SubjectAnalysisView = () => {
	const { subjectDepartmentalStats, classAverage, activeStream, activeExam, setActiveView } = useGrading();
	const [selectedDepartment, setSelectedDepartment] = (0, import_react.useState)("ALL");
	const [comparePrevious, setComparePrevious] = (0, import_react.useState)(true);
	const departments = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		subjectDepartmentalStats.forEach((s) => {
			if (s.subject.department) set.add(s.subject.department);
		});
		return Array.from(set);
	}, [subjectDepartmentalStats]);
	const filteredStats = (0, import_react.useMemo)(() => {
		if (selectedDepartment === "ALL") return subjectDepartmentalStats;
		return subjectDepartmentalStats.filter((s) => s.subject.department === selectedDepartment);
	}, [subjectDepartmentalStats, selectedDepartment]);
	const dragSubjects = (0, import_react.useMemo)(() => {
		return subjectDepartmentalStats.filter((s) => s.average < classAverage - 4);
	}, [subjectDepartmentalStats, classAverage]);
	const handleExportCSV = () => {
		const headers = [
			"Subject Code",
			"Subject Name",
			"Department",
			"Subject Teacher",
			"Entries",
			"Average Score (%)",
			"Mean Grade",
			"Highest Mark",
			"Lowest Mark",
			"Pass Rate (%)",
			"Vs Previous Exam"
		];
		const rows = filteredStats.map((s) => {
			const grade = getGradeFromScore(s.average);
			return [
				s.subject.code,
				s.subject.name,
				s.subject.department,
				s.subject.teacher || "—",
				s.entered,
				s.average.toFixed(1),
				grade.grade,
				s.highest,
				s.lowest,
				`${s.passRate}%`,
				`${s.diffFromLastExam >= 0 ? "+" : ""}${s.diffFromLastExam.toFixed(1)}`
			];
		});
		exportTableToCSV(`Subject_Analysis_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`, headers, rows);
	};
	const handlePrint = () => {
		window.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-[#DDD6C7]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-lg text-headline-lg text-[#111111] tracking-tight",
					children: "Subject Analysis"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E] mt-1",
					children: [
						activeStream,
						" · ",
						activeExam,
						" · performance diagnostics & curriculum benchmark"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 sm:gap-3 flex-wrap no-print",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center border border-[#DDD6C7] rounded bg-[#FBF8F1] text-xs font-medium overflow-hidden max-w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedDepartment("ALL"),
								className: `px-3 py-2 min-h-[40px] cursor-pointer ${selectedDepartment === "ALL" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
								children: "All Depts"
							}), departments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedDepartment(dept),
								className: `px-2.5 sm:px-3 py-2 min-h-[40px] cursor-pointer truncate max-w-[90px] sm:max-w-none ${selectedDepartment === dept ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
								children: dept
							}, dept))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleExportCSV,
							type: "button",
							className: "px-3.5 py-2 bg-transparent border border-[#111111] rounded text-[#111111] font-body-sm text-xs sm:text-[13px] hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "download"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export CSV" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handlePrint,
							type: "button",
							className: "px-3.5 py-2 bg-[#C2410C] text-[#FEF9EF] rounded font-body-sm text-xs sm:text-[13px] font-medium hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer min-h-[40px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "print"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print" })]
						})
					]
				})]
			}),
			dragSubjects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-4 sm:my-6 p-4 bg-[#FBF8F1] border-l-4 border-[#C2410C] border-y border-r border-[#DDD6C7]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[#C2410C] text-[20px] mt-0.5",
						children: "priority_high"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-[#111111]",
							children: "Curriculum Drag Diagnostic"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-xs sm:text-body-sm text-[#5F5E5E] mt-0.5",
							children: [
								"The following subject",
								dragSubjects.length > 1 ? "s are" : " is",
								" performing significantly below the class average of ",
								classAverage.toFixed(1),
								"%:"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2 mt-2",
							children: dragSubjects.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#DDD6C7] text-xs font-medium text-[#111111]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										d.subject.code,
										" (",
										d.subject.name,
										"):"
									] }),
									" ",
									d.average.toFixed(1),
									"% mean",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[#C2410C] font-semibold",
										children: [
											"(",
											(d.average - classAverage).toFixed(1),
											"% vs class avg)"
										]
									})
								]
							}, d.subject.code))
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "my-4 sm:my-6 p-3 sm:p-6 border border-[#DDD6C7] bg-[#FBF8F1] rounded shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider text-[11px]",
						children: "SUBJECT MEAN SCORE BENCHMARK CHART"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-xs font-caption text-[#5F5E5E]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 bg-[#111111] inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Above C+ (55%)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 bg-[#C2410C] inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Below C+ (55%)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-0.5 border-t-2 border-dashed border-[#111111] inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "55% Cutoff line" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative pt-2 pb-6 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-0 bottom-6 border-r-2 border-dashed border-[#111111] z-10 pointer-events-none",
						style: { left: "55%" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-3 -translate-x-1/2 bg-[#111111] text-[#FEF9EF] text-[10px] font-bold px-1.5 py-0.2 rounded-[2px]",
							children: "55% C+"
						})
					}), filteredStats.map((stat) => {
						const grade = getGradeFromScore(stat.average);
						const isPassing = stat.average >= 55;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 sm:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-14 sm:w-24 text-right shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-xs text-[#111111] block",
										children: stat.subject.code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] truncate hidden sm:block",
										children: stat.subject.department
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 bg-[#F2EDE3] h-6 rounded-none relative overflow-hidden flex items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full transition-all duration-300 flex items-center justify-end pr-2 text-xs font-bold text-[#FEF9EF] ${isPassing ? "bg-[#111111]" : "bg-[#C2410C]"}`,
										style: { width: `${Math.min(100, Math.max(10, stat.average))}%` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-tabular-sm text-[11px]",
											children: [stat.average.toFixed(1), "%"]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-16 sm:w-20 shrink-0 flex items-center justify-end gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
										grade: grade.grade,
										size: "sm"
									}), comparePrevious && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] sm:text-[11px] font-tabular-sm font-semibold hidden sm:inline ${stat.diffFromLastExam >= 0 ? "text-emerald-800" : "text-red-700"}`,
										children: stat.diffFromLastExam >= 0 ? `+${stat.diffFromLastExam.toFixed(1)}` : stat.diffFromLastExam.toFixed(1)
									})]
								})
							]
						}, stat.subject.code);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3 mb-6 no-print",
				children: filteredStats.map((stat) => {
					const grade = getGradeFromScore(stat.average);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#FBF8F1] border border-[#DDD6C7] rounded p-3.5 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs text-[#111111]",
										children: stat.subject.code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#5F5E5E] font-medium",
										children: stat.subject.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-[#9A958A] mt-0.5",
									children: [
										stat.subject.department,
										" · Teacher: ",
										stat.subject.teacher || "Unassigned"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
									grade: grade.grade,
									size: "md"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-[#DDD6C7]/60 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] uppercase block font-label-caps",
										children: "Average"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md font-bold text-[#111111]",
										children: [stat.average.toFixed(1), "%"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] uppercase block font-label-caps",
										children: "Pass Rate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-tabular-md font-bold ${stat.passRate >= 70 ? "text-emerald-800" : stat.passRate < 50 ? "text-red-700" : "text-[#111111]"}`,
										children: [stat.passRate, "%"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] uppercase block font-label-caps",
										children: "High / Low"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md font-medium text-[#111111]",
										children: [
											stat.highest,
											" / ",
											stat.lowest
										]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs pt-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#5F5E5E] text-[11px] font-tabular-sm",
									children: [stat.entered, " Candidates Entered"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `font-tabular-sm text-xs font-semibold ${stat.diffFromLastExam >= 0 ? "text-emerald-800" : "text-red-700"}`,
									children: [
										"Trend:",
										" ",
										stat.diffFromLastExam >= 0 ? `+${stat.diffFromLastExam.toFixed(1)}` : stat.diffFromLastExam.toFixed(1),
										"%"
									]
								})]
							})
						]
					}, stat.subject.code);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "hidden md:block border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "h-10 border-b border-[#DDD6C7] bg-[#F8F3E9] text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-20 px-4",
									children: "CODE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4",
									children: "SUBJECT NAME"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4",
									children: "DEPARTMENT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4",
									children: "TEACHER"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-24 px-3 text-right",
									children: "ENTRIES"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-28 px-3 text-right",
									children: "AVERAGE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-20 px-2 text-center",
									children: "GRADE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-24 px-3 text-right",
									children: "HIGH / LOW"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-28 px-3 text-right",
									children: "PASS RATE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-28 px-4 text-right",
									children: "DEVIATION"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm text-[#111111]",
							children: filteredStats.map((stat) => {
								const grade = getGradeFromScore(stat.average);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "h-11 hover:bg-[#F2EDE3] transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 font-tabular-sm font-bold text-[#111111]",
											children: stat.subject.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 font-medium text-[#111111]",
											children: stat.subject.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 text-[#5F5E5E]",
											children: stat.subject.department
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 text-[#111111]",
											children: stat.subject.teacher || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 text-right font-tabular-sm text-[#5F5E5E]",
											children: stat.entered
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 text-right font-tabular-md font-semibold text-[#111111]",
											children: [stat.average.toFixed(1), "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
												grade: grade.grade,
												size: "sm"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 text-right font-tabular-sm text-[#5F5E5E]",
											children: [
												stat.highest,
												" / ",
												stat.lowest
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 text-right font-tabular-sm font-medium",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: stat.passRate >= 70 ? "text-emerald-800" : stat.passRate < 50 ? "text-red-700" : "text-[#111111]",
												children: [stat.passRate, "%"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 text-right font-tabular-sm font-semibold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: stat.diffFromLastExam >= 0 ? "text-emerald-800" : "text-red-700",
												children: stat.diffFromLastExam >= 0 ? `↑ +${stat.diffFromLastExam.toFixed(1)}` : `↓ ${stat.diffFromLastExam.toFixed(1)}`
											})
										})
									]
								}, stat.subject.code);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 p-4 sm:p-5 bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "font-semibold text-sm text-[#111111] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[18px] text-[#C2410C]",
						children: "route"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subject Analysis: Next Steps" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#5F5E5E] mt-0.5",
					children: "Compare distributions across grades, view overall student rankings, or adjust marks."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveView("overview"),
							className: "px-3 py-2 text-xs font-medium border border-[#DDD6C7] rounded bg-white hover:bg-[#F2EDE3] text-[#111111] cursor-pointer",
							children: "← Overview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("grade-distribution"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#111111] text-white hover:bg-neutral-800 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "bar_chart"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grade Distribution →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("rankings"),
							className: "px-3.5 py-2 text-xs font-semibold border border-[#111111] hover:bg-[#F2EDE3] text-[#111111] rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "format_list_numbered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Class Rankings →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("marks-entry"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#C2410C] text-white hover:opacity-90 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "edit_note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit Marks →" })]
						})
					]
				})]
			})
		]
	});
};
//#endregion
export { SubjectAnalysisView };
