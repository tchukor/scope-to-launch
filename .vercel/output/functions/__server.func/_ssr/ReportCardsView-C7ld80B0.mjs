import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { r as getGradeFromScore } from "./grading-BEvvYsTK.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
import { t as ChokurLogo } from "./ChokurLogo-CWOZocP3.mjs";
import { r as init_html2canvas_esm, t as html2canvas } from "../_libs/html2canvas.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ReportCardsView-C7ld80B0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
init_html2canvas_esm();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var DEFAULT_SUBJECT_REMARKS = {
	MAT: "Excellent analytical problem solving and numerical skills.",
	ENG: "Very good comprehension, composition and grammar mastery.",
	KIS: "Lugha sanifu na uelewa thabiti wa fasihi.",
	BIO: "Strong understanding of physiological principles and experiments.",
	CHE: "Consistent performance, maintain focus on stoichiometry.",
	PHY: "Commendable application of mathematical models to mechanics.",
	HIS: "Clear grasp of international relations and constitutional history.",
	GEO: "Commendable topographical map reading and field survey analysis.",
	CRE: "Exemplary moral and scriptural grounding throughout.",
	BST: "Solid comprehension of commercial law and accounting ledgers."
};
var ReportCardsView = () => {
	const { filteredStudents: students, subjects, marks, rankings, selectedStudentId, setSelectedStudentId, schoolConfig, activeStream, activeExam, classAverage, role, setActiveView } = useGrading();
	const [searchRoster, setSearchRoster] = (0, import_react.useState)("");
	const [printAllMode, setPrintAllMode] = (0, import_react.useState)(false);
	const [isGeneratingPDF, setIsGeneratingPDF] = (0, import_react.useState)(false);
	const [mobileView, setMobileView] = (0, import_react.useState)("roster");
	const reportCardRef = (0, import_react.useRef)(null);
	const selectedCalculation = (0, import_react.useMemo)(() => {
		return rankings.find((r) => r.student.id === selectedStudentId) || rankings[0];
	}, [rankings, selectedStudentId]);
	const filteredRoster = (0, import_react.useMemo)(() => {
		if (role === "Parent") {
			const parentChild = rankings.find((r) => r.student.id === selectedStudentId) || rankings[0];
			return parentChild ? [parentChild] : [];
		}
		if (!searchRoster.trim()) return rankings;
		const q = searchRoster.toLowerCase();
		return rankings.filter((r) => r.student.name.toLowerCase().includes(q) || r.student.admNo.toLowerCase().includes(q));
	}, [
		rankings,
		searchRoster,
		role,
		selectedStudentId
	]);
	const currentIndex = (0, import_react.useMemo)(() => {
		if (!selectedCalculation) return -1;
		return filteredRoster.findIndex((r) => r.student.id === selectedCalculation.student.id);
	}, [filteredRoster, selectedCalculation]);
	const handlePrevStudent = () => {
		if (currentIndex > 0) setSelectedStudentId(filteredRoster[currentIndex - 1].student.id);
	};
	const handleNextStudent = () => {
		if (currentIndex >= 0 && currentIndex < filteredRoster.length - 1) setSelectedStudentId(filteredRoster[currentIndex + 1].student.id);
	};
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
			if (e.key === "[" || e.altKey && e.key === "ArrowUp") {
				e.preventDefault();
				handlePrevStudent();
			} else if (e.key === "]" || e.altKey && e.key === "ArrowDown") {
				e.preventDefault();
				handleNextStudent();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentIndex, filteredRoster]);
	const handlePrintSingle = () => {
		setPrintAllMode(false);
		window.print();
	};
	const handlePrintAll = () => {
		setPrintAllMode(true);
		setTimeout(() => {
			window.print();
			setPrintAllMode(false);
		}, 200);
	};
	const handleDownloadPDF = async () => {
		if (!reportCardRef.current || !selectedCalculation) return;
		try {
			setIsGeneratingPDF(true);
			const cardElement = reportCardRef.current;
			const canvas = await html2canvas(cardElement, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: "#FFFFFF"
			});
			const imgData = canvas.toDataURL("image/png");
			const pdf = new import_jspdf_node_min.default({
				orientation: "portrait",
				unit: "mm",
				format: "a4"
			});
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = canvas.height * pdfWidth / canvas.width;
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(pdfHeight, 297));
			pdf.save(`ReportCard_${selectedCalculation.student.admNo}_${selectedCalculation.student.name.replace(/\s+/g, "_")}.pdf`);
		} catch (err) {
			console.error("Error generating PDF report card:", err);
			window.print();
		} finally {
			setIsGeneratingPDF(false);
		}
	};
	const handleNativeShare = async () => {
		if (!selectedCalculation) return;
		const shareText = `KCSE Academic Progress Report for ${selectedCalculation.student.name} (ADM: ${selectedCalculation.student.admNo}) - ${schoolConfig.schoolName}: Grade ${selectedCalculation.meanGrade} (${selectedCalculation.meanPoints.toFixed(1)} pts), Best 7 Aggregate: ${selectedCalculation.aggregate}/84 pts, Rank #${selectedCalculation.rank} in ${activeStream}.`;
		if (navigator.share) try {
			await navigator.share({
				title: `Report Card - ${selectedCalculation.student.name}`,
				text: shareText
			});
		} catch {}
		else {
			navigator.clipboard.writeText(shareText);
			alert("Report summary copied to clipboard for WhatsApp sharing.");
		}
	};
	if (!selectedCalculation) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-center text-[#5F5E5E]",
		children: [
			"No active student records found in ",
			activeStream,
			"."
		]
	});
	const renderReportCard = (calc, isMultiPage = false) => {
		const studentMarks = marks[calc.student.id] || {};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			ref: isMultiPage ? void 0 : reportCardRef,
			className: `w-full max-w-[820px] bg-[#FFFFFF] border border-[#DDD6C7] p-5 sm:p-8 md:p-10 shadow-sm text-[#111111] print-sheet ${isMultiPage ? "mb-12 page-break-always" : "mb-8"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center pb-4 sm:pb-5 border-b-2 border-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center mb-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChokurLogo, {
								variant: "monochrome-dark",
								size: 32,
								showSubtitle: false
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg sm:text-[22px] font-bold tracking-tight uppercase font-headline-lg text-[#111111]",
							children: schoolConfig.schoolName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-caption text-caption text-[#5F5E5E] tracking-wider mt-0.5 uppercase text-[10px] sm:text-xs",
							children: [
								schoolConfig.postalAddress,
								" · ",
								schoolConfig.contactPhoneEmail
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "italic text-xs text-[#5F5E5E] mt-0.5",
							children: [
								"\"",
								schoolConfig.motto,
								"\""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 inline-block border-y border-[#DDD6C7] py-1 px-4 sm:px-6 bg-[#FBF8F1]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm uppercase tracking-wider font-semibold text-[#111111] text-xs sm:text-sm",
								children: "Student Academic Report Card"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-caption text-caption text-[#5F5E5E] uppercase tracking-widest mt-1 text-[10px] sm:text-xs",
							children: [
								schoolConfig.term,
								", ",
								schoolConfig.academicYear,
								" · ",
								activeExam
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-3 sm:my-4 py-2 sm:py-3 border-b border-[#DDD6C7] grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-1.5 sm:gap-y-2 font-body-sm text-body-sm text-xs sm:text-[13px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-[#DDD6C7]/50 pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E] font-caption text-caption uppercase text-[10px] sm:text-[11px]",
								children: "STUDENT NAME:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#111111]",
								children: calc.student.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-[#DDD6C7]/50 pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E] font-caption text-caption uppercase text-[10px] sm:text-[11px]",
								children: "ADMISSION NO:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-tabular-sm text-tabular-sm font-semibold text-[#111111]",
								children: calc.student.admNo
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-[#DDD6C7]/50 pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E] font-caption text-caption uppercase text-[10px] sm:text-[11px]",
								children: "CLASS & STREAM:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#111111]",
								children: calc.student.stream
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-[#DDD6C7]/50 pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E] font-caption text-caption uppercase text-[10px] sm:text-[11px]",
								children: "CLASS TEACHER:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#111111]",
								children: schoolConfig.classTeacher
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E] font-caption text-caption uppercase text-[10px] sm:text-[11px]",
								children: "KCPE MARKS:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-tabular-sm text-tabular-sm text-[#111111] font-semibold",
								children: [calc.student.kcpeMarks, " / 500"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E] font-caption text-caption uppercase text-[10px] sm:text-[11px]",
								children: "STREAM POPULATION:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-tabular-sm text-tabular-sm text-[#111111]",
								children: [students.length, " Candidates"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-3 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left border-collapse text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b-2 border-[#111111] bg-[#F8F3E9] text-[10px] sm:text-[11px] font-label-caps text-[#111111] uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 px-2",
									children: "SUBJECT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 px-2 text-center w-14",
									children: "SCORE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 px-2 text-center w-14",
									children: "GRADE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 px-2 text-center w-12",
									children: "POINTS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 px-2 hidden sm:table-cell",
									children: "TEACHER'S EVALUATION REMARKS"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#DDD6C7] font-body-sm text-[12px] sm:text-body-sm",
							children: subjects.map((subj) => {
								const val = studentMarks[subj.code];
								const isAbs = val === "ABS";
								const gradeInfo = getGradeFromScore(val);
								const remark = DEFAULT_SUBJECT_REMARKS[subj.code] || "Satisfactory academic effort.";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-[#FBF8F1]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: subj.code
												}),
												" · ",
												subj.name
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center font-tabular-sm",
											children: isAbs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#9A958A] font-bold",
												children: "ABS"
											}) : val !== null && val !== void 0 ? val : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#DDD6C7]",
												children: "—"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center",
											children: isAbs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#9A958A] font-medium text-xs",
												children: "X"
											}) : val !== null && val !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
												grade: gradeInfo.grade,
												size: "sm"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#DDD6C7]",
												children: "—"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center font-tabular-sm font-semibold",
											children: isAbs || val === null || val === void 0 ? "0" : gradeInfo.points
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-[11px] text-[#5F5E5E] italic hidden sm:table-cell",
											children: remark
										})
									]
								}, subj.code);
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-4 border-2 border-[#111111] p-3 sm:p-4 bg-[#FBF8F1] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-r border-[#DDD6C7] pr-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-label-caps uppercase text-[#5F5E5E] block",
								children: "STREAM RANK"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display-stat text-xl sm:text-2xl font-bold text-[#111111] block mt-0.5",
								children: [
									"#",
									calc.rank,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-[#5F5E5E] font-normal",
										children: ["of ", students.length]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:border-r border-[#DDD6C7] sm:pr-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-label-caps uppercase text-[#5F5E5E] block",
								children: "BEST 7 AGGREGATE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display-stat text-xl sm:text-2xl font-bold text-[#111111] block mt-0.5",
								children: [
									calc.aggregate,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#5F5E5E] font-normal",
										children: "/ 84 pts"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-r border-[#DDD6C7] pr-2 pt-2 sm:pt-0 border-t sm:border-t-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-label-caps uppercase text-[#5F5E5E] block",
								children: "MEAN SCORE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display-stat text-xl sm:text-2xl font-bold text-[#111111] block mt-0.5",
								children: [calc.average.toFixed(1), "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 sm:pt-0 border-t sm:border-t-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-label-caps uppercase text-[#5F5E5E] block",
								children: "KCSE MEAN GRADE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
									grade: calc.meanGrade,
									size: "md"
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 pt-4 border-t border-[#DDD6C7] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-[#FEF9EF] border border-[#DDD6C7] rounded",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#111111] block mb-1",
								children: "Class Teacher's Remarks:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "italic text-[#5F5E5E] text-[11px] leading-relaxed",
								children: calc.qualifies ? "Commendable performance throughout this evaluation period. Qualifies for university degree admission. Maintain consistency in revision." : "Steady effort observed. Needs intensive revision in weak subject areas to attain the university qualification cutoff threshold."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 pt-2 border-t border-dashed border-[#DDD6C7] flex justify-between text-[10px] text-[#5F5E5E]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sign: ", schoolConfig.classTeacher] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Date: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-[#FEF9EF] border border-[#DDD6C7] rounded",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#111111] block mb-1",
								children: "Principal's Seal & Remarks:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "italic text-[#5F5E5E] text-[11px] leading-relaxed",
								children: "Approved and certified by school administration. Official KNEC candidate academic standing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 pt-2 border-t border-dashed border-[#DDD6C7] flex justify-between text-[10px] text-[#5F5E5E]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Principal: ", schoolConfig.principalName || "Mrs. J. K. Cheruiyot"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official Stamp" })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-2 border-t border-[#DDD6C7] flex flex-wrap justify-between items-center text-[10px] text-[#9A958A] font-caption",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official KCSE Grading Ledger · Chokur Academic System v2.4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Next Term Opens: ", schoolConfig.termOpeningDate || "TBA"] })]
				})
			]
		}, calc.student.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col min-h-screen bg-[#FEF9EF] font-body-md text-[#111111]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "px-3 sm:px-6 py-3 sm:py-4 border-b border-[#DDD6C7] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FEF9EF] no-print",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-headline-lg text-lg sm:text-headline-lg text-[#111111]",
					children: "Report Cards"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-sm text-xs sm:text-body-sm text-[#5F5E5E]",
					children: [
						activeStream,
						" · ",
						activeExam,
						" · printable A4 certificates"
					]
				})] }), mobileView === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setMobileView("roster"),
					type: "button",
					className: "md:hidden px-3 py-1.5 bg-[#FBF8F1] border border-[#DDD6C7] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer min-h-[40px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[16px]",
						children: "arrow_back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Roster" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					role === "Parent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveView("parent-portal"),
						type: "button",
						className: "px-3 py-2 bg-[#FBF8F1] border border-[#DDD6C7] text-[#111111] rounded text-xs font-semibold hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]",
						title: "Return to Parent Portal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "arrow_back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Parent Portal" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveView("rankings"),
						type: "button",
						className: "px-3 py-2 bg-[#FBF8F1] border border-[#DDD6C7] text-[#111111] rounded text-xs font-semibold hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]",
						title: "Return to Class Rankings ledger",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "arrow_back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rankings" })]
					}),
					role !== "Parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center border border-[#DDD6C7] rounded bg-[#FBF8F1] min-h-[40px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handlePrevStudent,
								disabled: currentIndex <= 0,
								className: "p-2 text-[#5F5E5E] hover:text-[#111111] disabled:opacity-30 cursor-pointer min-h-[40px] min-w-[36px] flex items-center justify-center",
								title: "Previous Student (Press [)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[18px]",
									children: "chevron_left"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-tabular-sm px-2 text-[#5F5E5E]",
								children: [
									currentIndex + 1,
									" / ",
									filteredRoster.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleNextStudent,
								disabled: currentIndex >= filteredRoster.length - 1,
								className: "p-2 text-[#5F5E5E] hover:text-[#111111] disabled:opacity-30 cursor-pointer min-h-[40px] min-w-[36px] flex items-center justify-center",
								title: "Next Student (Press ])",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[18px]",
									children: "chevron_right"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleNativeShare,
						type: "button",
						className: "px-2.5 sm:px-3 py-2 bg-transparent border border-[#DDD6C7] text-[#111111] rounded text-xs font-medium hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]",
						title: "Share report summary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "share"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Share"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrintSingle,
						type: "button",
						className: "px-2.5 sm:px-3 py-2 bg-transparent border border-[#111111] text-[#111111] rounded text-xs font-medium hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "print"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleDownloadPDF,
						disabled: isGeneratingPDF,
						type: "button",
						className: "px-3 py-2 bg-transparent border border-[#111111] text-[#111111] rounded text-xs font-medium hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[40px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: isGeneratingPDF ? "hourglass_empty" : "download"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isGeneratingPDF ? "PDF..." : "PDF" })]
					}),
					role !== "Parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrintAll,
						type: "button",
						className: "px-3.5 py-2 bg-[#C2410C] text-[#FEF9EF] rounded text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer min-h-[40px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "print"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden sm:inline",
								children: [
									"Print All (",
									students.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "All"
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col md:flex-row overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `w-full md:w-80 shrink-0 border-r border-[#DDD6C7] flex flex-col bg-[#FEF9EF] overflow-hidden no-print ${role === "Parent" || mobileView === "card" ? "hidden" : "flex"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-b border-[#DDD6C7] space-y-2 bg-[#FEF9EF]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined absolute left-2.5 top-2.5 text-[17px] text-[#9A958A]",
							children: "search"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchRoster,
							onChange: (e) => setSearchRoster(e.target.value),
							placeholder: "Search candidate name or adm...",
							className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded pl-8 pr-3 py-2 text-xs font-body-sm text-[#111111] placeholder:text-[#9A958A] focus:outline-none focus:border-[#C2410C] min-h-[44px]"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs px-1 text-[#5F5E5E]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-caption text-caption text-[#5F5E5E]",
							children: "Class Candidates"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[#111111] font-semibold font-tabular-sm",
							children: [filteredRoster.length, " Candidates"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto divide-y divide-[#DDD6C7] max-h-[calc(100vh-210px)]",
					children: filteredRoster.map((item) => {
						const isSelected = item.student.id === selectedCalculation?.student.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								setSelectedStudentId(item.student.id);
								setMobileView("card");
							},
							className: `p-3 cursor-pointer transition-colors min-h-[56px] flex items-center justify-between ${isSelected ? "bg-[#FBF8F1] border-l-3 border-[#C2410C]" : "hover:bg-[#F2EDE3]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0 pr-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-sm text-[11px] text-[#9A958A] block",
										children: ["ADM ", item.student.admNo]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: `leading-snug truncate ${isSelected ? "font-semibold text-xs text-[#111111]" : "font-medium text-xs text-[#111111]"}`,
										children: item.student.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-2 text-[10px] text-[#5F5E5E] font-tabular-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[#111111] font-semibold",
												children: ["Rank #", item.rank]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.aggregate, "/84 pts"] })
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
									grade: item.meanGrade,
									size: "sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[16px] text-[#9A958A] md:hidden",
									children: "chevron_right"
								})]
							})]
						}, item.student.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: `flex-1 bg-[#F2EDE3] overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col items-center justify-start ${mobileView === "roster" ? "hidden md:flex" : "flex"}`,
				children: printAllMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full flex flex-col items-center",
					children: rankings.map((calc) => renderReportCard(calc, true))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full flex flex-col items-center overflow-x-auto hide-scrollbar",
					children: renderReportCard(selectedCalculation, false)
				})
			})]
		})]
	});
};
//#endregion
export { ReportCardsView };
