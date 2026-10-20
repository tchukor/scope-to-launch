import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { a as sanitizeMarkInput, n as exportTableToCSV, r as getGradeFromScore } from "./grading-BEvvYsTK.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MarksEntryView-vPOr3U8Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MarksEntryView = () => {
	const { filteredStudents: students, subjects, marks, updateMark, batchUpdateMarks, rankings, activeStream, activeExam, saveStatus, forceSave, setActiveView } = useGrading();
	const [entryMode, setEntryMode] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined" && window.innerWidth < 768) return "student";
		return "grid";
	});
	const [activeStudentIdx, setActiveStudentIdx] = (0, import_react.useState)(0);
	const [activeSubjectCode, setActiveSubjectCode] = (0, import_react.useState)(subjects[0]?.code || "MAT");
	const [focusedCell, setFocusedCell] = (0, import_react.useState)(() => {
		if (students.length > 0 && subjects.length > 0) return {
			studentId: students[0].id,
			subjectCode: subjects[0].code
		};
		return null;
	});
	const [editingValue, setEditingValue] = (0, import_react.useState)("");
	const [isPastingModalOpen, setIsPastingModalOpen] = (0, import_react.useState)(false);
	const [pastedText, setPastedText] = (0, import_react.useState)("");
	const [saveToast, setSaveToast] = (0, import_react.useState)(false);
	const [validationWarning, setValidationWarning] = (0, import_react.useState)(null);
	const gridInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (focusedCell) {
			const current = marks[focusedCell.studentId]?.[focusedCell.subjectCode];
			setEditingValue(current === null || current === void 0 ? "" : String(current));
			setValidationWarning(null);
			setTimeout(() => {
				gridInputRef.current?.focus();
				gridInputRef.current?.select();
			}, 10);
		}
	}, [focusedCell, marks]);
	const navigateCell = (deltaRow, deltaCol) => {
		if (!focusedCell || students.length === 0 || subjects.length === 0) return;
		const currentStudentIdx = students.findIndex((s) => s.id === focusedCell.studentId);
		const currentSubjectIdx = subjects.findIndex((s) => s.code === focusedCell.subjectCode);
		if (currentStudentIdx === -1 || currentSubjectIdx === -1) return;
		let nextStudentIdx = currentStudentIdx + deltaRow;
		let nextSubjectIdx = currentSubjectIdx + deltaCol;
		if (deltaCol !== 0 && nextSubjectIdx >= subjects.length) {
			nextSubjectIdx = 0;
			nextStudentIdx = Math.min(students.length - 1, nextStudentIdx + 1);
		} else if (deltaCol !== 0 && nextSubjectIdx < 0) {
			nextSubjectIdx = subjects.length - 1;
			nextStudentIdx = Math.max(0, nextStudentIdx - 1);
		}
		nextStudentIdx = Math.max(0, Math.min(students.length - 1, nextStudentIdx));
		nextSubjectIdx = Math.max(0, Math.min(subjects.length - 1, nextSubjectIdx));
		commitCellEdit();
		setFocusedCell({
			studentId: students[nextStudentIdx].id,
			subjectCode: subjects[nextSubjectIdx].code
		});
	};
	const commitCellEdit = () => {
		if (!focusedCell) return;
		const { studentId, subjectCode } = focusedCell;
		const sanitized = sanitizeMarkInput(editingValue);
		const num = Number(editingValue.trim());
		if (editingValue.trim() && !isNaN(num) && (num < 0 || num > 100)) {
			setValidationWarning("Mark clamped within valid range (0–100)");
			setTimeout(() => setValidationWarning(null), 3e3);
		} else if (editingValue.trim() && sanitized === null && editingValue.trim().toUpperCase() !== "ABS") {
			setValidationWarning("Invalid entry: enter a mark (0–100) or ABS");
			setTimeout(() => setValidationWarning(null), 3e3);
		}
		updateMark(studentId, subjectCode, sanitized);
	};
	const handleGridKeyDown = (e) => {
		switch (e.key) {
			case "ArrowUp":
				e.preventDefault();
				navigateCell(-1, 0);
				break;
			case "ArrowDown":
				e.preventDefault();
				navigateCell(1, 0);
				break;
			case "ArrowLeft":
				if (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
					e.preventDefault();
					navigateCell(0, -1);
				}
				break;
			case "ArrowRight":
				if (e.currentTarget.selectionStart === editingValue.length && e.currentTarget.selectionEnd === editingValue.length) {
					e.preventDefault();
					navigateCell(0, 1);
				}
				break;
			case "Tab":
				e.preventDefault();
				if (e.shiftKey) navigateCell(0, -1);
				else navigateCell(0, 1);
				break;
			case "Enter":
				e.preventDefault();
				navigateCell(1, 0);
				break;
			case "Escape":
				e.preventDefault();
				if (focusedCell) {
					const original = marks[focusedCell.studentId]?.[focusedCell.subjectCode];
					setEditingValue(original === null || original === void 0 ? "" : String(original));
				}
		}
	};
	const handleInputChange = (e) => {
		const val = e.target.value;
		setEditingValue(val);
		const sanitized = sanitizeMarkInput(val);
		const num = Number(val.trim());
		if (val.trim() && !isNaN(num) && (num < 0 || num > 100)) setValidationWarning("Number will be clamped to 0–100");
		else if (val.trim() && sanitized === null && val.trim().toUpperCase() !== "ABS") setValidationWarning("Enter numbers (0–100) or ABS");
		else setValidationWarning(null);
	};
	const handleCellBlur = () => {
		commitCellEdit();
	};
	const handleSaveAll = () => {
		commitCellEdit();
		forceSave();
		setSaveToast(true);
		setTimeout(() => setSaveToast(false), 2500);
	};
	const currentStudent = students[activeStudentIdx] || students[0];
	const currentStudentCalc = rankings.find((r) => r.student.id === currentStudent?.id);
	const handlePrevStudent = () => {
		if (activeStudentIdx > 0) setActiveStudentIdx(activeStudentIdx - 1);
	};
	const handleNextStudent = () => {
		if (activeStudentIdx < students.length - 1) setActiveStudentIdx(activeStudentIdx + 1);
	};
	const handleSingleMarkChange = (studentId, subjectCode, rawVal) => {
		const sanitized = sanitizeMarkInput(rawVal);
		updateMark(studentId, subjectCode, sanitized);
	};
	const parsedPasteGrid = (0, import_react.useMemo)(() => {
		if (!pastedText.trim() || !focusedCell || students.length === 0 || subjects.length === 0) return null;
		const startStudentIdx = students.findIndex((s) => s.id === focusedCell.studentId);
		const startSubjectIdx = subjects.findIndex((s) => s.code === focusedCell.subjectCode);
		if (startStudentIdx === -1 || startSubjectIdx === -1) return null;
		const rawRows = pastedText.split(/\r?\n/).map((r) => r.trim()).filter((r) => r.length > 0);
		const updates = [];
		rawRows.forEach((rowStr, rIdx) => {
			const targetStudentIdx = startStudentIdx + rIdx;
			if (targetStudentIdx >= students.length) return;
			const targetStudent = students[targetStudentIdx];
			rowStr.split(/\t|,/).forEach((cellVal, cIdx) => {
				const targetSubjIdx = startSubjectIdx + cIdx;
				if (targetSubjIdx >= subjects.length) return;
				const targetSubj = subjects[targetSubjIdx];
				const trimmed = cellVal.trim();
				if (trimmed === "") updates.push({
					studentId: targetStudent.id,
					studentName: targetStudent.name,
					subjectCode: targetSubj.code,
					raw: trimmed,
					parsed: null,
					isValid: true
				});
				else {
					const upper = trimmed.toUpperCase();
					if (upper === "ABS" || upper === "A" || upper === "ABSENT") updates.push({
						studentId: targetStudent.id,
						studentName: targetStudent.name,
						subjectCode: targetSubj.code,
						raw: trimmed,
						parsed: "ABS",
						isValid: true
					});
					else {
						const num = Number(trimmed);
						if (isNaN(num)) updates.push({
							studentId: targetStudent.id,
							studentName: targetStudent.name,
							subjectCode: targetSubj.code,
							raw: trimmed,
							parsed: null,
							isValid: false,
							error: "Not a number"
						});
						else if (num < 0 || num > 100) updates.push({
							studentId: targetStudent.id,
							studentName: targetStudent.name,
							subjectCode: targetSubj.code,
							raw: trimmed,
							parsed: Math.max(0, Math.min(100, Math.round(num))),
							isValid: false,
							error: "Clamped to 0-100"
						});
						else updates.push({
							studentId: targetStudent.id,
							studentName: targetStudent.name,
							subjectCode: targetSubj.code,
							raw: trimmed,
							parsed: Math.round(num),
							isValid: true
						});
					}
				}
			});
		});
		const validUpdates = updates.filter((u) => u.isValid || u.error?.includes("Clamped"));
		const invalidCount = updates.length - validUpdates.length;
		return {
			totalCells: updates.length,
			validUpdates,
			invalidCount,
			sampleRows: updates.slice(0, 8)
		};
	}, [
		pastedText,
		focusedCell,
		students,
		subjects
	]);
	const handleApplyPaste = () => {
		if (!parsedPasteGrid || parsedPasteGrid.validUpdates.length === 0) {
			setIsPastingModalOpen(false);
			return;
		}
		const batch = parsedPasteGrid.validUpdates.map((u) => ({
			studentId: u.studentId,
			subjectCode: u.subjectCode,
			value: u.parsed
		}));
		batchUpdateMarks(batch);
		setIsPastingModalOpen(false);
		setPastedText("");
		handleSaveAll();
	};
	const handleExportEnteredMarksCSV = () => {
		const headers = [
			"AdmNo",
			"StudentName",
			...subjects.map((s) => s.code),
			"Average",
			"Aggregate",
			"Grade"
		];
		const rows = students.map((s) => {
			const calc = rankingMap.get(s.id);
			const studentMarks = marks[s.id] || {};
			const subjectCols = subjects.map((subj) => {
				const val = studentMarks[subj.code];
				return val === null || val === void 0 ? "" : String(val);
			});
			return [
				s.admNo,
				s.name,
				...subjectCols,
				calc ? calc.average.toFixed(1) : "",
				calc ? String(calc.aggregate) : "",
				calc ? calc.meanGrade : ""
			];
		});
		exportTableToCSV(`Marks_Entry_${activeStream.replace(/\s+/g, "_")}_${activeExam.replace(/\s+/g, "_")}`, headers, rows);
	};
	const rankingMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		rankings.forEach((r) => map.set(r.student.id, r));
		return map;
	}, [rankings]);
	const subjectAverages = (0, import_react.useMemo)(() => {
		return subjects.map((subj) => {
			let sum = 0;
			let count = 0;
			students.forEach((s) => {
				const val = marks[s.id]?.[subj.code];
				if (typeof val === "number") {
					sum += val;
					count++;
				}
			});
			return count > 0 ? (sum / count).toFixed(1) : "—";
		});
	}, [
		subjects,
		students,
		marks
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3 sm:p-4 md:p-6 max-w-[1440px] w-full mx-auto flex-1 flex flex-col font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-lg text-headline-lg text-[#111111] tracking-tight",
					children: "Marks Entry"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-sm text-body-sm text-[#5F5E5E]",
					children: [
						activeStream,
						" · ",
						activeExam,
						" · spreadsheet ledger with instant KNEC recalculation"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [validationWarning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded text-xs flex items-center gap-1.5 animate-fadeIn",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[15px] text-amber-700",
							children: "warning"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: validationWarning })]
					}), saveToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#111111] text-[#FEF9EF] px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 animate-fadeIn",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px] text-emerald-400",
							children: "check_circle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All records synchronized and saved" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-2.5 mb-3 border-y border-[#DDD6C7] flex flex-wrap items-center justify-between gap-3 bg-[#FBF8F1] px-3 rounded",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center p-0.5 bg-[#EDE8DE] border border-[#DDD6C7] rounded",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEntryMode("student"),
							type: "button",
							className: `px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 min-h-[36px] cursor-pointer transition-colors ${entryMode === "student" ? "bg-[#FEF9EF] text-[#111111] font-semibold shadow-xs" : "text-[#5F5E5E] hover:text-[#111111]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "person"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Student Mode" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEntryMode("subject"),
							type: "button",
							className: `px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 min-h-[36px] cursor-pointer transition-colors ${entryMode === "subject" ? "bg-[#FEF9EF] text-[#111111] font-semibold shadow-xs" : "text-[#5F5E5E] hover:text-[#111111]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "menu_book"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subject Mode" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEntryMode("grid"),
							type: "button",
							className: `px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 min-h-[36px] cursor-pointer transition-colors ${entryMode === "grid" ? "bg-[#FEF9EF] text-[#111111] font-semibold shadow-xs" : "text-[#5F5E5E] hover:text-[#111111]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "grid_on"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Full Grid" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						entryMode === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsPastingModalOpen(true),
							type: "button",
							className: "px-2.5 py-1.5 text-body-sm text-xs sm:text-[13px] font-medium text-[#111111] border border-[#111111] rounded bg-transparent hover:bg-[#F2EDE3] transition-colors flex items-center gap-1 cursor-pointer min-h-[40px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "content_paste"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Paste from Excel"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleExportEnteredMarksCSV,
							type: "button",
							className: "px-2.5 py-1.5 text-body-sm text-xs sm:text-[13px] font-medium text-[#111111] border border-[#DDD6C7] rounded bg-transparent hover:bg-[#F2EDE3] transition-colors flex items-center gap-1 cursor-pointer min-h-[40px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "download"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export CSV" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSaveAll,
							type: "button",
							className: "px-3.5 py-1.5 text-body-sm text-xs sm:text-[13px] font-medium text-[#FEF9EF] bg-[#C2410C] rounded hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer min-h-[40px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "save"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save All" })]
						})
					]
				})]
			}),
			entryMode === "student" && currentStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col max-w-2xl mx-auto w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FBF8F1] border border-[#DDD6C7] p-4 rounded mb-4 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 mb-3 border-b border-[#DDD6C7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-label-caps text-[#5F5E5E] uppercase tracking-wider block",
								children: [
									"Candidate ",
									activeStudentIdx + 1,
									" of ",
									students.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-md text-headline-md text-[#111111] font-semibold",
								children: currentStudent.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-[#5F5E5E] font-tabular-sm mt-0.5",
								children: [
									"ADM: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: currentStudent.admNo }),
									" · KCPE: ",
									currentStudent.kcpeMarks,
									" ·",
									" ",
									currentStudent.gender
								]
							})
						] }), currentStudentCalc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-[#5F5E5E]",
									children: ["Rank: #", currentStudentCalc.rank]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
									grade: currentStudentCalc.meanGrade,
									size: "md"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-[#5F5E5E] font-tabular-sm mt-1",
								children: [
									"Mean: ",
									currentStudentCalc.meanPoints.toFixed(1),
									" pts · Best 7:",
									" ",
									currentStudentCalc.aggregate,
									"/84"
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 sm:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handlePrevStudent,
								disabled: activeStudentIdx === 0,
								type: "button",
								className: "flex-1 min-w-0 shrink-0 py-2.5 px-3 min-h-[48px] bg-[#FEF9EF] border border-[#DDD6C7] hover:bg-[#F2EDE3] disabled:opacity-30 rounded font-medium text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[18px]",
									children: "arrow_back"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Prev", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "ious Student"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: activeStudentIdx,
								onChange: (e) => setActiveStudentIdx(Number(e.target.value)),
								className: "min-w-0 max-w-[45%] py-2.5 px-2 min-h-[48px] bg-[#FEF9EF] border border-[#DDD6C7] rounded text-xs font-medium cursor-pointer",
								children: students.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: idx,
									children: [
										"#",
										idx + 1,
										" ",
										s.admNo,
										" - ",
										s.name
									]
								}, s.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleNextStudent,
								disabled: activeStudentIdx === students.length - 1,
								type: "button",
								className: "flex-1 min-w-0 shrink-0 py-2.5 px-3 min-h-[48px] bg-[#FEF9EF] border border-[#DDD6C7] hover:bg-[#F2EDE3] disabled:opacity-30 rounded font-medium text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: " Student"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-[18px]",
									children: "arrow_forward"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FBF8F1] border border-[#DDD6C7] rounded overflow-hidden divide-y divide-[#DDD6C7]/70 shadow-xs mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 bg-[#FEF9EF] border-b border-[#DDD6C7] flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] text-[11px] uppercase",
							children: [
								"Curriculum Subjects (",
								subjects.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#5F5E5E]",
							children: "Enter 0–100 or ABS"
						})]
					}), subjects.map((subj) => {
						const currentVal = marks[currentStudent.id]?.[subj.code];
						const scoreNum = typeof currentVal === "number" ? currentVal : null;
						const grade = scoreNum !== null ? getGradeFromScore(scoreNum).grade : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-[#F8F3E9] transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-xs sm:text-sm text-[#111111]",
										children: subj.code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#5F5E5E] truncate",
										children: subj.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-[#9A958A] uppercase font-label-caps",
									children: subj.department
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									inputMode: "numeric",
									enterKeyHint: "next",
									value: currentVal === null || currentVal === void 0 ? "" : String(currentVal),
									onChange: (e) => handleSingleMarkChange(currentStudent.id, subj.code, e.target.value),
									placeholder: "—",
									className: "w-20 sm:w-24 h-12 text-center text-base sm:text-base font-tabular-md font-semibold bg-white border border-[#DDD6C7] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] rounded focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 flex justify-center",
									children: grade ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
										grade,
										size: "sm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#9A958A] text-xs",
										children: "—"
									})
								})]
							})]
						}, subj.code);
					})]
				})]
			}),
			entryMode === "subject" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col max-w-3xl mx-auto w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-2 mb-3",
					children: subjects.map((subj) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveSubjectCode(subj.code),
						type: "button",
						className: `px-3 py-2 min-h-[44px] rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${activeSubjectCode === subj.code ? "bg-[#111111] text-[#FEF9EF] border-[#111111]" : "bg-[#FBF8F1] text-[#5F5E5E] border-[#DDD6C7] hover:border-[#111111]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: subj.code }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-normal opacity-80 block truncate max-w-[120px]",
							children: subj.name
						})]
					}, subj.code))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FBF8F1] border border-[#DDD6C7] rounded overflow-hidden shadow-xs divide-y divide-[#DDD6C7]/70 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 bg-[#FEF9EF] border-b border-[#DDD6C7] flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-label-caps text-label-caps text-[#5F5E5E] text-[11px] uppercase",
							children: [
								"Marking ",
								activeSubjectCode,
								" for ",
								activeStream,
								" (",
								students.length,
								" Candidates)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#5F5E5E]",
							children: "Tab / Enter steps to next candidate"
						})]
					}), students.map((student, idx) => {
						const currentVal = marks[student.id]?.[activeSubjectCode];
						const scoreNum = typeof currentVal === "number" ? currentVal : null;
						const grade = scoreNum !== null ? getGradeFromScore(scoreNum).grade : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-[#F8F3E9] transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-7 text-xs font-tabular-sm text-[#9A958A]",
									children: [idx + 1, "."]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium text-xs sm:text-sm text-[#111111]",
									children: student.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-[#5F5E5E] font-tabular-sm",
									children: [
										"ADM ",
										student.admNo,
										" · KCPE ",
										student.kcpeMarks
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									inputMode: "numeric",
									enterKeyHint: "next",
									value: currentVal === null || currentVal === void 0 ? "" : String(currentVal),
									onChange: (e) => handleSingleMarkChange(student.id, activeSubjectCode, e.target.value),
									placeholder: "—",
									className: "w-20 sm:w-24 h-11 text-center text-base font-tabular-md font-semibold bg-white border border-[#DDD6C7] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] rounded focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 flex justify-center",
									children: grade ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
										grade,
										size: "sm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#9A958A] text-xs",
										children: "—"
									})
								})]
							})]
						}, student.id);
					})]
				})]
			}),
			entryMode === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 border border-[#DDD6C7] bg-[#FBF8F1] overflow-hidden flex flex-col shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto hide-scrollbar flex-1 relative max-h-[640px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left border-spacing-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "h-10 bg-[#FEF9EF] border-b border-[#DDD6C7] sticky top-0 z-30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "sticky left-0 z-30 bg-[#FEF9EF] border-r border-[#DDD6C7] px-3 py-2 w-64 min-w-[240px]",
										scope: "col",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between font-label-caps text-label-caps text-[#5F5E5E] uppercase tracking-wider text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"ADM / STUDENT NAME (",
												students.length,
												")"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined text-[14px]",
												children: "unfold_more"
											})]
										})
									}),
									subjects.map((subj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border-r border-[#DDD6C7] px-2 py-2 text-center w-20 min-w-[76px] font-label-caps text-label-caps text-[#5F5E5E]",
										scope: "col",
										title: subj.name,
										children: subj.code
									}, subj.code)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border-r border-[#DDD6C7] px-2 py-2 text-center w-16 font-label-caps text-label-caps text-[#5F5E5E]",
										children: "AVG"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border-r border-[#DDD6C7] px-2 py-2 text-center w-16 font-label-caps text-label-caps text-[#5F5E5E]",
										children: "AGG"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-16 font-label-caps text-label-caps text-[#5F5E5E]",
										children: "GRADE"
									})
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-[#DDD6C7]",
								children: students.map((student, rowIdx) => {
									const studentMarks = marks[student.id] || {};
									const calc = rankingMap.get(student.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "h-10 hover:bg-[#F8F3E9] transition-colors group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "sticky left-0 z-20 bg-[#FBF8F1] group-hover:bg-[#F8F3E9] border-r border-[#DDD6C7] px-3 py-1.5 transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-tabular-sm text-xs font-semibold text-[#111111] shrink-0",
															children: student.admNo
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-body-sm text-xs truncate text-[#111111]",
															title: student.name,
															children: student.name
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-tabular-sm text-[10px] text-[#5F5E5E] ml-1 shrink-0",
														children: student.kcpeMarks
													})]
												})
											}),
											subjects.map((subj) => {
												const isFocused = focusedCell?.studentId === student.id && focusedCell?.subjectCode === subj.code;
												const cellVal = studentMarks[subj.code];
												const isAbsent = cellVal === "ABS";
												const scoreNum = typeof cellVal === "number" ? cellVal : null;
												const grade = scoreNum !== null ? getGradeFromScore(scoreNum).grade : null;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													onClick: () => {
														commitCellEdit();
														setFocusedCell({
															studentId: student.id,
															subjectCode: subj.code
														});
													},
													className: `border-r border-[#DDD6C7] p-0 text-center relative select-none cursor-pointer ${isFocused ? "ring-2 ring-[#C2410C] z-10 bg-[#FFFDF8]" : ""}`,
													children: isFocused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														ref: gridInputRef,
														type: "text",
														inputMode: "numeric",
														value: editingValue,
														onChange: handleInputChange,
														onKeyDown: handleGridKeyDown,
														onBlur: handleCellBlur,
														className: "w-full h-full text-center font-tabular-sm text-xs font-semibold bg-transparent border-none outline-none p-0 text-[#111111]"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "w-full h-full flex items-center justify-center gap-1 px-1 py-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `font-tabular-sm text-xs ${isAbsent ? "text-red-700 font-bold" : cellVal === null || cellVal === void 0 ? "text-[#9A958A]" : "text-[#111111] font-medium"}`,
															children: isAbsent ? "ABS" : cellVal === null || cellVal === void 0 ? "—" : cellVal
														}), grade && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
															grade,
															size: "sm"
														})]
													})
												}, subj.code);
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border-r border-[#DDD6C7] px-2 py-1 text-center font-tabular-sm text-xs font-medium text-[#111111] bg-[#FEF9EF]/50",
												children: calc ? calc.average.toFixed(1) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "border-r border-[#DDD6C7] px-2 py-1 text-center font-tabular-sm text-xs font-semibold text-[#111111] bg-[#FEF9EF]/50",
												children: calc ? calc.aggregate : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-1 text-center bg-[#FEF9EF]/50",
												children: calc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
													grade: calc.meanGrade,
													size: "sm"
												}) : "—"
											})
										]
									}, student.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "h-10 bg-[#FEF9EF] border-t-2 border-[#111111] sticky bottom-0 z-30 font-semibold text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "sticky left-0 z-30 bg-[#FEF9EF] border-r border-[#DDD6C7] px-3 py-2 font-label-caps text-[#111111] uppercase tracking-wider",
										children: [
											"SUBJECT MEANS (",
											students.length,
											")"
										]
									}),
									subjectAverages.map((avg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-[#DDD6C7] px-2 py-2 text-center font-tabular-sm text-[#111111]",
										children: avg
									}, subjects[idx].code)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-[#DDD6C7] px-2 py-2 text-center font-tabular-sm text-[#C2410C]",
										children: rankings.length > 0 ? (rankings.reduce((a, b) => a + b.average, 0) / rankings.length).toFixed(1) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-[#DDD6C7] px-2 py-2 text-center font-tabular-sm text-[#111111]",
										children: rankings.length > 0 ? (rankings.reduce((a, b) => a + b.aggregate, 0) / rankings.length).toFixed(1) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-center font-label-caps text-[#111111]",
										children: "KCSE"
									})
								]
							}) })
						]
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Marks Entry Workflow: Next Actions" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#5F5E5E] mt-0.5",
					children: "Your marks are saved locally in real time. Once scores are entered, continue to performance analysis or certificate generation."
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
							onClick: () => setActiveView("subject-analysis"),
							className: "px-3.5 py-2 text-xs font-semibold border border-[#111111] hover:bg-[#F2EDE3] text-[#111111] rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "analytics"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subject Analysis →" })]
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
			}),
			isPastingModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded p-5 max-w-2xl w-full shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 mb-3 border-b border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-headline-md text-headline-md text-[#111111]",
								children: "Paste Rectangular Marks Matrix"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-[#5F5E5E]",
								children: [
									"Starting at focused cell:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: focusedCell ? `${students.find((s) => s.id === focusedCell.studentId)?.name} (${focusedCell.subjectCode})` : "First cell" })
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsPastingModalOpen(false),
								type: "button",
								className: "text-[#5F5E5E] hover:text-[#111111] p-1 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "close"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: pastedText,
							onChange: (e) => setPastedText(e.target.value),
							placeholder: "Paste tab-delimited or comma-delimited columns copied from Excel / Google Sheets here...",
							rows: 6,
							className: "w-full p-3 font-tabular-sm text-xs bg-white border border-[#DDD6C7] rounded focus:outline-none focus:border-[#C2410C]"
						}),
						parsedPasteGrid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-3 bg-[#FBF8F1] border border-[#DDD6C7] rounded text-xs space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Detected ",
									parsedPasteGrid.totalCells,
									" cells (",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-emerald-700",
										children: [parsedPasteGrid.validUpdates.length, " valid"]
									}),
									",",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-amber-700",
										children: [parsedPasteGrid.invalidCount, " invalid"]
									}),
									")"
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-[#5F5E5E] font-tabular-sm",
								children: parsedPasteGrid.sampleRows.map((sample, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mr-3 inline-block",
									children: [
										sample.studentName.split(" ")[0],
										" (",
										sample.subjectCode,
										"):",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: String(sample.parsed) })
									]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-3 border-t border-[#DDD6C7] mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsPastingModalOpen(false),
								type: "button",
								className: "px-4 py-2 border border-[#DDD6C7] rounded bg-transparent hover:bg-[#F2EDE3] font-medium text-xs min-h-[44px] cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleApplyPaste,
								disabled: !parsedPasteGrid || parsedPasteGrid.validUpdates.length === 0,
								type: "button",
								className: "px-4 py-2 bg-[#C2410C] text-[#FEF9EF] rounded font-medium text-xs hover:opacity-90 disabled:opacity-40 min-h-[44px] cursor-pointer",
								children: [
									"Apply ",
									parsedPasteGrid?.validUpdates.length || 0,
									" Marks"
								]
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
export { MarksEntryView };
