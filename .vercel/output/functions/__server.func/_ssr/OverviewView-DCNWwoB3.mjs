import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var OverviewView = () => {
	const { classAverage, passRate, meanGrade, studentsRanked, strongestSubject, weakestSubject, nearTheLineStudents, rankings, setActiveView, setSelectedStudentId, activeStream, activeExam, students, role, schoolConfig, teacherProfile, resetToDemoData } = useGrading();
	const top5 = rankings.slice(0, 5);
	const honorsCount = rankings.filter((r) => r.meanGrade === "A" || r.meanGrade === "A-" || r.meanGrade === "B+").length;
	const honorsPct = studentsRanked > 0 ? Math.round(honorsCount / studentsRanked * 1e3) / 10 : 0;
	const passTierCount = rankings.filter((r) => r.meanGrade === "B" || r.meanGrade === "B-" || r.meanGrade === "C+").length;
	const passTierPct = studentsRanked > 0 ? Math.round(passTierCount / studentsRanked * 1e3) / 10 : 0;
	const handleViewCard = (studentId) => {
		setSelectedStudentId(studentId);
		setActiveView("report-cards");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col xl:flex-row xl:items-end justify-between pb-4 sm:pb-6 border-b border-[#DDD6C7] gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-lg text-headline-lg text-[#111111] tracking-tight",
					children: "Overview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E] mt-1",
					children: [
						activeStream,
						" · ",
						activeExam,
						" · academic performance ledger"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 sm:gap-2.5 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveView("marks-entry"),
							type: "button",
							className: "flex-1 sm:flex-none bg-[#C2410C] text-[#FEF9EF] hover:opacity-95 rounded px-4 py-2 font-headline-sm text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-none min-h-[44px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[17px]",
								children: "edit_note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enter marks" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveView("rankings"),
							type: "button",
							className: "flex-1 sm:flex-none bg-transparent border border-[#111111] text-[#111111] hover:bg-[#F2EDE3] rounded px-3.5 py-2 font-body-sm text-xs sm:text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[17px]",
								children: "format_list_numbered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View rankings" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveView("report-cards"),
							type: "button",
							className: "w-full sm:w-auto bg-transparent border border-[#111111] text-[#111111] hover:bg-[#F2EDE3] rounded px-3.5 py-2 font-body-sm text-xs sm:text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[17px]",
								children: "badge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print report cards" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-3 px-3.5 my-3 bg-[#FBF8F1] border border-[#DDD6C7] rounded flex flex-wrap items-center justify-between gap-2.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 font-semibold text-[#111111]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px] text-[#C2410C]",
								children: role === "Admin" ? "shield_person" : "school"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: role === "Admin" ? "Administrator Workspace" : `Teacher Workspace (${teacherProfile.name})` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#9A958A]",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[#5F5E5E]",
							children: [
								schoolConfig.schoolName,
								" (",
								schoolConfig.academicYear,
								" · ",
								schoolConfig.term,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-label-caps uppercase text-[#9A958A] hidden md:inline",
							children: "Jump to:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("attendance"),
							className: "px-2 py-1 bg-white border border-[#DDD6C7] hover:bg-[#F2EDE3] rounded text-[11px] font-medium text-[#111111] flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[14px]",
								children: "fact_check"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Attendance" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("messaging"),
							className: "px-2 py-1 bg-white border border-[#DDD6C7] hover:bg-[#F2EDE3] rounded text-[11px] font-medium text-[#111111] flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[14px]",
								children: "sms"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bulk SMS" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("subject-analysis"),
							className: "px-2 py-1 bg-white border border-[#DDD6C7] hover:bg-[#F2EDE3] rounded text-[11px] font-medium text-[#111111] flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[14px]",
								children: "analytics"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subjects" })]
						}),
						role === "Admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("fees"),
							className: "px-2 py-1 bg-white border border-[#DDD6C7] hover:bg-[#F2EDE3] rounded text-[11px] font-medium text-[#111111] flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[14px]",
								children: "payments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fees" })]
						})
					]
				})]
			}),
			students.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mb-6 p-5 sm:p-6 bg-amber-50/70 border border-amber-200 rounded-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[22px] text-amber-700",
								children: "school"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-headline-md font-bold text-amber-900",
								children: "Welcome to Chokur System"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-amber-800 mt-1 max-w-2xl leading-relaxed",
							children: "No enrolled candidates found in the database. You can start by enrolling candidates, configuring your school profile, or loading the official sample KCSE cohort to explore all features immediately."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveView("settings"),
									className: "underline font-semibold text-amber-900",
									children: "1. Setup School Profile →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-400",
									children: "•"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveView("students"),
									className: "underline font-semibold text-amber-900",
									children: "2. Enroll Students →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-400",
									children: "•"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveView("marks-entry"),
									className: "underline font-semibold text-amber-900",
									children: "3. Enter Marks →"
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => resetToDemoData(),
						className: "px-4 py-2 bg-[#C2410C] text-white rounded font-medium text-xs hover:opacity-90 shadow-sm shrink-0 cursor-pointer min-h-[40px] flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px]",
							children: "sync"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Load Sample Cohort (42 Students)" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 md:grid-cols-4 border-b border-[#DDD6C7] py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pr-6 pb-4 md:pb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-caps text-label-caps text-[#5F5E5E] mb-1",
							children: "CLASS AVERAGE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display-stat text-display-stat text-[#111111] leading-none",
							children: [classAverage.toFixed(1), "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-0 md:px-6 pb-4 md:pb-0 border-l-0 md:border-l border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-caps text-label-caps text-[#5F5E5E] mb-1",
							children: "UNIVERSITY PASS RATE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display-stat text-display-stat text-[#111111] leading-none",
							children: [passRate, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pr-6 md:px-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-caps text-label-caps text-[#5F5E5E] mb-1",
							children: "MEAN GRADE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display-stat text-display-stat text-[#111111] leading-none",
							children: meanGrade
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-0 md:px-6 pt-4 md:pt-0 border-t md:border-t-0 border-l-0 md:border-l border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-caps text-label-caps text-[#5F5E5E] mb-1",
							children: "STUDENTS RANKED"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display-stat text-display-stat text-[#111111] leading-none",
							children: studentsRanked
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 pt-8 gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 space-y-8 lg:pr-8 lg:border-r lg:border-[#DDD6C7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-headline-sm text-headline-sm text-[#111111]",
							children: "Subjects at a glance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveView("subject-analysis"),
							className: "text-[#C2410C] text-xs font-semibold hover:underline inline-flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Full Subject Analysis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[13px]",
								children: "arrow_forward"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3.5 space-y-2 border-b border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between font-body-md text-body-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E]",
								children: "Strongest Subject:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[#111111] font-medium",
								children: [
									strongestSubject?.name || "Kiswahili",
									", average",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md text-tabular-md font-semibold",
										children: [strongestSubject?.average?.toFixed(1) || "0.0", "%"]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between font-body-md text-body-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#5F5E5E]",
								children: "Weakest Subject:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[#111111] font-medium",
								children: [
									weakestSubject?.name || "Chemistry",
									", average",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md text-tabular-md font-semibold text-[#C2410C]",
										children: [weakestSubject?.average?.toFixed(1) || "0.0", "%"]
									})
								]
							})]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-3 border-b border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Near the line"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#5F5E5E] mt-0.5",
								children: "Students within 1–2 points of the C+ university threshold (targeted academic intervention)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-[#DDD6C7] text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 font-label-caps text-label-caps text-[#5F5E5E]",
											children: "STUDENT"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 font-label-caps text-label-caps text-[#5F5E5E] text-right",
											children: "MEAN POINTS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 font-label-caps text-label-caps text-[#5F5E5E] text-right",
											children: "AGGREGATE"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 font-label-caps text-label-caps text-[#5F5E5E] pl-6",
											children: "WEAKEST SUBJECT"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 font-label-caps text-label-caps text-[#5F5E5E] text-right",
											children: "ACTION"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-[#DDD6C7]",
									children: [nearTheLineStudents.slice(0, 6).map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "h-[44px] hover:bg-[#FBF8F1] transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-body-md text-body-md text-[#111111] font-medium",
												children: record.student.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-tabular-md text-tabular-md text-[#111111] text-right font-medium",
												children: record.meanPoints.toFixed(2)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "font-tabular-md text-tabular-md text-[#111111] text-right",
												children: [record.aggregate, "/84"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-body-sm text-body-sm text-[#5F5E5E] pl-6",
												children: record.weakestSubject ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-xs text-[#111111]",
													children: [
														record.weakestSubject.code,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#9A958A]",
															children: "·"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#C2410C]",
															children: [record.weakestSubject.score, "%"]
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#9A958A]",
													children: "—"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleViewCard(record.student.id),
													type: "button",
													className: "text-[#C2410C] font-headline-sm text-caption hover:underline cursor-pointer bg-transparent border-none p-0",
													children: "View card"
												})
											})
										]
									}, record.student.id)), nearTheLineStudents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 5,
										className: "py-4 text-center text-[#5F5E5E] font-body-sm",
										children: "No students currently within 1 point of the C+ cutoff line."
									}) })]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-2 border-t border-[#DDD6C7] flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[#5F5E5E] font-caption text-caption",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "C+ university threshold benchmark: 6.50+ Mean Points" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-tabular-sm text-tabular-sm font-medium",
								children: [nearTheLineStudents.length, " candidates in threshold window"]
							})]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-3 border-b border-[#DDD6C7] flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Top 5 Cohort Leaderboard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-caps text-label-caps text-[#5F5E5E]",
								children: "TERM STANDING"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-[#DDD6C7]",
							children: top5.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-[44px] flex items-center justify-between px-1 hover:bg-[#FBF8F1] transition-colors cursor-pointer",
								onClick: () => handleViewCard(student.student.id),
								onKeyDown: (e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleViewCard(student.student.id);
									}
								},
								role: "button",
								tabIndex: 0,
								"aria-label": `View report card for ${student.student.name}`,
								title: "Click to view report card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-tabular-md text-tabular-md text-[#5F5E5E] w-4 text-center font-bold",
										children: student.rank
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-body-md text-body-md text-[#111111] font-medium hover:text-[#C2410C]",
										children: student.student.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-tabular-md text-tabular-md text-[#5F5E5E]",
										children: [student.aggregate, "/84 pts"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, { grade: student.meanGrade })]
								})]
							}, student.student.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-2 border-t border-[#DDD6C7] flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-caption text-caption text-[#5F5E5E]",
								children: [
									"Showing ",
									Math.min(5, studentsRanked),
									" of ",
									studentsRanked,
									" ranked"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveView("rankings"),
								type: "button",
								className: "text-[#C2410C] font-headline-sm text-caption hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View full rankings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[14px]",
									children: "arrow_forward"
								})]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-t border-[#DDD6C7] pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-caps text-label-caps text-[#5F5E5E] mb-3",
							children: "AGGREGATE PERFORMANCE TIERS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center text-caption justify-between mb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#5F5E5E] font-tabular-sm",
									children: "Honors Tier (B+ to A)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-tabular-md text-[#111111] font-semibold",
									children: [
										honorsCount,
										" students (",
										honorsPct,
										"%)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-[#F2EDE3] h-1.5 rounded-none overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-[#111111] h-full",
									style: { width: `${Math.min(100, honorsPct)}%` }
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center text-caption justify-between mb-1.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#5F5E5E] font-tabular-sm",
									children: "Competent Pass Tier (C+ to B)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-tabular-md text-[#111111] font-semibold",
									children: [
										passTierCount,
										" students (",
										passTierPct,
										"%)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-[#F2EDE3] h-1.5 rounded-none overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-[#5F5E5E] h-full",
									style: { width: `${Math.min(100, passTierPct)}%` }
								})
							})] })]
						})]
					})]
				})]
			})
		]
	});
};
//#endregion
export { OverviewView };
