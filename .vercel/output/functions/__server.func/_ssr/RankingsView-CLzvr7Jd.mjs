import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { n as exportTableToCSV, r as getGradeFromScore } from "./grading-BEvvYsTK.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RankingsView-CLzvr7Jd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RankingsView = () => {
	const { rankings, subjects, marks, classAverage, meanGrade, schoolConfig, activeStream, activeExam, setSelectedStudentId, setActiveView } = useGrading();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [genderFilter, setGenderFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [showSubjectCols, setShowSubjectCols] = (0, import_react.useState)(false);
	const [isFilterSheetOpen, setIsFilterSheetOpen] = (0, import_react.useState)(false);
	const [expandedStudentId, setExpandedStudentId] = (0, import_react.useState)(null);
	const [sortField, setSortField] = (0, import_react.useState)("rank");
	const [sortDirection, setSortDirection] = (0, import_react.useState)("asc");
	const handleSort = (field) => {
		if (sortField === field) setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
		else {
			setSortField(field);
			setSortDirection(field === "name" || field === "admNo" || field === "gender" ? "asc" : "desc");
		}
	};
	const processedRankings = (0, import_react.useMemo)(() => {
		let result = [...rankings];
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter((r) => r.student.name.toLowerCase().includes(q) || r.student.admNo.toLowerCase().includes(q));
		}
		if (genderFilter !== "all") result = result.filter((r) => r.student.gender === genderFilter);
		if (statusFilter === "qualified") result = result.filter((r) => r.qualifies);
		else if (statusFilter === "unqualified") result = result.filter((r) => !r.qualifies);
		result.sort((a, b) => {
			let comparison = 0;
			if (sortField === "rank") comparison = a.rank - b.rank;
			else if (sortField === "admNo") comparison = a.student.admNo.localeCompare(b.student.admNo, void 0, { numeric: true });
			else if (sortField === "name") comparison = a.student.name.localeCompare(b.student.name);
			else if (sortField === "gender") comparison = a.student.gender.localeCompare(b.student.gender);
			else if (sortField === "kcpe") comparison = a.student.kcpeMarks - b.student.kcpeMarks;
			else if (sortField === "average") comparison = a.average - b.average;
			else if (sortField === "aggregate") comparison = a.aggregate - b.aggregate;
			else if (sortField === "meanPoints") comparison = a.meanPoints - b.meanPoints;
			else if (sortField === "subjectsPassed") comparison = a.subjectsPassed - b.subjectsPassed;
			else {
				const markA = marks[a.student.id]?.[sortField];
				const markB = marks[b.student.id]?.[sortField];
				comparison = (typeof markA === "number" ? markA : -1) - (typeof markB === "number" ? markB : -1);
			}
			return sortDirection === "asc" ? comparison : -comparison;
		});
		return result;
	}, [
		rankings,
		searchQuery,
		genderFilter,
		statusFilter,
		sortField,
		sortDirection,
		marks
	]);
	const firstBelowCPlusIdx = (0, import_react.useMemo)(() => {
		if (sortField !== "rank" && sortField !== "meanPoints" && sortField !== "aggregate") return -1;
		return processedRankings.findIndex((r) => !r.qualifies);
	}, [processedRankings, sortField]);
	const totalEnrollment = rankings.length;
	const qualifiedCount = rankings.filter((r) => r.qualifies).length;
	const highestAggregate = rankings.length > 0 ? Math.max(...rankings.map((r) => r.aggregate)) : 0;
	const handleExportCSV = () => {
		const baseHeaders = [
			"Rank",
			"Admission No",
			"Student Name",
			"Gender",
			"KCPE Marks",
			...subjects.map((s) => s.code),
			"Average",
			"Aggregate Best 7",
			"Mean Points",
			"Mean Grade",
			"Subjects Passed",
			"University Qualify"
		];
		const rows = processedRankings.map((r) => {
			const subjectScores = subjects.map((subj) => {
				const val = marks[r.student.id]?.[subj.code];
				if (val === "ABS") return "ABS";
				if (val !== null && val !== void 0) return String(val);
				return "";
			});
			return [
				String(r.rank),
				r.student.admNo,
				r.student.name,
				r.student.gender,
				String(r.student.kcpeMarks),
				...subjectScores,
				r.average.toFixed(1),
				String(r.aggregate),
				r.meanPoints.toFixed(2),
				r.meanGrade,
				`${r.subjectsPassed}/${subjects.length}`,
				r.qualifies ? "YES" : "NO"
			];
		});
		exportTableToCSV(`KCSE_Merit_Rankings_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`, baseHeaders, rows);
	};
	const handlePrint = () => {
		window.print();
	};
	const navigateToReportCard = (studentId) => {
		setSelectedStudentId(studentId);
		setActiveView("report-cards");
	};
	const renderSortIndicator = (field) => {
		if (sortField !== field) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "material-symbols-outlined text-[13px] opacity-30",
			children: "unfold_more"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "material-symbols-outlined text-[13px] text-[#C2410C]",
			children: sortDirection === "asc" ? "arrow_upward" : "arrow_downward"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-8 w-full font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden print-only mb-6 text-center border-b-2 border-black pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold uppercase tracking-tight",
						children: schoolConfig.schoolName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase",
						children: [
							schoolConfig.postalAddress,
							" · ",
							schoolConfig.motto
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-base font-semibold mt-2 uppercase tracking-wide",
						children: ["Official Academic Merit Ranking List — ", activeStream]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs",
						children: [
							activeExam,
							" · Term ",
							schoolConfig.term,
							", ",
							schoolConfig.academicYear
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mb-4 sm:mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-2 no-print",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-lg text-headline-lg text-[#111111] tracking-tight",
					children: "Rankings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-sm text-body-sm text-[#5F5E5E]",
					children: [
						activeStream,
						" · ",
						activeExam,
						" · official merit standing sorted by aggregate points"
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 border-y border-[#DDD6C7] py-3 sm:py-4 mb-4 sm:mb-6 bg-[#FBF8F1]/60 gap-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pr-3 sm:pr-4 border-r border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] block uppercase text-[10px]",
							children: "CLASS ENROLLMENT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display-stat text-xl sm:text-[26px] leading-8 text-[#111111] block mt-0.5",
							children: [
								totalEnrollment,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-caption text-caption text-[#5F5E5E] font-normal text-xs",
									children: "Students"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 sm:px-4 md:border-r border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] block uppercase text-[10px]",
							children: "QUALIFIED (C+ & ABOVE)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display-stat text-xl sm:text-[26px] leading-8 text-[#111111] block mt-0.5",
							children: [
								qualifiedCount,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-caption text-caption text-[#5F5E5E] font-normal text-xs",
									children: ["of ", totalEnrollment]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pr-3 sm:px-4 border-r border-[#DDD6C7] pt-2 md:pt-0 border-t md:border-t-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] block uppercase text-[10px]",
							children: "CLASS MEAN SCORE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display-stat text-xl sm:text-[26px] leading-8 text-[#111111] block mt-0.5",
							children: [
								classAverage.toFixed(1),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-caption text-caption text-[#5F5E5E] font-normal text-xs",
									children: [
										"(",
										meanGrade,
										")"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 sm:pl-4 pt-2 md:pt-0 border-t md:border-t-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] block uppercase text-[10px]",
							children: "HIGHEST AGGREGATE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display-stat text-xl sm:text-[26px] leading-8 text-[#111111] block mt-0.5",
							children: [
								highestAggregate,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-caption text-caption text-[#5F5E5E] font-normal text-xs",
									children: "/ 84 pts"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-4 no-print",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 sm:w-64 min-w-[200px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9A958A] text-[18px]",
								children: "search"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search student or adm...",
								className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded pl-9 pr-3 py-2 font-body-sm text-xs sm:text-body-sm text-[#111111] placeholder:text-[#9A958A] focus:outline-none focus:border-[#C2410C] min-h-[44px]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsFilterSheetOpen(true),
							type: "button",
							className: "md:hidden px-3 py-2 bg-[#FBF8F1] border border-[#DDD6C7] rounded text-xs font-medium flex items-center gap-1.5 min-h-[44px] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[18px] text-[#C2410C]",
								children: "tune"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Filters (",
								genderFilter !== "all" || statusFilter !== "all" ? "Active" : "All",
								")"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center border border-[#DDD6C7] rounded bg-[#FBF8F1] text-xs font-medium overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setGenderFilter("all"),
									className: `px-2.5 py-1.5 cursor-pointer ${genderFilter === "all" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
									children: "All Gender"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setGenderFilter("Female"),
									className: `px-2.5 py-1.5 cursor-pointer ${genderFilter === "Female" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
									children: "Female"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setGenderFilter("Male"),
									className: `px-2.5 py-1.5 cursor-pointer ${genderFilter === "Male" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
									children: "Male"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center border border-[#DDD6C7] rounded bg-[#FBF8F1] text-xs font-medium overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStatusFilter("all"),
									className: `px-2.5 py-1.5 cursor-pointer ${statusFilter === "all" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
									children: "All Tiers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStatusFilter("qualified"),
									className: `px-2.5 py-1.5 cursor-pointer ${statusFilter === "qualified" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
									children: "C+ & Above"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStatusFilter("unqualified"),
									className: `px-2.5 py-1.5 cursor-pointer ${statusFilter === "unqualified" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
									children: "Below C+"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowSubjectCols(!showSubjectCols),
							className: `hidden md:flex px-3 py-1.5 border rounded text-xs font-medium cursor-pointer items-center gap-1 transition-colors ${showSubjectCols ? "border-[#C2410C] text-[#C2410C] bg-[#FBF8F1]" : "border-[#DDD6C7] text-[#5F5E5E] bg-[#FBF8F1] hover:bg-[#F2EDE3]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[15px]",
								children: "table_chart"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showSubjectCols ? "Hide Subjects" : "Broadsheet Columns" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleExportCSV,
						type: "button",
						className: "flex-1 sm:flex-none px-3 py-2 bg-transparent border border-[#111111] text-[#111111] font-body-sm text-xs sm:text-body-sm rounded hover:bg-[#F2EDE3] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "file_download"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export CSV" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrint,
						type: "button",
						className: "flex-1 sm:flex-none px-3.5 py-2 bg-[#C2410C] text-[#FEF9EF] font-body-sm text-xs sm:text-body-sm font-medium rounded hover:opacity-95 transition-opacity inline-flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "print"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print ranking sheet" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden space-y-3 mb-6 no-print",
				children: [processedRankings.map((record, idx) => {
					const showCutoffLineBeforeThis = firstBelowCPlusIdx !== -1 && idx === firstBelowCPlusIdx;
					const isExpanded = expandedStudentId === record.student.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [showCutoffLineBeforeThis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2.5 my-2 border-y-2 border-[#111111] bg-[#F8F3E9] px-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-caps text-[10px] font-bold uppercase tracking-wider text-[#111111]",
							children: "KUCCPS DEGREE ENTRY CUTOFF (C+ / 6.5 PTS)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#111111]" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `bg-[#FBF8F1] border rounded p-3.5 transition-colors shadow-xs ${record.qualifies ? "border-[#DDD6C7]" : "border-[#DDD6C7]/60 opacity-95"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-8 h-8 rounded bg-[#111111] text-[#FEF9EF] flex items-center justify-center font-tabular-sm font-bold text-xs shrink-0",
										children: ["#", record.rank]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => navigateToReportCard(record.student.id),
										type: "button",
										className: "font-semibold text-xs text-[#111111] hover:text-[#C2410C] text-left cursor-pointer",
										children: record.student.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-[#5F5E5E] font-tabular-sm",
										children: [
											"ADM ",
											record.student.admNo,
											" ·",
											" ",
											record.student.gender === "Female" ? "F" : "M",
											" · KCPE",
											" ",
											record.student.kcpeMarks
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
									grade: record.meanGrade,
									size: "md"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-[#DDD6C7]/60 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] uppercase block font-label-caps",
										children: "Aggregate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md font-bold text-[#111111]",
										children: [record.aggregate, "/84"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] uppercase block font-label-caps",
										children: "Mean Pts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-tabular-md font-bold text-[#111111]",
										children: record.meanPoints.toFixed(1)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#5F5E5E] uppercase block font-label-caps",
										children: "Average"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md font-bold text-[#111111]",
										children: [record.average.toFixed(1), "%"]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${record.qualifies ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-neutral-100 text-neutral-600 border-neutral-300"}`,
									children: record.qualifies ? "KUCCPS QUALIFIED" : "BELOW CUTOFF"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setExpandedStudentId(isExpanded ? null : record.student.id),
										type: "button",
										className: "px-2.5 py-1 bg-[#FEF9EF] border border-[#DDD6C7] rounded text-[11px] flex items-center gap-1 cursor-pointer min-h-[36px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isExpanded ? "Hide" : "Subjects" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[14px]",
											children: isExpanded ? "expand_less" : "expand_more"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => navigateToReportCard(record.student.id),
										type: "button",
										className: "px-2.5 py-1 bg-[#111111] text-[#FEF9EF] rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer min-h-[36px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Report" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[14px]",
											children: "badge"
										})]
									})]
								})]
							}),
							isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 pt-3 border-t border-[#DDD6C7] grid grid-cols-3 sm:grid-cols-4 gap-2 bg-[#FEF9EF] p-2.5 rounded",
								children: subjects.map((subj) => {
									const val = marks[record.student.id]?.[subj.code];
									const grade = getGradeFromScore(val);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center p-1 bg-white border border-[#DDD6C7] rounded",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-semibold block text-[#5F5E5E]",
												children: subj.code
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-tabular-sm font-bold text-[#111111]",
												children: val !== null && val !== void 0 ? val : "—"
											}),
											val !== null && val !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-[#5F5E5E] block",
												children: grade.grade
											})
										]
									}, subj.code);
								})
							})
						]
					})] }, record.student.id);
				}), processedRankings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center bg-[#FBF8F1] border border-[#DDD6C7] rounded",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-3xl text-[#9A958A] mb-2 block",
							children: "person_search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm text-[#111111]",
							children: "No students found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#5F5E5E] mt-1",
							children: "No candidates match your current search or filters."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setSearchQuery("");
								setGenderFilter("all");
								setStatusFilter("all");
							},
							type: "button",
							className: "mt-3 px-3.5 py-2 bg-[#FEF9EF] border border-[#DDD6C7] rounded text-xs font-semibold text-[#111111] hover:bg-[#F2EDE3] cursor-pointer min-h-[44px]",
							children: "Reset Filters"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "h-10 border-b border-[#DDD6C7] bg-[#F8F3E9] text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider select-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("rank"),
									className: "w-16 px-3 cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RANK" }), renderSortIndicator("rank")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("admNo"),
									className: "w-24 px-3 cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ADM" }), renderSortIndicator("admNo")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("name"),
									className: "px-3 cursor-pointer hover:bg-[#EDE8DE] transition-colors min-w-[160px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "STUDENT NAME" }), renderSortIndicator("name")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("gender"),
									className: "w-16 px-2 text-center cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GEN" }), renderSortIndicator("gender")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("kcpe"),
									className: "w-20 px-2 text-right cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KCPE" }), renderSortIndicator("kcpe")]
									})
								}),
								showSubjectCols && subjects.map((subj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort(subj.code),
									className: "w-16 px-1.5 text-center cursor-pointer hover:bg-[#EDE8DE] border-l border-[#DDD6C7]/60",
									title: subj.name,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: subj.code }), renderSortIndicator(subj.code)]
									})
								}, subj.code)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("average"),
									className: "w-24 px-3 text-right cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AVG" }), renderSortIndicator("average")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("meanPoints"),
									className: "w-24 px-2 text-center cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GRADE" }), renderSortIndicator("meanPoints")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("aggregate"),
									className: "w-24 px-3 text-right cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AGG (/84)" }), renderSortIndicator("aggregate")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("subjectsPassed"),
									className: "w-28 px-3 text-right cursor-pointer hover:bg-[#EDE8DE] transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PASSED" }), renderSortIndicator("subjectsPassed")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-28 px-3 text-left",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "STATUS" })
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm text-[#111111]",
							children: [processedRankings.map((record, idx) => {
								const showCutoffLineBeforeThis = firstBelowCPlusIdx !== -1 && idx === firstBelowCPlusIdx;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [showCutoffLineBeforeThis && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
									className: "bg-[#FEF9EF]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: showSubjectCols ? subjects.length + 10 : 10,
										className: "p-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative py-2 flex items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t-2 border-[#111111]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute right-6 bg-[#FEF9EF] px-3 py-0.5 border border-[#111111] text-[#111111] font-label-caps text-[10px] uppercase tracking-wider font-bold shadow-xs",
												children: "KUCCPS Minimum University Cutoff (C+ / 6.5 Mean Points)"
											})]
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `h-11 transition-colors ${record.qualifies ? "hover:bg-[#F2EDE3]" : "hover:bg-[#F2EDE3] text-[#5C5850]"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 font-tabular-md text-tabular-md font-semibold text-[#111111]",
											children: record.rank
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 font-tabular-sm text-tabular-sm text-[#5F5E5E]",
											children: record.student.admNo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => navigateToReportCard(record.student.id),
												type: "button",
												className: "font-medium text-[#111111] hover:text-[#C2410C] hover:underline cursor-pointer text-left truncate max-w-[200px]",
												children: record.student.name
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 text-center font-caption text-caption text-[#5F5E5E]",
											children: record.student.gender === "Female" ? "F" : "M"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 text-right font-tabular-sm text-tabular-sm text-[#5F5E5E]",
											children: record.student.kcpeMarks
										}),
										showSubjectCols && subjects.map((subj) => {
											const val = marks[record.student.id]?.[subj.code];
											const isAbs = val === "ABS";
											const grade = getGradeFromScore(val);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 text-center font-tabular-sm text-[12px] border-l border-[#DDD6C7]/50",
												children: isAbs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#9A958A] font-semibold text-[10px]",
													children: "ABS"
												}) : val !== null && val !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													val,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-[#5F5E5E]",
														children: grade.grade
													})
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#DDD6C7]",
													children: "—"
												})
											}, subj.code);
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 font-tabular-md text-tabular-md text-right font-medium",
											children: [record.average.toFixed(1), "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, { grade: record.meanGrade })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 font-tabular-md text-tabular-md text-right font-semibold text-[#111111]",
											children: [record.aggregate, "/84"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 font-tabular-sm text-tabular-sm text-right text-[#5F5E5E]",
											children: [
												record.subjectsPassed,
												"/",
												subjects.length
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-block font-label-caps text-[10px] px-1.5 py-0.5 rounded border ${record.qualifies ? "border-emerald-700 text-emerald-800 bg-emerald-50" : "border-[#9A958A] text-[#5F5E5E] bg-[#F2EDE3]"}`,
												children: record.qualifies ? "QUALIFIED" : "UNQUALIFIED"
											})
										})
									]
								})] }, record.student.id);
							}), processedRankings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: showSubjectCols ? subjects.length + 10 : 10,
								className: "py-12 text-center text-[#5F5E5E]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-3xl text-[#9A958A]",
											children: "person_search"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-sm text-[#111111]",
											children: "No candidate matches found"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-[#5F5E5E]",
											children: [
												searchQuery ? `No results for "${searchQuery}".` : "No candidates match the active filters.",
												" ",
												"Try clearing search or resetting filters."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setSearchQuery("");
												setGenderFilter("all");
												setStatusFilter("all");
											},
											type: "button",
											className: "mt-2 px-3 py-1.5 bg-[#FEF9EF] border border-[#DDD6C7] rounded text-xs font-semibold text-[#111111] hover:bg-[#F2EDE3] cursor-pointer",
											children: "Clear search & filters"
										})
									]
								})
							}) })]
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rankings Ledger: Next Actions" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#5F5E5E] mt-0.5",
					children: "Review individual student report cards, inspect subject performance deviations, or update marks."
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
							onClick: () => setActiveView("report-cards"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#C2410C] text-white hover:opacity-90 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "badge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Report Cards →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("subject-analysis"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#111111] text-white hover:bg-neutral-800 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "analytics"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subject Analysis →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("marks-entry"),
							className: "px-3.5 py-2 text-xs font-semibold border border-[#111111] hover:bg-[#F2EDE3] text-[#111111] rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "edit_note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit Marks →" })]
						})
					]
				})]
			}),
			isFilterSheetOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 animate-fadeIn",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					onClick: () => setIsFilterSheetOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border-t border-[#DDD6C7] rounded-t-xl p-4 shadow-xl max-h-[80vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-[#DDD6C7] mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-headline-md font-semibold text-sm",
								children: "Sort & Filter Rankings"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsFilterSheetOpen(false),
								type: "button",
								className: "w-8 h-8 rounded-full bg-[#F2EDE3] flex items-center justify-center text-[#5F5E5E]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[18px]",
									children: "close"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-caps text-[11px] text-[#5F5E5E] uppercase block mb-2",
								children: "Gender"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									"all",
									"Female",
									"Male"
								].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setGenderFilter(g),
									type: "button",
									className: `py-2 px-3 text-xs rounded border cursor-pointer min-h-[44px] ${genderFilter === g ? "bg-[#111111] text-[#FEF9EF] border-[#111111]" : "bg-[#FBF8F1] border-[#DDD6C7] text-[#111111]"}`,
									children: g === "all" ? "All Gender" : g
								}, g))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-caps text-[11px] text-[#5F5E5E] uppercase block mb-2",
								children: "University Qualification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										id: "all",
										label: "All Tiers"
									},
									{
										id: "qualified",
										label: "C+ & Above"
									},
									{
										id: "unqualified",
										label: "Below C+"
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStatusFilter(s.id),
									type: "button",
									className: `py-2 px-3 text-xs rounded border cursor-pointer min-h-[44px] ${statusFilter === s.id ? "bg-[#111111] text-[#FEF9EF] border-[#111111]" : "bg-[#FBF8F1] border-[#DDD6C7] text-[#111111]"}`,
									children: s.label
								}, s.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-caps text-[11px] text-[#5F5E5E] uppercase block mb-2",
								children: "Sort By"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									{
										id: "rank",
										label: "Merit Rank"
									},
									{
										id: "aggregate",
										label: "Aggregate Points"
									},
									{
										id: "average",
										label: "Class Average"
									},
									{
										id: "name",
										label: "Student Name"
									},
									{
										id: "admNo",
										label: "Admission No"
									},
									{
										id: "kcpe",
										label: "KCPE Marks"
									}
								].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										handleSort(opt.id);
									},
									type: "button",
									className: `py-2 px-3 text-xs rounded border cursor-pointer min-h-[44px] text-left flex items-center justify-between ${sortField === opt.id ? "bg-[#F2EDE3] border-[#C2410C] font-semibold text-[#111111]" : "bg-[#FBF8F1] border-[#DDD6C7] text-[#111111]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt.label }), sortField === opt.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined text-[16px] text-[#C2410C]",
										children: sortDirection === "asc" ? "arrow_upward" : "arrow_downward"
									})]
								}, opt.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsFilterSheetOpen(false),
							type: "button",
							className: "w-full py-3 bg-[#111111] text-[#FEF9EF] rounded font-semibold text-xs min-h-[44px] cursor-pointer",
							children: [
								"Apply & View Results (",
								processedRankings.length,
								")"
							]
						})
					]
				})]
			})
		]
	});
};
//#endregion
export { RankingsView };
