import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { n as exportTableToCSV, r as getGradeFromScore, t as KCSE_GRADING_TABLE } from "./grading-BEvvYsTK.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GradeDistributionView-Bhctqp8N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GradeDistributionView = () => {
	const { rankings, subjects, marks, filteredStudents: students, classAverage, meanGrade, passRate, activeStream, activeExam, setActiveView } = useGrading();
	const [selectedSubjectFilter, setSelectedSubjectFilter] = (0, import_react.useState)("ALL");
	const [showSubjectDropdown, setShowSubjectDropdown] = (0, import_react.useState)(false);
	const activeDistributionTiers = (0, import_react.useMemo)(() => {
		let gradeList = [];
		if (selectedSubjectFilter === "ALL") gradeList = rankings.map((r) => r.meanGrade);
		else students.forEach((s) => {
			const val = marks[s.id]?.[selectedSubjectFilter];
			if (typeof val === "number") gradeList.push(getGradeFromScore(val).grade);
		});
		const totalCount = gradeList.length || 1;
		let cumulative = 0;
		return KCSE_GRADING_TABLE.map((row) => {
			const count = gradeList.filter((g) => g === row.grade).length;
			const share = Math.round(count / totalCount * 1e3) / 10;
			cumulative += share;
			return {
				grade: row.grade,
				pointsEquivalent: row.points,
				studentCount: count,
				cohortShare: share,
				cumulativePercentage: Math.min(100, Math.round(cumulative * 10) / 10)
			};
		});
	}, [
		rankings,
		selectedSubjectFilter,
		students,
		marks
	]);
	const letterCategoryStats = (0, import_react.useMemo)(() => {
		let gradesList = [];
		if (selectedSubjectFilter === "ALL") gradesList = rankings.map((r) => r.meanGrade);
		else students.forEach((s) => {
			const val = marks[s.id]?.[selectedSubjectFilter];
			if (typeof val === "number") gradesList.push(getGradeFromScore(val).grade);
		});
		const total = gradesList.length || 1;
		const countA = gradesList.filter((g) => g.startsWith("A")).length;
		const countB = gradesList.filter((g) => g.startsWith("B")).length;
		const countC = gradesList.filter((g) => g.startsWith("C")).length;
		const countD = gradesList.filter((g) => g.startsWith("D")).length;
		const countE = gradesList.filter((g) => g.startsWith("E")).length;
		const pctA = Math.round(countA / total * 100);
		const pctB = Math.round(countB / total * 100);
		const pctC = Math.round(countC / total * 100);
		const pctD = Math.round(countD / total * 100);
		const pctE = Math.round(countE / total * 100);
		return [
			{
				letter: "A",
				count: countA,
				pct: pctA
			},
			{
				letter: "B",
				count: countB,
				pct: pctB
			},
			{
				letter: "C",
				count: countC,
				pct: pctC
			},
			{
				letter: "D",
				count: countD,
				pct: pctD
			},
			{
				letter: "E",
				count: countE,
				pct: pctE
			}
		];
	}, [
		rankings,
		selectedSubjectFilter,
		students,
		marks
	]);
	const maxBarCount = Math.max(...letterCategoryStats.map((c) => c.count), 1);
	const evaluatedCount = selectedSubjectFilter === "ALL" ? rankings.length : students.filter((s) => typeof marks[s.id]?.[selectedSubjectFilter] === "number").length;
	const selectedSubjectName = selectedSubjectFilter === "ALL" ? "Class Aggregate Standing" : subjects.find((s) => s.code === selectedSubjectFilter)?.name || selectedSubjectFilter;
	const qualifiedCount = (0, import_react.useMemo)(() => {
		return activeDistributionTiers.filter((t) => t.pointsEquivalent >= 7).reduce((sum, curr) => sum + curr.studentCount, 0);
	}, [activeDistributionTiers]);
	const belowCutoffCount = evaluatedCount - qualifiedCount;
	const handleExportDistribution = () => {
		const headers = [
			"KCSE Grade",
			"Points Equivalent",
			"Candidate Count",
			"Cohort Share (%)",
			"Cumulative (%)",
			"University Eligible"
		];
		const rows = activeDistributionTiers.map((t) => [
			t.grade,
			String(t.pointsEquivalent),
			String(t.studentCount),
			`${t.cohortShare.toFixed(1)}%`,
			`${t.cumulativePercentage.toFixed(1)}%`,
			t.pointsEquivalent >= 7 ? "YES" : "NO"
		]);
		exportTableToCSV(`KCSE_Grade_Distribution_${selectedSubjectFilter}_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`, headers, rows);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col xl:flex-row xl:items-end justify-between pb-4 sm:pb-6 border-b border-[#DDD6C7] gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-lg text-headline-lg text-[#111111] tracking-tight",
					children: "Grade Distribution"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E] mt-1",
					children: [
						activeStream,
						" · ",
						activeExam,
						" · 12-tier KNEC cohort frequency distribution"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 sm:gap-3 no-print",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowSubjectDropdown(!showSubjectDropdown),
							type: "button",
							className: "bg-[#FBF8F1] border border-[#DDD6C7] hover:border-[#111111] rounded px-3 py-2 text-xs sm:text-[13px] font-medium flex items-center gap-2 cursor-pointer min-h-[40px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[16px] text-[#C2410C]",
									children: "filter_list"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Filter: ", selectedSubjectFilter === "ALL" ? "Cohort Mean" : selectedSubjectFilter] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[16px] text-[#5F5E5E]",
									children: "expand_more"
								})
							]
						}), showSubjectDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 top-full mt-1 w-56 bg-[#FBF8F1] border border-[#DDD6C7] shadow-lg py-1 z-50 rounded",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setSelectedSubjectFilter("ALL");
										setShowSubjectDropdown(false);
									},
									className: `w-full text-left px-3 py-2 text-xs hover:bg-[#F2EDE3] flex items-center justify-between cursor-pointer ${selectedSubjectFilter === "ALL" ? "font-medium text-[#C2410C] bg-[#F8F3E9]" : "text-[#111111]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cohort KCSE Mean Grade" }), selectedSubjectFilter === "ALL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-[#DDD6C7]/50 my-1" }),
								subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setSelectedSubjectFilter(s.code);
										setShowSubjectDropdown(false);
									},
									className: `w-full text-left px-3 py-2 text-xs hover:bg-[#F2EDE3] flex items-center justify-between cursor-pointer ${selectedSubjectFilter === s.code ? "font-medium text-[#C2410C] bg-[#F8F3E9]" : "text-[#111111]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										s.code,
										" — ",
										s.name
									] }), selectedSubjectFilter === s.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" })]
								}, s.code))
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleExportDistribution,
						type: "button",
						className: "inline-flex items-center gap-1.5 bg-transparent border border-[#111111] rounded px-3.5 py-2 text-[#111111] font-body-sm text-xs sm:text-[13px] hover:bg-[#F2EDE3] transition-colors cursor-pointer min-h-[40px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "file_download"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export CSV" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-[#FBF8F1] border border-[#DDD6C7] p-3 sm:p-6 my-4 sm:my-6 rounded shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] tracking-wider uppercase text-[11px]",
							children: selectedSubjectFilter === "ALL" ? "COHORT MEAN GRADE FREQUENCY" : `${selectedSubjectFilter} GRADE FREQUENCY`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-tabular-sm text-xs sm:text-tabular-sm text-[#5F5E5E]",
							children: [
								"Evaluated cohort: ",
								evaluatedCount,
								" candidates"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full h-[240px] sm:h-[280px] flex flex-col justify-end pt-6 pb-6 sm:pb-8 px-2 sm:px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-6 sm:bottom-8 border-b-2 border-[#111111]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 grid grid-cols-5 gap-2 sm:gap-8 lg:gap-12 h-full items-end pb-0.5",
							children: letterCategoryStats.map((cat) => {
								const isTallest = cat.count === maxBarCount && cat.count > 0;
								const barHeightPct = maxBarCount > 0 ? cat.count / maxBarCount * 85 : 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center h-full justify-end group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-tabular-sm text-xs sm:text-tabular-sm text-[#111111] mb-1.5 text-center whitespace-nowrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: isTallest ? "font-bold" : "font-medium",
													children: cat.count
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[#5F5E5E] hidden sm:inline",
													children: [
														"· ",
														cat.pct,
														"%"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `w-full max-w-[48px] sm:max-w-[68px] transition-all duration-300 ${isTallest ? "bg-[#111111]" : "bg-[#5F5E5E]"}`,
											style: { height: `${Math.max(4, barHeightPct)}%` }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `mt-2 sm:mt-3 font-tabular-md text-sm sm:text-tabular-md ${isTallest ? "font-bold text-[#111111]" : "font-semibold text-[#111111]"}`,
											children: cat.letter
										})
									]
								}, cat.letter);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 pt-2.5 border-t border-[#DDD6C7] flex flex-wrap items-center justify-between text-xs gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[#C2410C] font-body-sm font-medium flex items-center gap-1.5 text-[11px] sm:text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KNEC: A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-caption text-caption text-[#5F5E5E] text-[10px] sm:text-xs",
							children: "C+ Pass vs C Marginal"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-y border-[#DDD6C7] divide-y divide-[#DDD6C7] mb-6 bg-[#FBF8F1]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-3 px-3 sm:px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E]",
							children: "Class Mean Grade"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-tabular-lg text-lg sm:text-tabular-lg font-bold text-[#111111]",
								children: meanGrade
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-tabular-sm text-xs sm:text-tabular-sm text-[#5F5E5E]",
								children: [
									"(",
									classAverage.toFixed(1),
									"% mean score)"
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-3 px-3 sm:px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E]",
							children: "University Qualified (C+ & Above)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-tabular-lg text-lg sm:text-tabular-lg font-bold text-[#111111]",
								children: [evaluatedCount > 0 ? Math.round(qualifiedCount / evaluatedCount * 100) : 0, "%"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-tabular-sm text-xs sm:text-tabular-sm text-[#5F5E5E]",
								children: [
									"(",
									qualifiedCount,
									" of ",
									evaluatedCount,
									")"
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-3 px-3 sm:px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E]",
							children: "Candidates Below C+ Threshold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-tabular-lg text-lg sm:text-tabular-lg font-bold text-[#111111]",
							children: [
								belowCutoffCount,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-body-sm text-xs sm:text-body-sm font-normal text-[#5F5E5E]",
									children: "candidates"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden space-y-2 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-headline-sm text-sm text-[#111111] font-semibold mb-2",
					children: ["KCSE 12-Grade Breakdown — ", selectedSubjectName]
				}), activeDistributionTiers.map((tier) => {
					const isCPlus = tier.grade === "C+";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#FBF8F1] border border-[#DDD6C7] rounded p-2.5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
								grade: tier.grade,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-[#5F5E5E] font-tabular-sm",
								children: [tier.pointsEquivalent, " pts"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs font-tabular-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-[#111111]",
									children: [tier.studentCount, " students"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#5F5E5E]",
									children: [
										"(",
										tier.cohortShare.toFixed(1),
										"%)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-[#9A958A]",
									children: [
										"Cum: ",
										tier.cumulativePercentage.toFixed(1),
										"%"
									]
								})
							]
						})]
					}), isCPlus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2 my-1 border-y-2 border-[#111111] bg-[#F8F3E9] px-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-label-caps font-bold uppercase text-[#111111]",
							children: "C+ CUTOFF (DIRECT DEGREE ENTRY PASS LINE)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 bg-[#111111] rounded-full" })]
					})] }, tier.grade);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hidden md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-headline-sm text-headline-sm text-[#111111]",
						children: ["KCSE Full 12-Grade Ledger Breakdown — ", selectedSubjectName]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider",
						children: "Normative Distribution"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-[#DDD6C7] overflow-hidden bg-[#FBF8F1] rounded shadow-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left border-collapse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-[#DDD6C7] bg-[#FEF9EF] text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-4 font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider w-28",
										children: "KCSE Grade"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-4 font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider w-36",
										children: "Points Equivalent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-4 font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider text-right",
										children: "Candidate Count"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-4 font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider text-right",
										children: "Cohort Share"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-4 font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider text-right",
										children: "Cumulative %"
									})
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm",
								children: activeDistributionTiers.map((tier) => {
									const isCPlus = tier.grade === "C+";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "h-[44px] hover:bg-[#F2EDE3] transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, { grade: tier.grade })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 font-tabular-sm text-tabular-sm text-[#5F5E5E]",
												children: [tier.pointsEquivalent, " Points"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 text-right font-tabular-md text-tabular-md font-semibold text-[#111111]",
												children: tier.studentCount
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 text-right font-tabular-sm text-tabular-sm text-[#5F5E5E]",
												children: [tier.cohortShare.toFixed(1), "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 text-right font-tabular-sm text-tabular-sm text-[#111111]",
												children: [tier.cumulativePercentage.toFixed(1), "%"]
											})
										]
									}), isCPlus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
										className: "bg-[#FEF9EF]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 5,
											className: "py-1 px-4 border-y-2 border-[#111111]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-label-caps text-label-caps text-[#111111] uppercase tracking-widest font-bold flex items-center gap-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 bg-[#111111] inline-block" }), "C+ Cutoff Boundary — Minimum Direct University Entry Requirement"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-tabular-sm text-tabular-sm text-[#111111] font-semibold text-xs",
													children: "KUCCPS Pass Line"
												})]
											})
										})
									})] }, tier.grade);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t-2 border-[#111111] bg-[#FEF9EF] font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-body-sm text-body-sm text-[#111111]",
										children: "Total Cohort Evaluated"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-tabular-sm text-tabular-sm text-[#5F5E5E]",
										children: "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 text-right font-tabular-md text-tabular-md text-[#111111]",
										children: [evaluatedCount, " Candidates"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-tabular-sm text-tabular-sm text-[#111111]",
										children: "100.0%"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-tabular-sm text-tabular-sm text-[#111111]",
										children: "100.0%"
									})
								]
							}) })
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 p-4 sm:p-5 bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "font-semibold text-sm text-[#111111] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[18px] text-[#C2410C]",
						children: "route"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grade Distribution: Next Steps" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#5F5E5E] mt-0.5",
					children: "Verify cohort standing, review individual student positions, or produce official report cards."
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
							onClick: () => setActiveView("rankings"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#111111] text-white hover:bg-neutral-800 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "format_list_numbered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Class Rankings →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("report-cards"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#C2410C] text-white hover:opacity-90 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "badge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Report Cards →" })]
						})
					]
				})]
			})
		]
	});
};
//#endregion
export { GradeDistributionView };
