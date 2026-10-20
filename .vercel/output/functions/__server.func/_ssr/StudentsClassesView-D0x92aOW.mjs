import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudentsClassesView-D0x92aOW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var StudentsClassesView = () => {
	const { students, subjects, streams, exams, activeStream, setActiveStream, addStudent, updateStudent, removeStudent, bulkAddStudents, addSubject, updateSubject, removeSubject, addClassStream, updateClassStream, removeClassStream, addExamPeriod, updateExamPeriod, removeExamPeriod, activeSubTab, setActiveSubTab, setActiveView } = useGrading();
	const currentTab = activeSubTab || "students";
	const [searchStudent, setSearchStudent] = (0, import_react.useState)("");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const pageSize = 12;
	const [isAddModalOpen, setIsAddModalOpen] = (0, import_react.useState)(false);
	const [editingStudent, setEditingStudent] = (0, import_react.useState)(null);
	const [studentFormData, setStudentFormData] = (0, import_react.useState)({
		admNo: "",
		name: "",
		stream: activeStream,
		gender: "Female",
		kcpeMarks: 350
	});
	const [studentFormError, setStudentFormError] = (0, import_react.useState)(null);
	const [deletingStudent, setDeletingStudent] = (0, import_react.useState)(null);
	const [isCSVModalOpen, setIsCSVModalOpen] = (0, import_react.useState)(false);
	const [csvText, setCsvText] = (0, import_react.useState)("");
	const [csvImportResult, setCsvImportResult] = (0, import_react.useState)(null);
	const [isStreamModalOpen, setIsStreamModalOpen] = (0, import_react.useState)(false);
	const [editingStream, setEditingStream] = (0, import_react.useState)(null);
	const [streamFormData, setStreamFormData] = (0, import_react.useState)({
		name: "",
		form: "Form 4",
		stream: "",
		classTeacher: ""
	});
	const [deletingStream, setDeletingStream] = (0, import_react.useState)(null);
	const [isSubjectModalOpen, setIsSubjectModalOpen] = (0, import_react.useState)(false);
	const [editingSubject, setEditingSubject] = (0, import_react.useState)(null);
	const [subjectFormData, setSubjectFormData] = (0, import_react.useState)({
		code: "",
		name: "",
		department: "Languages",
		teacher: "",
		lastExamMean: 50
	});
	const [subjectFormError, setSubjectFormError] = (0, import_react.useState)(null);
	const [deletingSubject, setDeletingSubject] = (0, import_react.useState)(null);
	const [isExamModalOpen, setIsExamModalOpen] = (0, import_react.useState)(false);
	const [editingExam, setEditingExam] = (0, import_react.useState)(null);
	const [examFormData, setExamFormData] = (0, import_react.useState)({
		name: "",
		term: "Term 2",
		year: 2026,
		type: "End-term"
	});
	const [deletingExam, setDeletingExam] = (0, import_react.useState)(null);
	const filteredStudents = (0, import_react.useMemo)(() => {
		return students.filter((s) => {
			if (!(s.stream === activeStream)) return false;
			if (!searchStudent.trim()) return true;
			const q = searchStudent.toLowerCase();
			return s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q);
		});
	}, [
		students,
		activeStream,
		searchStudent
	]);
	const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
	const paginatedStudents = (0, import_react.useMemo)(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredStudents.slice(start, start + pageSize);
	}, [filteredStudents, currentPage]);
	const handleOpenAddStudent = () => {
		setEditingStudent(null);
		setStudentFormError(null);
		setStudentFormData({
			admNo: String(4e3 + students.length + 1),
			name: "",
			stream: activeStream,
			gender: "Female",
			kcpeMarks: 340
		});
		setIsAddModalOpen(true);
	};
	const handleOpenEditStudent = (student) => {
		setEditingStudent(student);
		setStudentFormError(null);
		setStudentFormData({
			admNo: student.admNo,
			name: student.name,
			stream: student.stream,
			gender: student.gender,
			kcpeMarks: student.kcpeMarks
		});
		setIsAddModalOpen(true);
	};
	const handleSaveStudent = (e) => {
		e.preventDefault();
		setStudentFormError(null);
		const adm = studentFormData.admNo.trim();
		const name = studentFormData.name.trim();
		if (!adm || !name) {
			setStudentFormError("Admission Number and Student Full Name are required.");
			return;
		}
		const duplicate = students.find((s) => s.admNo.toLowerCase() === adm.toLowerCase() && (!editingStudent || s.id !== editingStudent.id));
		if (duplicate) {
			setStudentFormError(`Admission number "${adm}" is already assigned to ${duplicate.name}.`);
			return;
		}
		if (editingStudent) updateStudent({
			...editingStudent,
			admNo: adm,
			name,
			stream: studentFormData.stream,
			gender: studentFormData.gender,
			kcpeMarks: Number(studentFormData.kcpeMarks) || 300
		});
		else addStudent({
			admNo: adm,
			name,
			stream: studentFormData.stream,
			gender: studentFormData.gender,
			kcpeMarks: Number(studentFormData.kcpeMarks) || 300,
			status: "Active"
		});
		setIsAddModalOpen(false);
	};
	const handleConfirmDeleteStudent = () => {
		if (deletingStudent) {
			removeStudent(deletingStudent.id);
			setDeletingStudent(null);
		}
	};
	const handleProcessStudentCSV = (rawText) => {
		setCsvText(rawText);
		const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
		const existingAdms = new Set(students.map((s) => s.admNo.trim().toLowerCase()));
		const parsed = [];
		lines.forEach((line, idx) => {
			if (idx === 0 && (line.toLowerCase().includes("adm") || line.toLowerCase().includes("name"))) return;
			const delimiter = line.includes("	") ? "	" : ",";
			const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ""));
			if (parts.length === 0 || !parts[0]) return;
			const admNo = parts[0];
			const name = parts[1] || "";
			const gender = (parts[2] ? parts[2].toUpperCase() : "FEMALE").startsWith("M") ? "Male" : "Female";
			const kcpe = Number(parts[3]) || 320;
			if (!admNo) parsed.push({
				admNo,
				name,
				gender,
				kcpeMarks: kcpe,
				isValid: false,
				error: "Missing admission number"
			});
			else if (!name) parsed.push({
				admNo,
				name,
				gender,
				kcpeMarks: kcpe,
				isValid: false,
				error: "Missing student name"
			});
			else if (existingAdms.has(admNo.toLowerCase())) parsed.push({
				admNo,
				name,
				gender,
				kcpeMarks: kcpe,
				isValid: false,
				error: "Admission number already exists"
			});
			else {
				existingAdms.add(admNo.toLowerCase());
				parsed.push({
					admNo,
					name,
					gender,
					kcpeMarks: kcpe,
					isValid: true
				});
			}
		});
		const validCount = parsed.filter((p) => p.isValid).length;
		const invalidCount = parsed.length - validCount;
		setCsvImportResult({
			parsed,
			validCount,
			invalidCount
		});
	};
	const handleApplyBulkStudents = () => {
		if (!csvImportResult || csvImportResult.validCount === 0) return;
		const toAdd = csvImportResult.parsed.filter((p) => p.isValid).map((p) => ({
			admNo: p.admNo,
			name: p.name,
			stream: activeStream,
			gender: p.gender,
			kcpeMarks: p.kcpeMarks,
			status: "Active"
		}));
		bulkAddStudents(toAdd);
		setIsCSVModalOpen(false);
		setCsvText("");
		setCsvImportResult(null);
	};
	const handleOpenAddStream = () => {
		setEditingStream(null);
		setStreamFormData({
			name: "Form 4 ",
			form: "Form 4",
			stream: "Central",
			classTeacher: ""
		});
		setIsStreamModalOpen(true);
	};
	const handleOpenEditStream = (str) => {
		setEditingStream(str);
		setStreamFormData({
			name: str.name,
			form: str.form,
			stream: str.stream,
			classTeacher: str.classTeacher || ""
		});
		setIsStreamModalOpen(true);
	};
	const handleSaveStream = (e) => {
		e.preventDefault();
		const fullName = `${streamFormData.form} ${streamFormData.stream}`.trim();
		if (!fullName) return;
		if (editingStream) updateClassStream({
			...editingStream,
			name: fullName,
			form: streamFormData.form,
			stream: streamFormData.stream,
			classTeacher: streamFormData.classTeacher.trim()
		});
		else addClassStream({
			name: fullName,
			form: streamFormData.form,
			stream: streamFormData.stream,
			classTeacher: streamFormData.classTeacher.trim()
		});
		setIsStreamModalOpen(false);
	};
	const handleOpenAddSubject = () => {
		setEditingSubject(null);
		setSubjectFormError(null);
		setSubjectFormData({
			code: "",
			name: "",
			department: "Sciences",
			teacher: "",
			lastExamMean: 50
		});
		setIsSubjectModalOpen(true);
	};
	const handleOpenEditSubject = (subj) => {
		setEditingSubject(subj);
		setSubjectFormError(null);
		setSubjectFormData({
			code: subj.code,
			name: subj.name,
			department: subj.department,
			teacher: subj.teacher || "",
			lastExamMean: subj.lastExamMean
		});
		setIsSubjectModalOpen(true);
	};
	const handleSaveSubject = (e) => {
		e.preventDefault();
		setSubjectFormError(null);
		const code = subjectFormData.code.toUpperCase().trim();
		const name = subjectFormData.name.trim();
		if (!code || !name) {
			setSubjectFormError("Subject code and Subject name are required.");
			return;
		}
		const dup = subjects.find((s) => s.code === code && (!editingSubject || s.id !== editingSubject.id));
		if (dup) {
			setSubjectFormError(`Subject code "${code}" is already in use by ${dup.name}.`);
			return;
		}
		if (editingSubject) updateSubject({
			...editingSubject,
			code,
			name,
			department: subjectFormData.department,
			teacher: subjectFormData.teacher.trim(),
			lastExamMean: Number(subjectFormData.lastExamMean) || 50
		});
		else addSubject({
			code,
			name,
			department: subjectFormData.department,
			teacher: subjectFormData.teacher.trim(),
			lastExamMean: Number(subjectFormData.lastExamMean) || 50,
			entered: students.length
		});
		setIsSubjectModalOpen(false);
	};
	const handleOpenAddExam = () => {
		setEditingExam(null);
		setExamFormData({
			name: "Mid-term Exam, Term 3 2026",
			term: "Term 3",
			year: 2026,
			type: "Mid-term"
		});
		setIsExamModalOpen(true);
	};
	const handleSaveExam = (e) => {
		e.preventDefault();
		if (!examFormData.name.trim()) return;
		if (editingExam) updateExamPeriod({
			...editingExam,
			name: examFormData.name.trim(),
			term: examFormData.term,
			year: Number(examFormData.year),
			type: examFormData.type
		});
		else addExamPeriod({
			name: examFormData.name.trim(),
			term: examFormData.term,
			year: Number(examFormData.year),
			type: examFormData.type
		});
		setIsExamModalOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-4 sm:mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-[#DDD6C7] pb-4 sm:pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-lg text-headline-lg text-[#111111] tracking-tight",
					children: "Students & Administration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-body-md text-xs sm:text-body-md text-[#5F5E5E] mt-1",
					children: "Manage cohort registers, streams, curriculum subjects, and exam terms"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-x-auto hide-scrollbar text-xs font-medium max-w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveSubTab("students"),
							className: `px-3.5 sm:px-4 py-2.5 min-h-[44px] cursor-pointer transition-colors whitespace-nowrap ${currentTab === "students" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
							children: "Students Register"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveSubTab("classes"),
							className: `px-3.5 sm:px-4 py-2.5 min-h-[44px] cursor-pointer transition-colors whitespace-nowrap ${currentTab === "classes" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
							children: [
								"Classes & Streams (",
								streams.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveSubTab("subjects"),
							className: `px-3.5 sm:px-4 py-2.5 min-h-[44px] cursor-pointer transition-colors whitespace-nowrap ${currentTab === "subjects" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
							children: [
								"Subjects (",
								subjects.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveSubTab("periods"),
							className: `px-3.5 sm:px-4 py-2.5 min-h-[44px] cursor-pointer transition-colors whitespace-nowrap ${currentTab === "periods" ? "bg-[#111111] text-[#FEF9EF]" : "text-[#5F5E5E] hover:bg-[#F2EDE3]"}`,
							children: [
								"Exam Periods (",
								exams.length,
								")"
							]
						})
					]
				})]
			}),
			currentTab === "students" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col lg:flex-row items-stretch lg:items-center flex-wrap justify-between gap-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9A958A] text-[18px]",
							children: "search"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchStudent,
							onChange: (e) => {
								setSearchStudent(e.target.value);
								setCurrentPage(1);
							},
							placeholder: `Search in ${activeStream}...`,
							className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded pl-9 pr-3 py-1.5 font-body-sm text-body-sm text-[#111111] placeholder:text-[#9A958A] focus:outline-none focus:border-[#C2410C]"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setCsvText("");
								setCsvImportResult(null);
								setIsCSVModalOpen(true);
							},
							type: "button",
							className: "px-3.5 py-1.5 bg-[#FBF8F1] border border-[#DDD6C7] text-[#111111] font-body-sm text-body-sm rounded hover:bg-[#F2EDE3] transition-colors flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "upload_file"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bulk Import Students" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleOpenAddStudent,
							type: "button",
							className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] font-body-sm text-body-sm font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "person_add"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Student" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-hidden shadow-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "h-10 border-b border-[#DDD6C7] bg-[#F8F3E9] text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-24 px-4",
									children: "ADM NO"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4",
									children: "FULL NAME"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-24 px-3",
									children: "GENDER"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-32 px-3 text-right",
									children: "KCPE MARKS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-32 px-3",
									children: "STREAM"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-24 px-3 text-center",
									children: "STATUS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-32 px-4 text-right",
									children: "ACTIONS"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm",
							children: [paginatedStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "h-11 hover:bg-[#F2EDE3] transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 font-tabular-sm text-tabular-sm font-semibold text-[#111111]",
										children: student.admNo
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 font-medium text-[#111111]",
										children: student.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 text-[#5F5E5E]",
										children: student.gender
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 text-right font-tabular-sm text-[#111111]",
										children: [student.kcpeMarks, " / 500"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 text-[#5F5E5E]",
										children: student.stream
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-[#111111] text-[#FEF9EF] rounded-[2px]",
											children: student.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleOpenEditStudent(student),
													className: "text-[#111111] hover:text-[#C2410C] text-xs font-medium cursor-pointer",
													children: "Edit"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#DDD6C7]",
													children: "|"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setDeletingStudent(student),
													className: "text-red-700 hover:text-red-900 text-xs font-medium cursor-pointer",
													children: "Delete"
												})
											]
										})
									})
								]
							}, student.id)), paginatedStudents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 7,
								className: "text-center py-8 text-[#5F5E5E]",
								children: [
									"No student records found in ",
									activeStream,
									"."
								]
							}) })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between text-xs text-[#5F5E5E] font-tabular-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Showing ",
						filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0,
						"–",
						Math.min(currentPage * pageSize, filteredStudents.length),
						" of",
						" ",
						filteredStudents.length,
						" candidates"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
								disabled: currentPage === 1,
								className: "px-2.5 py-1 border border-[#DDD6C7] rounded bg-[#FBF8F1] disabled:opacity-30 cursor-pointer",
								children: "Previous"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2",
								children: [
									"Page ",
									currentPage,
									" of ",
									totalPages
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
								disabled: currentPage === totalPages,
								className: "px-2.5 py-1 border border-[#DDD6C7] rounded bg-[#FBF8F1] disabled:opacity-30 cursor-pointer",
								children: "Next"
							})
						]
					})]
				})
			] }),
			currentTab === "classes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-body-sm text-[#5F5E5E]",
					children: "Registered classes and class teachers. Switching streams updates student filters across all views."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleOpenAddStream,
					type: "button",
					className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] text-body-sm font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[16px]",
						children: "add"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Class Stream" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "h-10 border-b border-[#DDD6C7] bg-[#F8F3E9] text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "CLASS / STREAM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "FORM LEVEL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "STREAM NAME"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "CLASS TEACHER"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 text-right",
								children: "ENROLLED STUDENTS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 text-right",
								children: "ACTIONS"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm",
						children: streams.map((str) => {
							const count = students.filter((s) => s.stream === str.name).length;
							const isCurrentActive = activeStream === str.name;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "h-11 hover:bg-[#F2EDE3] transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 font-semibold text-[#111111] flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: str.name }), isCurrentActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] bg-[#C2410C] text-[#FEF9EF] px-1.5 py-0.2 rounded font-bold",
											children: "ACTIVE"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 text-[#5F5E5E]",
										children: str.form
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 text-[#5F5E5E]",
										children: str.stream
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 text-[#111111]",
										children: str.classTeacher || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 text-right font-tabular-sm text-tabular-sm font-medium",
										children: [count, " Students"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-2",
											children: [
												!isCurrentActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setActiveStream(str.name),
													className: "text-[#C2410C] hover:underline text-xs font-medium cursor-pointer",
													children: "Switch to"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#DDD6C7]",
													children: "|"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleOpenEditStream(str),
													className: "text-[#111111] hover:text-[#C2410C] text-xs font-medium cursor-pointer",
													children: "Edit"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#DDD6C7]",
													children: "|"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setDeletingStream(str),
													className: "text-red-700 hover:text-red-900 text-xs font-medium cursor-pointer",
													children: "Delete"
												})
											]
										})
									})
								]
							}, str.id);
						})
					})]
				})
			})] }),
			currentTab === "subjects" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-body-sm text-[#5F5E5E]",
					children: "KCSE subjects configured in the curriculum ledger."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleOpenAddSubject,
					type: "button",
					className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] text-body-sm font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[16px]",
						children: "add"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Subject" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "h-10 border-b border-[#DDD6C7] bg-[#F8F3E9] text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "w-24 px-4",
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
								children: "SUBJECT TEACHER"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 text-right",
								children: "BENCHMARK MEAN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 text-right",
								children: "ACTIONS"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm",
						children: subjects.map((subj) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "h-11 hover:bg-[#F2EDE3] transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 font-tabular-sm text-tabular-sm font-bold text-[#111111]",
									children: subj.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 font-medium text-[#111111]",
									children: subj.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 text-[#5F5E5E]",
									children: subj.department
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 text-[#111111]",
									children: subj.teacher || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 text-right font-tabular-sm text-[#111111]",
									children: [subj.lastExamMean.toFixed(1), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleOpenEditSubject(subj),
												className: "text-[#111111] hover:text-[#C2410C] text-xs font-medium cursor-pointer",
												children: "Edit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#DDD6C7]",
												children: "|"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setDeletingSubject(subj),
												className: "text-red-700 hover:text-red-900 text-xs font-medium cursor-pointer",
												children: "Delete"
											})
										]
									})
								})
							]
						}, subj.id))
					})]
				})
			})] }),
			currentTab === "periods" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-body-sm text-[#5F5E5E]",
					children: "Examination periods and term schedules."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleOpenAddExam,
					type: "button",
					className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] text-body-sm font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[16px]",
						children: "add"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Exam Period" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-[#DDD6C7] rounded bg-[#FBF8F1] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "h-10 border-b border-[#DDD6C7] bg-[#F8F3E9] text-[11px] font-label-caps text-[#5F5E5E] uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "EXAM NAME"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "TERM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "ACADEMIC YEAR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4",
								children: "TYPE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 text-right",
								children: "ACTIONS"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm",
						children: exams.map((exam) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "h-11 hover:bg-[#F2EDE3] transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 font-semibold text-[#111111]",
									children: exam.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 text-[#5F5E5E]",
									children: exam.term
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 font-tabular-sm text-[#111111]",
									children: exam.year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 text-[#5F5E5E]",
									children: exam.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setDeletingExam(exam),
										className: "text-red-700 hover:text-red-900 text-xs font-medium cursor-pointer",
										children: "Delete"
									})
								})
							]
						}, exam.id))
					})]
				})
			})] }),
			isAddModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveStudent,
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-[#111111] mb-4 pb-2 border-b border-[#DDD6C7]",
							children: editingStudent ? "Edit Student Record" : "Add New Candidate"
						}),
						studentFormError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 p-2 bg-red-100 border border-red-300 text-red-800 text-xs rounded",
							children: studentFormError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 font-body-sm text-body-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Admission Number:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: studentFormData.admNo,
									onChange: (e) => setStudentFormData({
										...studentFormData,
										admNo: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111] focus:border-[#C2410C] focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Student Full Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: studentFormData.name,
									onChange: (e) => setStudentFormData({
										...studentFormData,
										name: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111] focus:border-[#C2410C] focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
										children: "Gender:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: studentFormData.gender,
										onChange: (e) => setStudentFormData({
											...studentFormData,
											gender: e.target.value
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111] focus:border-[#C2410C] focus:outline-none",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Female",
											children: "Female"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Male",
											children: "Male"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
										children: "KCPE Marks:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "0",
										max: "500",
										value: studentFormData.kcpeMarks,
										onChange: (e) => setStudentFormData({
											...studentFormData,
											kcpeMarks: Number(e.target.value)
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111] focus:border-[#C2410C] focus:outline-none"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Class & Stream:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: studentFormData.stream,
									onChange: (e) => setStudentFormData({
										...studentFormData,
										stream: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111] focus:border-[#C2410C] focus:outline-none",
									children: streams.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.name,
										children: s.name
									}, s.id))
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3 mt-6 pt-3 border-t border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsAddModalOpen(false),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] rounded text-sm font-medium hover:opacity-90 cursor-pointer",
								children: "Save Candidate"
							})]
						})
					]
				})
			}),
			deletingStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border-2 border-red-700 rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-red-700 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[24px]",
								children: "warning"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-headline-sm text-headline-sm",
								children: "Confirm Student Deletion"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-body-sm text-[#111111] mb-3",
							children: [
								"Are you sure you want to delete",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "font-semibold",
									children: [
										deletingStudent.name,
										" (Adm: ",
										deletingStudent.admNo,
										")"
									]
								}),
								"?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-red-50 border border-red-200 text-red-800 p-3 text-xs mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Cascading effect:" }), " All examination scores and marks entered for this student across all subjects will be permanently removed from the ledger and rankings."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeletingStudent(null),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleConfirmDeleteStudent,
								className: "px-4 py-1.5 bg-red-700 text-white rounded text-sm font-medium hover:bg-red-800 cursor-pointer",
								children: "Permanently Delete"
							})]
						})
					]
				})
			}),
			isCSVModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded max-w-2xl w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3 border-b border-[#DDD6C7] pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: ["Bulk Import Students to ", activeStream]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsCSVModalOpen(false),
								className: "text-[#5F5E5E] hover:text-[#111111] text-lg font-bold cursor-pointer",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-body-sm text-[#5F5E5E] mb-3",
							children: [
								"Paste CSV or Tab-delimited rows with columns:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-[#111111]",
									children: "AdmissionNo, FullName, Gender, KCPE"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: csvText,
							onChange: (e) => handleProcessStudentCSV(e.target.value),
							placeholder: "3950, John Doe, Male, 340\n3951, Jane Wanjiku, Female, 360",
							rows: 6,
							className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded p-3 font-tabular-sm text-xs text-[#111111] focus:border-[#C2410C] focus:outline-none"
						}),
						csvImportResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-3 bg-[#FBF8F1] border border-[#DDD6C7] text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-medium mb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-800 font-bold",
									children: [
										"✓ ",
										csvImportResult.validCount,
										" valid candidates ready to import"
									]
								}), csvImportResult.invalidCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-red-700",
									children: [
										"✗ ",
										csvImportResult.invalidCount,
										" invalid rows (skipped)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-28 overflow-y-auto divide-y divide-[#DDD6C7]/50 text-[11px] text-[#5F5E5E]",
								children: csvImportResult.parsed.slice(0, 10).map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-0.5 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										row.admNo,
										" — ",
										row.name,
										" (",
										row.gender,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: row.isValid ? "text-emerald-700" : "text-red-700 font-semibold",
										children: row.isValid ? "Valid" : row.error
									})]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsCSVModalOpen(false),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleApplyBulkStudents,
								disabled: !csvImportResult || csvImportResult.validCount === 0,
								className: "px-5 py-2 bg-[#C2410C] text-[#FEF9EF] rounded text-sm font-medium hover:opacity-90 disabled:opacity-40 cursor-pointer",
								children: [
									"Import ",
									csvImportResult ? csvImportResult.validCount : 0,
									" Students"
								]
							})]
						})
					]
				})
			}),
			isStreamModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveStream,
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-[#111111] mb-4 pb-2 border-b border-[#DDD6C7]",
							children: editingStream ? "Edit Class Stream" : "Add Class Stream"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 font-body-sm text-body-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Form Level:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: streamFormData.form,
									onChange: (e) => setStreamFormData({
										...streamFormData,
										form: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Form 1",
											children: "Form 1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Form 2",
											children: "Form 2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Form 3",
											children: "Form 3"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Form 4",
											children: "Form 4"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Stream Name (e.g. East, West, North, Central):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: streamFormData.stream,
									onChange: (e) => setStreamFormData({
										...streamFormData,
										stream: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Class Teacher:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: streamFormData.classTeacher,
									onChange: (e) => setStreamFormData({
										...streamFormData,
										classTeacher: e.target.value
									}),
									placeholder: "e.g. Mrs. S. Chelangat",
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3 mt-6 pt-3 border-t border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsStreamModalOpen(false),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E]",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] rounded text-sm font-medium",
								children: "Save Stream"
							})]
						})
					]
				})
			}),
			deletingStream && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border-2 border-red-700 rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-red-700 mb-2",
							children: "Delete Stream"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-body-sm text-[#111111] mb-3",
							children: [
								"Are you sure you want to delete ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingStream.name }),
								"?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-red-50 border border-red-200 text-red-800 p-3 text-xs mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Cascading warning:" }),
								" All",
								" ",
								students.filter((s) => s.stream === deletingStream.name).length,
								" students currently enrolled in ",
								deletingStream.name,
								" and their marks will be removed."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeletingStream(null),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E]",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									removeClassStream(deletingStream.id);
									setDeletingStream(null);
								},
								className: "px-4 py-1.5 bg-red-700 text-white rounded text-sm font-medium",
								children: "Delete Stream & Students"
							})]
						})
					]
				})
			}),
			isSubjectModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveSubject,
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-[#111111] mb-4 pb-2 border-b border-[#DDD6C7]",
							children: editingSubject ? "Edit Subject" : "Add Curriculum Subject"
						}),
						subjectFormError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 p-2 bg-red-100 border border-red-300 text-red-800 text-xs rounded",
							children: subjectFormError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 font-body-sm text-body-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
										children: "Subject Code:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										maxLength: 4,
										value: subjectFormData.code,
										onChange: (e) => setSubjectFormData({
											...subjectFormData,
											code: e.target.value.toUpperCase()
										}),
										placeholder: "e.g. FRE",
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
										children: "Department:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: subjectFormData.department,
										onChange: (e) => setSubjectFormData({
											...subjectFormData,
											department: e.target.value
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Languages",
												children: "Languages"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sciences",
												children: "Sciences"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Mathematics",
												children: "Mathematics"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Humanities",
												children: "Humanities"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Applied Sciences",
												children: "Applied Sciences"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Technicals",
												children: "Technicals"
											})
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Subject Full Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: subjectFormData.name,
									onChange: (e) => setSubjectFormData({
										...subjectFormData,
										name: e.target.value
									}),
									placeholder: "e.g. French",
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Subject Teacher:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: subjectFormData.teacher,
									onChange: (e) => setSubjectFormData({
										...subjectFormData,
										teacher: e.target.value
									}),
									placeholder: "e.g. Madame Dubois",
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Previous Exam Benchmark Mean:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.1",
									value: subjectFormData.lastExamMean,
									onChange: (e) => setSubjectFormData({
										...subjectFormData,
										lastExamMean: Number(e.target.value)
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3 mt-6 pt-3 border-t border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsSubjectModalOpen(false),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E]",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] rounded text-sm font-medium",
								children: "Save Subject"
							})]
						})
					]
				})
			}),
			deletingSubject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border-2 border-red-700 rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-red-700 mb-2",
							children: "Delete Subject"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-body-sm text-[#111111] mb-3",
							children: [
								"Are you sure you want to remove",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									deletingSubject.code,
									" — ",
									deletingSubject.name
								] }),
								"?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-red-50 border border-red-200 text-red-800 p-3 text-xs mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Cascading warning:" }),
								" All student marks recorded under",
								" ",
								deletingSubject.code,
								" across all cohort exams will be permanently deleted."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeletingSubject(null),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E]",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									removeSubject(deletingSubject.code);
									setDeletingSubject(null);
								},
								className: "px-4 py-1.5 bg-red-700 text-white rounded text-sm font-medium",
								children: "Delete Subject & Marks"
							})]
						})
					]
				})
			}),
			isExamModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveExam,
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-[#111111] mb-4 pb-2 border-b border-[#DDD6C7]",
							children: editingExam ? "Edit Exam Period" : "Add Examination Period"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 font-body-sm text-body-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Examination Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: examFormData.name,
									onChange: (e) => setExamFormData({
										...examFormData,
										name: e.target.value
									}),
									placeholder: "e.g. End-term Exam, Term 3 2026",
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
										children: "Term:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: examFormData.term,
										onChange: (e) => setExamFormData({
											...examFormData,
											term: e.target.value
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Term 1",
												children: "Term 1"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Term 2",
												children: "Term 2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Term 3",
												children: "Term 3"
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
										children: "Year:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: examFormData.year,
										onChange: (e) => setExamFormData({
											...examFormData,
											year: Number(e.target.value)
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#5F5E5E] text-xs font-medium uppercase mb-1",
									children: "Exam Type:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: examFormData.type,
									onChange: (e) => setExamFormData({
										...examFormData,
										type: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-1.5 text-[#111111]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Mid-term",
											children: "Mid-term"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "End-term",
											children: "End-term"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Mock",
											children: "Mock Exam"
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3 mt-6 pt-3 border-t border-[#DDD6C7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsExamModalOpen(false),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E]",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] rounded text-sm font-medium",
								children: "Save Exam Period"
							})]
						})
					]
				})
			}),
			deletingExam && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border-2 border-red-700 rounded max-w-md w-full p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-sm text-headline-sm text-red-700 mb-2",
							children: "Delete Exam Period"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-body-sm text-[#111111] mb-3",
							children: [
								"Are you sure you want to delete ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingExam.name }),
								"?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeletingExam(null),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E]",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									removeExamPeriod(deletingExam.id);
									setDeletingExam(null);
								},
								className: "px-4 py-1.5 bg-red-700 text-white rounded text-sm font-medium",
								children: "Confirm Delete"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 p-4 sm:p-5 bg-[#FBF8F1] border border-[#DDD6C7] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "font-semibold text-sm text-[#111111] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[18px] text-[#C2410C]",
						children: "route"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Roster & Administration: Next Steps" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#5F5E5E] mt-0.5",
					children: "Cohort records updated. Continue to daily roll-call attendance, marks entry, or academic rankings."
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
							onClick: () => setActiveView("marks-entry"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#C2410C] text-white hover:opacity-90 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "edit_note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enter Marks →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("attendance"),
							className: "px-3.5 py-2 text-xs font-semibold bg-[#111111] text-white hover:bg-neutral-800 rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "fact_check"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Take Attendance →" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveView("rankings"),
							className: "px-3.5 py-2 text-xs font-semibold border border-[#111111] hover:bg-[#F2EDE3] text-[#111111] rounded flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "format_list_numbered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Class Rankings →" })]
						})
					]
				})]
			})
		]
	});
};
//#endregion
export { StudentsClassesView };
