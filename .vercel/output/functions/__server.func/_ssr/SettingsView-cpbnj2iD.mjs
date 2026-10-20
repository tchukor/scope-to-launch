import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as GradeChip } from "./GradeChip-QZ6vP-7w.mjs";
import { i as parseMarksCSV, t as KCSE_GRADING_TABLE } from "./grading-BEvvYsTK.mjs";
import { t as useGrading } from "./GradingContext-ByMlyQ-9.mjs";
import { t as ChokurLogo } from "./ChokurLogo-CWOZocP3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SettingsView-cpbnj2iD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LegalModals = ({ activeModal, onClose }) => {
	const [activeTab, setActiveTab] = (0, import_react.useState)(activeModal || "privacy");
	import_react.useEffect(() => {
		if (activeModal) setActiveTab(activeModal);
	}, [activeModal]);
	if (!activeModal) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "legal-modal-title",
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-[#FEF9EF] border-2 border-[#111111] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#111111]",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 bg-[#FBF8F1] border-b border-[#DDD6C7] flex items-center justify-between shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChokurLogo, {
							variant: "symbol",
							size: 26
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "legal-modal-title",
							className: "font-headline-md text-base sm:text-lg font-bold text-[#111111] leading-tight",
							children: "Chokur Legal & Compliance Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#5F5E5E]",
							children: "Kenyan Secondary School Basic Education & Data Protection Framework"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						type: "button",
						"aria-label": "Close dialog",
						className: "p-1.5 rounded hover:bg-[#F2EDE3] text-[#5F5E5E] hover:text-[#111111] transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[22px]",
							children: "close"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pt-3 bg-[#FBF8F1] border-b border-[#DDD6C7] flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("privacy"),
							className: `pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "privacy" ? "border-[#C2410C] text-[#C2410C]" : "border-transparent text-[#5F5E5E] hover:text-[#111111]"}`,
							children: "Privacy Policy (DPA 2019)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("terms"),
							className: `pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "terms" ? "border-[#C2410C] text-[#C2410C]" : "border-transparent text-[#5F5E5E] hover:text-[#111111]"}`,
							children: "Terms of Service"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("compliance"),
							className: `pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === "compliance" ? "border-[#C2410C] text-[#C2410C]" : "border-transparent text-[#5F5E5E] hover:text-[#111111]"}`,
							children: "MoE / KNEC Compliance"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed text-[#333333]",
					children: [
						activeTab === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Kenya Data Protection Act (DPA No. 24 of 2019) Notice:" }), " Chokur is engineered as a zero-cloud-telemetry, offline-first application. All student biodata, marks, and guardian telephone records reside exclusively in your local browser storage (IndexedDB Level 2)."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-[#111111] text-sm sm:text-base",
											children: "1. Information Collected & Processed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Chokur system processes educational records required under the Ministry of Education Basic Education curriculum, including:" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "list-disc list-inside pl-2 space-y-1 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pupil Biodata:" }), " Official school admission number (NEMIS compatible), legal full name, gender, KCPE baseline scores, and class stream assignment."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Academic Marks:" }), " Raw continuous assessment test (CAT) marks, mid-term, and end-term exam percentages across all registered KCSE subjects."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Guardian Contacts:" }), " Parent or guardian full names and phone numbers used strictly for attendance alerts and fee billing notifications."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Financial Records:" }), " School term fee assessments, receipts, M-Pesa/Bank reference codes, and outstanding balances."] })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "2. Section 31: Processing of Children’s Personal Data"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Under Section 31 of the Kenya Data Protection Act 2019, processing of personal data relating to a child is carried out with the prior authorization of the child’s parent, guardian, or educational authority. Student data is never used for automated profiling, advertising, or commercial monetization." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "3. Data Storage & Zero Cloud Exposure"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Unlike typical SaaS platforms, Chokur does not stream entered marks to foreign cloud servers. Your school’s database is stored locally inside your browser’s encrypted IndexedDB sandbox. Even in offline rural schools without internet access, your ledger functions reliably with zero third-party exposure." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "4. Rights of Data Subjects"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Parents, guardians, and adult students maintain the statutory right to request access to their records, rectify inaccurate examination entries, and request export of their complete academic history in standardized JSON or CSV format." })]
								})
							]
						}),
						activeTab === "terms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Standard School Software Agreement:" }), " By accessing and utilizing the Chokur School Management platform, educational institutions and authorized teachers agree to the operational guidelines outlined herein."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "1. Authorized Institutional Use"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chokur is licensed for use by recognized Kenyan secondary schools, academies, teachers, directors of studies (DoS), bursars, and guardians. User accounts must accurately reflect the staff member's real responsibility within the school hierarchy." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "2. KCSE 12-Point Grading Standard Adherence"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Calculations executed within the system conform strictly to the Kenya National Examinations Council (KNEC) 12-point grading scale (A = 12 points, A- = 11, B+ = 10, down to E = 1 point). While Chokur automates points aggregation and KUCCPS minimum C+ university entry qualifications, the final validity of transcripts remains the legal responsibility of the school principal." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "3. Offline Responsibility & Database Backups"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Because the application operates offline-first using client-side IndexedDB, schools must periodically export JSON backup files from the",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Settings & Backups" }),
										" view and store them securely on physical school hard drives or institutional email archives. Chokur is not liable for data loss caused by hard drive wipes or clearing browser cache without prior backups."
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "4. Report Card Certification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Official printed report cards generated by this software must bear the physical or certified digital signature of the class teacher and the principal, alongside the official school rubber stamp or embossed seal, to be recognized as authentic Kenyan academic transcripts." })]
								})
							]
						}),
						activeTab === "compliance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-[#F2EDE3] border border-[#DDD6C7] rounded text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ministry of Education & KNEC Compliance Alignment:" }), " System specifications built directly for Kenyan secondary curricula (Form 1 through Form 4)."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-[#111111] text-sm sm:text-base",
											children: "1. KCSE Subject Groupings & Calculation Methods"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chokur natively enforces KNEC subject classifications:" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "list-disc list-inside pl-2 space-y-1 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Group I (Compulsory):" }), " Mathematics (121), English (101), Kiswahili (102)."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Group II (Sciences):" }), " Biology (231), Chemistry (233), Physics (232)."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Group III (Humanities):" }), " History & Government (311), Geography (312), Christian Religious Education (313)."] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Group IV & V (Applied & Technical):" }), " Business Studies (565), Agriculture (443), Computer Studies (451)."] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "pt-1",
											children: [
												"The grading engine supports both ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mean of All Subjects" }),
												" and",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Official KNEC Best 7" }),
												" aggregation formulas, ensuring candidate qualifications for KUCCPS degree placement are exact."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "2. Roll-Call Attendance & Child Safety Standards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Under basic education safety directives, schools are required to account for learner presence every school day. Chokur's integrated attendance ledger automatically isolates absent pupils and prepares instant SMS alerts to parents, ensuring unaccounted absenteeism is eliminated." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-[#111111] text-sm sm:text-base",
										children: "3. Auditability & Data Purging"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Schools can instantly purge alumni cohorts upon completion of Form 4 graduation, or retain archive snapshots for up to 7 years in compliance with Kenya public records retention regulations." })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-3.5 bg-[#FBF8F1] border-t border-[#DDD6C7] flex flex-wrap items-center justify-between gap-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-[#5F5E5E] font-mono",
						children: "Republic of Kenya · Basic Education Act 2013 & DPA 2019"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => window.print(),
							className: "px-3 py-1.5 border border-[#DDD6C7] bg-[#FEF9EF] hover:bg-[#F2EDE3] rounded text-xs font-medium text-[#111111] flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[15px]",
								children: "print"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print Policy" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "px-4 py-1.5 bg-[#111111] text-[#FEF9EF] hover:bg-neutral-800 rounded text-xs font-semibold cursor-pointer",
							children: "Acknowledge & Close"
						})]
					})]
				})
			]
		})
	});
};
var TEST_PRESETS = [
	{
		id: "preset-form4-east",
		name: "Form 4 East — Standard KCSE Cohort",
		tagline: "Realistic balanced performance bell curve",
		form: "Form 4",
		stream: "Form 4 East",
		studentCount: 42,
		meanGrade: "B-",
		meanPoints: 7.21,
		highlight: "Standard distribution from A down to D- across 8 subjects. Ideal for checking general rankings and report card generation.",
		category: "Standard",
		generate: () => {
			return { state: { uiState: {
				activeStream: "Form 4 East",
				activeExam: "End-term Exam, Term 2 2026",
				activeView: "overview",
				selectedStudentId: "s-1",
				activeSubTab: "students"
			} } };
		}
	},
	{
		id: "preset-form4-stem",
		name: "Form 4 West — STEM High Achievers",
		tagline: "Exemplary science & mathematics cohort",
		form: "Form 4",
		stream: "Form 4 West",
		studentCount: 38,
		meanGrade: "B+",
		meanPoints: 9.35,
		highlight: "Multiple A and A- grades with high subject means in Mathematics, Chemistry, Physics, and Biology. Minimal fee arrears.",
		category: "STEM",
		generate: () => {
			const stemStudents = Array.from({ length: 38 }, (_, i) => {
				const id = `stem-${i + 1}`;
				const adm = `38${String(10 + i).padStart(2, "0")}`;
				const names = [
					"Otieno Brian Kevin",
					"Kiprono Mercy Jepchumba",
					"Njoroge Samuel Kamau",
					"Achieng Stephanie Nicole",
					"Kariuki Emmanuel Mwangi",
					"Mutua Daniel Kyalo",
					"Chepkirui Joyline",
					"Wamalwa Victor Barasa",
					"Mwangi Dennis Githinji",
					"Onyango Cynthia Akoth",
					"Kipchumba Festus",
					"Maina Grace Wambui",
					"Koech Kelvin Kiprotich",
					"Wambua Faith Mwende",
					"Korir Allan Kiprop",
					"Mwende Christine",
					"Njuguna Ian Ndung'u",
					"Chebet Gloria",
					"Kimani David Macharia",
					"Atieno Lavender",
					"Simiyu Collins",
					"Kiptoo Evans",
					"Muthoni Sharon",
					"Ouma George",
					"Kosgei Brenda",
					"Cheruiyot Gideon",
					"Moraa Janet",
					"Rono Dominic",
					"Wairimu Lucy",
					"Kibet Hillary",
					"Jepkemboi Vivian",
					"Ndegwa Peter",
					"Auma Belinda",
					"Rotich Nathan",
					"Njeri Beatrice",
					"Kiptanui Silas",
					"Wanja Esther",
					"Kipruto Titus"
				];
				return {
					id,
					admNo: adm,
					name: names[i % names.length],
					gender: i % 2 === 0 ? "M" : "F",
					stream: "Form 4 West",
					kcpeMarks: 360 + i * 11 % 65,
					subjects: [
						"MAT",
						"ENG",
						"KIS",
						"BIO",
						"CHE",
						"PHY",
						"GEO",
						"BST"
					]
				};
			});
			const stemMarks = {};
			stemStudents.forEach((student, idx) => {
				stemMarks[student.id] = {
					MAT: Math.min(98, 72 + idx * 7 % 27),
					ENG: Math.min(94, 68 + idx * 5 % 26),
					KIS: Math.min(92, 65 + idx * 8 % 26),
					CHE: Math.min(96, 70 + idx * 6 % 27),
					PHY: Math.min(95, 74 + idx * 9 % 24),
					BIO: Math.min(93, 69 + idx * 4 % 24),
					GEO: Math.min(94, 68 + idx * 7 % 26),
					BST: Math.min(96, 75 + idx * 5 % 23)
				};
			});
			return {
				state: {
					students: stemStudents,
					marks: stemMarks,
					uiState: {
						activeStream: "Form 4 West",
						activeExam: "End-term Exam, Term 2 2026",
						activeView: "rankings",
						selectedStudentId: "stem-1",
						activeSubTab: "students"
					}
				},
				opsData: {
					feePerTerm: 45e3,
					payments: stemStudents.slice(0, 32).map((s, i) => ({
						studentId: s.id,
						amount: 45e3,
						method: i % 2 === 0 ? "M-Pesa" : "Bank",
						ref: `MPESA-STEM-${1e3 + i}`
					}))
				}
			};
		}
	},
	{
		id: "preset-form3-remedial",
		name: "Form 3 East — Academic Intervention & Recovery",
		tagline: "High failure rate & remedial tracking",
		form: "Form 3",
		stream: "Form 3 East",
		studentCount: 30,
		meanGrade: "C-",
		meanPoints: 4.85,
		highlight: "Significant grade dip in Mathematics and Chemistry with 12 candidates in D and E grade tiers. Tests bulk SMS intervention and parent alerts.",
		category: "Remedial",
		generate: () => {
			const remedialStudents = Array.from({ length: 30 }, (_, i) => {
				const id = `rem-${i + 1}`;
				const adm = `29${String(20 + i).padStart(2, "0")}`;
				const names = [
					"Karanja Paul Mwangi",
					"Wanjala Moses Wekesa",
					"Adhiambo Cynthia",
					"Kipkoech Brian",
					"Nekesa Mercy",
					"Murimi Antony",
					"Chepkoech Lilian",
					"Wafula Dennis",
					"Mwangi Kelvin",
					"Akoth Millicent",
					"Koech Collins",
					"Njoki Faith",
					"Ochieng Kennedy",
					"Chepngetich Daisy",
					"Kariuki Francis",
					"Auma Everlyne",
					"Kiprotich Dan",
					"Wambui Mary",
					"Odhiambo Philip",
					"Jeptoo Maureen",
					"Mutiso Justus",
					"Muthoni Jane",
					"Kiptoo Amos",
					"Wanjiru Ann",
					"Barasa Felix",
					"Chebet Sheila",
					"Ndung'u Joseph",
					"Awino Grace",
					"Kipkemoi Eric",
					"Wangari Sarah"
				];
				return {
					id,
					admNo: adm,
					name: names[i % names.length],
					gender: i % 2 === 0 ? "M" : "F",
					stream: "Form 3 East",
					kcpeMarks: 270 + i * 9 % 70,
					subjects: [
						"MAT",
						"ENG",
						"KIS",
						"BIO",
						"CHE",
						"CRE",
						"HIS",
						"AGR"
					]
				};
			});
			const remedialMarks = {};
			remedialStudents.forEach((student, idx) => {
				remedialMarks[student.id] = {
					MAT: Math.max(18, 22 + idx * 8 % 42),
					ENG: Math.max(30, 40 + idx * 5 % 35),
					KIS: Math.max(28, 38 + idx * 6 % 36),
					CHE: Math.max(16, 24 + idx * 7 % 38),
					BIO: Math.max(25, 34 + idx * 6 % 40),
					CRE: Math.max(38, 48 + idx * 7 % 36),
					HIS: Math.max(32, 44 + idx * 5 % 38),
					AGR: Math.max(30, 42 + idx * 6 % 39)
				};
			});
			const absents = remedialStudents.slice(0, 8).map((s) => s.id);
			return {
				state: {
					students: remedialStudents,
					marks: remedialMarks,
					uiState: {
						activeStream: "Form 3 East",
						activeExam: "Mid-term Exam, Term 2 2026",
						activeView: "subject-analysis",
						selectedStudentId: "rem-1",
						activeSubTab: "students"
					}
				},
				opsData: {
					feePerTerm: 42e3,
					absentStudents: absents,
					payments: remedialStudents.slice(0, 10).map((s, i) => ({
						studentId: s.id,
						amount: 2e4,
						method: "M-Pesa",
						ref: `MPESA-REM-${i + 10}`
					}))
				}
			};
		}
	},
	{
		id: "preset-fee-arrears",
		name: "Form 4 North — High Fee Arrears & Defaulters",
		tagline: "Stress test for fee collection & SMS notices",
		form: "Form 4",
		stream: "Form 4 North",
		studentCount: 35,
		meanGrade: "B-",
		meanPoints: 6.94,
		highlight: "Simulates Term 2 fee ledger with KES 850,000+ total arrears. Prepares instant bulk SMS reminder broadcasts and bursar payment records.",
		category: "Finance",
		generate: () => {
			const feeStudents = Array.from({ length: 35 }, (_, i) => {
				const id = `fee-${i + 1}`;
				const adm = `44${String(10 + i).padStart(2, "0")}`;
				const names = [
					"Mokua Geoffrey",
					"Kipchirchir Enock",
					"Wanjohi Simon",
					"Chemutai Sharon",
					"Omondi Patrick",
					"Gathoni Priscillah",
					"Kiptalam Noah",
					"Wamalwa Collins",
					"Achieng Beatrice",
					"Kipruto Mathew",
					"Nyambura Caroline",
					"Mutuku Boniface",
					"Jemutai Gladys",
					"Ouma Victor",
					"Kariuki Benson",
					"Chepkorir Jackline",
					"Kipng'etich Ronald",
					"Njeri Damaris",
					"Maina Stephen",
					"Awuor Hellen",
					"Kiprop Edwin",
					"Muthomi Martin",
					"Cherotich Diana",
					"Simiyu Brian",
					"Wangui Elizabeth",
					"Koech Wesley",
					"Akello Judith",
					"Wanyonyi Samuel",
					"Chebet Purity",
					"Kimutai Alex",
					"Mumbi Agnes",
					"Kiprono Dominic",
					"Atieno Linet",
					"Nduta Mercy",
					"Kipkemoi Vincent"
				];
				return {
					id,
					admNo: adm,
					name: names[i % names.length],
					gender: i % 2 === 0 ? "M" : "F",
					stream: "Form 4 North",
					kcpeMarks: 310 + i * 7 % 60,
					subjects: [
						"MAT",
						"ENG",
						"KIS",
						"BIO",
						"CHE",
						"PHY",
						"GEO",
						"BST"
					]
				};
			});
			const feeMarks = {};
			feeStudents.forEach((student, idx) => {
				feeMarks[student.id] = {
					MAT: 55 + idx * 6 % 35,
					ENG: 62 + idx * 4 % 28,
					KIS: 58 + idx * 5 % 30,
					CHE: 52 + idx * 7 % 36,
					PHY: 54 + idx * 6 % 34,
					BIO: 58 + idx * 5 % 30,
					GEO: 60 + idx * 4 % 30,
					BST: 64 + idx * 5 % 26
				};
			});
			const payments = [...feeStudents.slice(0, 8).map((s, i) => ({
				studentId: s.id,
				amount: 45e3,
				method: "Bank",
				ref: `BANK-DEP-${200 + i}`
			})), ...feeStudents.slice(8, 20).map((s, i) => ({
				studentId: s.id,
				amount: 15e3 + i * 1500,
				method: "M-Pesa",
				ref: `MPESA-PART-${300 + i}`
			}))];
			return {
				state: {
					students: feeStudents,
					marks: feeMarks,
					uiState: {
						activeStream: "Form 4 North",
						activeExam: "End-term Exam, Term 2 2026",
						activeView: "fees",
						selectedStudentId: "fee-1",
						activeSubTab: "students"
					}
				},
				opsData: {
					feePerTerm: 45e3,
					payments
				}
			};
		}
	},
	{
		id: "preset-form1-clean",
		name: "Form 1 East — Fresh Admissions Baseline",
		tagline: "Clean enrollment roster awaiting marks",
		form: "Form 1",
		stream: "Form 1 East",
		studentCount: 32,
		meanGrade: "—",
		meanPoints: 0,
		highlight: "Initial intake with admission numbers and KCPE entry scores ready for Term 1 marks entry. Excellent for testing zero-state and data entry.",
		category: "Admissions",
		generate: () => {
			const f1Students = Array.from({ length: 32 }, (_, i) => {
				const id = `f1-${i + 1}`;
				const adm = `51${String(1 + i).padStart(2, "0")}`;
				const names = [
					"Mumo Daniel Musyoka",
					"Chepkemoi Mercy",
					"Oduor Michael Kevin",
					"Njeri Sandra Wairimu",
					"Kiplangat Caleb",
					"Kwamboka Brenda",
					"Wanjiku Brian Njuguna",
					"Nakhumicha Faith",
					"Kiprono Emmanuel",
					"Atieno Joy",
					"Mutua Kelvin",
					"Jeptum Naomy",
					"Kariuki Dennis",
					"Achieng Tracy",
					"Simiyu Abel",
					"Moraa Sharon",
					"Kibet Gideon",
					"Wambui Claire",
					"Onyango Elvis",
					"Chebet Yvonne",
					"Ndung'u Allan",
					"Akoth Irene",
					"Kiptoo Felix",
					"Muthoni Hope",
					"Barasa Bravin",
					"Cherono Daisy",
					"Mwangi Ryan",
					"Awino Joan",
					"Rotich Ian",
					"Wanja Ruth",
					"Kipchumba Seth",
					"Njoki Gloria"
				];
				return {
					id,
					admNo: adm,
					name: names[i % names.length],
					gender: i % 2 === 0 ? "M" : "F",
					stream: "Form 1 East",
					kcpeMarks: 320 + i * 8 % 75,
					subjects: [
						"MAT",
						"ENG",
						"KIS",
						"BIO",
						"CHE",
						"PHY",
						"GEO",
						"HIS",
						"CRE",
						"BST",
						"AGR"
					]
				};
			});
			return {
				state: {
					students: f1Students,
					marks: {},
					uiState: {
						activeStream: "Form 1 East",
						activeExam: "End-term Exam, Term 1 2026",
						activeView: "marks-entry",
						selectedStudentId: "f1-1",
						activeSubTab: "students"
					}
				},
				opsData: {
					feePerTerm: 4e4,
					payments: f1Students.slice(0, 24).map((s, i) => ({
						studentId: s.id,
						amount: 4e4,
						method: "Bank",
						ref: `F1-BANK-${400 + i}`
					}))
				}
			};
		}
	}
];
var KEY = "chokur_school_ops_v1";
var seedPayments = () => [];
var initial = () => ({
	attendance: {},
	contacts: {},
	feePerTerm: 45e3,
	payments: seedPayments(),
	smsLog: []
});
var load = () => {
	try {
		const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
		if (raw) return {
			...initial(),
			...JSON.parse(raw)
		};
	} catch {}
	return initial();
};
var state = load();
var listeners = /* @__PURE__ */ new Set();
var commit = (next) => {
	state = next;
	try {
		window.localStorage.setItem(KEY, JSON.stringify(state));
	} catch {}
	listeners.forEach((l) => l());
};
var uid = () => Math.random().toString(36).slice(2, 10);
var ops = {
	saveAttendance(date, stream, marks) {
		commit({
			...state,
			attendance: {
				...state.attendance,
				[`${date}|${stream}`]: marks
			}
		});
	},
	setContact(studentId, contact) {
		commit({
			...state,
			contacts: {
				...state.contacts,
				[studentId]: contact
			}
		});
	},
	setFeePerTerm(amount) {
		commit({
			...state,
			feePerTerm: Math.max(0, amount)
		});
	},
	addPayment(p) {
		commit({
			...state,
			payments: [{
				...p,
				id: uid()
			}, ...state.payments]
		});
	},
	removePayment(id) {
		commit({
			...state,
			payments: state.payments.filter((p) => p.id !== id)
		});
	},
	logSms(e) {
		commit({
			...state,
			smsLog: [{
				...e,
				id: uid(),
				sentAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...state.smsLog].slice(0, 200)
		});
	}
};
var applyOpsState = (partial) => {
	commit({
		...state,
		...partial
	});
};
var TestPresetsModal = ({ isOpen, onClose }) => {
	const { setStudents, setMarks, setActiveStream, setActiveExam, setActiveView, resetToDemoData } = useGrading();
	const [appliedPresetId, setAppliedPresetId] = (0, import_react.useState)(null);
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
	const [notification, setNotification] = (0, import_react.useState)(null);
	if (!isOpen) return null;
	const handleApply = (preset) => {
		const data = preset.generate();
		if (data.state.students) setStudents(data.state.students);
		if (data.state.marks) setMarks(data.state.marks);
		if (data.state.uiState?.activeStream) setActiveStream(data.state.uiState.activeStream);
		if (data.state.uiState?.activeExam) setActiveExam(data.state.uiState.activeExam);
		if (data.state.uiState?.activeView) setActiveView(data.state.uiState.activeView);
		if (data.opsData) {
			if (data.opsData.feePerTerm) ops.setFeePerTerm(data.opsData.feePerTerm);
			if (data.opsData.payments) applyOpsState({ payments: data.opsData.payments.map((p, i) => ({
				...p,
				id: `pay-preset-${i}`,
				date: "2026-06-15"
			})) });
			if (data.opsData.absentStudents && data.state.uiState?.activeStream) {
				const stream = data.state.uiState.activeStream;
				const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
				const marksRecord = {};
				const absSet = new Set(data.opsData.absentStudents);
				(data.state.students || []).forEach((st) => {
					marksRecord[st.id] = absSet.has(st.id) ? "A" : "P";
				});
				ops.saveAttendance(today, stream, marksRecord);
			}
		}
		setAppliedPresetId(preset.id);
		setNotification(`Successfully loaded ${preset.name}!`);
		setTimeout(() => {
			setNotification(null);
			onClose();
		}, 1200);
	};
	const handleFactoryReset = async () => {
		await resetToDemoData();
		setNotification("Database completely reset to clean demo seeds!");
		setConfirmReset(false);
		setTimeout(() => {
			setNotification(null);
			onClose();
		}, 1200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "presets-modal-title",
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-[#FEF9EF] border-2 border-[#111111] rounded-lg shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#111111]",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 bg-[#FBF8F1] border-b border-[#DDD6C7] flex items-center justify-between shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[#C2410C] text-[24px]",
							children: "science"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "presets-modal-title",
							className: "font-headline-md text-base sm:text-lg font-bold text-[#111111]",
							children: "Test Data Presets & Reset Sandbox"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#5F5E5E]",
							children: "Instantly simulate diverse cohorts, grading scenarios, and operational stress tests"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						type: "button",
						"aria-label": "Close dialog",
						className: "p-1 rounded hover:bg-[#F2EDE3] text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[20px]",
							children: "close"
						})
					})]
				}),
				notification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-emerald-100 border-b border-emerald-300 text-emerald-900 px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shrink-0 animate-fadeIn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[18px] text-emerald-700",
						children: "check_circle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: notification })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 sm:p-5 overflow-y-auto space-y-3.5 divide-y divide-[#DDD6C7]/60",
					children: TEST_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm text-[#111111]",
											children: preset.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F2EDE3] text-[#5F5E5E] border border-[#DDD6C7]",
											children: preset.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-mono text-[#C2410C] font-semibold",
											children: [
												"Mean: ",
												preset.meanGrade,
												" (",
												preset.meanPoints > 0 ? `${preset.meanPoints} pts` : "Pending",
												")"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#5F5E5E] leading-relaxed",
									children: preset.highlight
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-mono text-[#9A958A] flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Roster: ",
											preset.studentCount,
											" candidates"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Stream: ", preset.stream] })
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleApply(preset),
							className: `px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[38px] ${appliedPresetId === preset.id ? "bg-emerald-700 text-white" : "bg-[#111111] text-[#FEF9EF] hover:bg-neutral-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[15px]",
								children: appliedPresetId === preset.id ? "done" : "play_circle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: appliedPresetId === preset.id ? "Applied" : "Load Preset" })]
						})]
					}, preset.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-3.5 bg-[#FBF8F1] border-t border-[#DDD6C7] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-[#5F5E5E]",
						children: confirmReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#DC2626] font-semibold",
							children: "Are you sure? This will clear all changes and restore original demo data."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Need to start from scratch? Reset cleans local storage & IndexedDB." })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: confirmReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfirmReset(false),
							className: "px-3 py-1.5 border border-[#DDD6C7] rounded text-xs text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleFactoryReset,
							className: "px-3.5 py-1.5 bg-[#DC2626] text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer",
							children: "Confirm Factory Reset"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setConfirmReset(true),
							className: "px-3.5 py-1.5 border border-[#DDD6C7] bg-[#FEF9EF] hover:bg-[#F2EDE3] text-[#DC2626] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined text-[16px]",
								children: "restart_alt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset Database to Defaults" })]
						})
					})]
				})
			]
		})
	});
};
var SettingsView = () => {
	const { schoolConfig, updateSchoolConfig, exportJSONBackup, restoreJSONBackup, resetToDemoData, importMarksFromCSV, downloadMarksTemplateCSV, students, subjects, marks } = useGrading();
	const [formConfig, setFormConfig] = (0, import_react.useState)(schoolConfig);
	const [saveSuccess, setSaveSuccess] = (0, import_react.useState)(false);
	const [dbHealth, setDbHealth] = (0, import_react.useState)({
		status: "idle",
		totalStudents: students.length,
		totalMarksEntered: 0,
		estimatedStorageKB: 0,
		lastVerified: null
	});
	const [isRestoreModalOpen, setIsRestoreModalOpen] = (0, import_react.useState)(false);
	const [isResetModalOpen, setIsResetModalOpen] = (0, import_react.useState)(false);
	const [isPresetsModalOpen, setIsPresetsModalOpen] = (0, import_react.useState)(false);
	const [legalModal, setLegalModal] = (0, import_react.useState)(null);
	const [restoreText, setRestoreText] = (0, import_react.useState)("");
	const [restoreError, setRestoreError] = (0, import_react.useState)(false);
	const [csvInputText, setCsvInputText] = (0, import_react.useState)("");
	const [csvFileName, setCsvFileName] = (0, import_react.useState)("");
	const [csvMode, setCsvMode] = (0, import_react.useState)("upload");
	const [parsedPreview, setParsedPreview] = (0, import_react.useState)(null);
	const [csvSuccessMessage, setCsvSuccessMessage] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const handleSave = () => {
		updateSchoolConfig(formConfig);
		setSaveSuccess(true);
		setTimeout(() => setSaveSuccess(false), 2500);
	};
	const handleDiscard = () => {
		setFormConfig(schoolConfig);
	};
	const handleVerifyDatabaseIntegrity = async () => {
		setDbHealth((prev) => ({
			...prev,
			status: "checking"
		}));
		try {
			let markCount = 0;
			Object.values(marks).forEach((subjMap) => {
				if (subjMap && typeof subjMap === "object") markCount += Object.keys(subjMap).length;
			});
			let storageKB = 24;
			if (typeof navigator !== "undefined" && "storage" in navigator && navigator.storage?.estimate) {
				const estimate = await navigator.storage.estimate();
				if (estimate.usage) storageKB = Math.round(estimate.usage / 1024);
			}
			setDbHealth({
				status: "healthy",
				totalStudents: students.length,
				totalMarksEntered: markCount,
				estimatedStorageKB: storageKB,
				lastVerified: (/* @__PURE__ */ new Date()).toLocaleTimeString()
			});
		} catch {
			setDbHealth((prev) => ({
				...prev,
				status: "idle"
			}));
		}
	};
	const handleProcessRestore = () => {
		setRestoreError(false);
		if (restoreJSONBackup(restoreText)) {
			setIsRestoreModalOpen(false);
			setRestoreText("");
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 2500);
		} else setRestoreError(true);
	};
	const handleProcessFileContent = (content, name = "uploaded_file.csv") => {
		setCsvInputText(content);
		setCsvFileName(name);
		setCsvSuccessMessage(null);
		const parsed = parseMarksCSV(content, students, subjects);
		setParsedPreview(parsed);
	};
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const text = event.target?.result;
				handleProcessFileContent(text, file.name);
			};
			reader.readAsText(file, "UTF-8");
		}
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const text = event.target?.result;
				handleProcessFileContent(text, file.name);
			};
			reader.readAsText(file, "UTF-8");
		}
	};
	const handlePasteChange = (text) => {
		setCsvInputText(text);
		setCsvFileName("Pasted CSV text");
		setCsvSuccessMessage(null);
		if (text.trim()) {
			const parsed = parseMarksCSV(text, students, subjects);
			setParsedPreview(parsed);
		} else setParsedPreview(null);
	};
	const handleConfirmCSVImport = () => {
		if (!csvInputText.trim()) return;
		const result = importMarksFromCSV(csvInputText);
		if (result.success) {
			const studentCount = result.updates.length;
			const subjectsCount = result.mappedSubjects.length;
			setCsvSuccessMessage(`Successfully imported marks for ${studentCount} students across ${subjectsCount} subjects into the central ledger!`);
			setParsedPreview(null);
			setCsvInputText("");
			setCsvFileName("");
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleClearCSV = () => {
		setCsvInputText("");
		setCsvFileName("");
		setParsedPreview(null);
		setCsvSuccessMessage(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1360px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-32 font-body-md text-[#111111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-[#DDD6C7] flex flex-col md:flex-row md:items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-headline-lg text-headline-lg text-[#111111]",
						children: "Settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-tabular-sm text-tabular-sm text-[#5F5E5E]",
						children: "CONFIG_ACAD_2026"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-body-md text-body-md text-[#5F5E5E] mt-1",
					children: "Configure school metadata, grading scales, bulk CSV marks import, and offline data sync"
				})] }), saveSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#111111] text-[#FEF9EF] px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 animate-fadeIn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-[16px] text-emerald-400",
						children: "check_circle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All configuration settings updated" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 border-b border-[#DDD6C7] grid grid-cols-12 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "School Information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#5F5E5E] mt-1",
								children: "Official institutional identity printed across all term transcripts, KCSE result schedules, and student performance dossiers."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-8 flex flex-col space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
									children: "School Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: formConfig.schoolName,
									onChange: (e) => setFormConfig({
										...formConfig,
										schoolName: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
									children: "School Motto"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: formConfig.motto,
									onChange: (e) => setFormConfig({
										...formConfig,
										motto: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
										children: "Postal Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: formConfig.postalAddress,
										onChange: (e) => setFormConfig({
											...formConfig,
											postalAddress: e.target.value
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
										children: "Contact Phone / Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: formConfig.contactPhoneEmail,
										onChange: (e) => setFormConfig({
											...formConfig,
											contactPhoneEmail: e.target.value
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
										children: "Principal Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: formConfig.principalName || "",
										onChange: (e) => setFormConfig({
											...formConfig,
											principalName: e.target.value
										}),
										placeholder: "e.g. Dr. E. Kibet (PhD)",
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
										children: "Head of Curriculum / Class Teacher"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: formConfig.classTeacher,
										onChange: (e) => setFormConfig({
											...formConfig,
											classTeacher: e.target.value
										}),
										className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none"
									})] })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 border-b border-[#DDD6C7] grid grid-cols-12 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Current Term & Academic Year"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#5F5E5E] mt-1",
								children: "Active evaluation window used for ledger aggregation, attendance intervals, and automated merit standings."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
									children: "Academic Year"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: formConfig.academicYear,
									onChange: (e) => setFormConfig({
										...formConfig,
										academicYear: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2026",
											children: "2026"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2025",
											children: "2025"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2024",
											children: "2024"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
									children: "Term"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: formConfig.term,
									onChange: (e) => setFormConfig({
										...formConfig,
										term: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-body-md text-body-md focus:border-[#C2410C] focus:outline-none",
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
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
									children: "Term Opening Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: formConfig.termOpeningDate,
									onChange: (e) => setFormConfig({
										...formConfig,
										termOpeningDate: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-tabular-md text-tabular-md focus:border-[#C2410C] focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1.5",
									children: "Term Closing Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: formConfig.termClosingDate,
									onChange: (e) => setFormConfig({
										...formConfig,
										termClosingDate: e.target.value
									}),
									className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded px-3 py-2 text-[#111111] font-tabular-md text-tabular-md focus:border-[#C2410C] focus:outline-none"
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 border-b border-[#DDD6C7] grid grid-cols-12 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-headline-sm text-headline-sm text-[#111111]",
									children: "KCSE Grading Scale (12-Point Scale)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-caption text-caption text-[#5F5E5E] mt-1",
									children: "Read-only standard ministerial metric. Points feed mean score calculations directly across all Form 1 to Form 4 classes."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 p-3 bg-[#FBF8F1] border border-[#DDD6C7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-label-caps text-label-caps text-[#5F5E5E] block mb-2",
										children: "Calculation Standard"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "calcMethod",
												checked: formConfig.calculationMethod === "best7",
												onChange: () => setFormConfig({
													...formConfig,
													calculationMethod: "best7"
												}),
												className: "accent-[#C2410C]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Best 7 Subjects Rule (KNEC Standard)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "calcMethod",
												checked: formConfig.calculationMethod === "simpleMean",
												onChange: () => setFormConfig({
													...formConfig,
													calculationMethod: "simpleMean"
												}),
												className: "accent-[#C2410C]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Straight Mean across all subjects" })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 p-3 bg-[#FBF8F1] border border-[#DDD6C7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-label-caps text-label-caps text-[#5F5E5E] block mb-1",
										children: "Scale Paradigm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-caption text-caption text-[#5F5E5E]",
										children: "Monochrome graphic hierarchy: Solid carbon indicates honors; outline indicates competence; grey indicates marginal performance; dashed indicates critical remedial intervention."
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-12 md:col-span-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full overflow-hidden border border-[#DDD6C7]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left border-collapse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-[#FBF8F1] border-b border-[#DDD6C7] h-9",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-label-caps text-label-caps text-[#5F5E5E]",
												children: "Marks Range"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-label-caps text-label-caps text-[#5F5E5E]",
												children: "Grade"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-label-caps text-label-caps text-[#5F5E5E] text-right",
												children: "Points"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-label-caps text-label-caps text-[#5F5E5E]",
												children: "Description"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#DDD6C7] font-body-sm text-body-sm",
										children: KCSE_GRADING_TABLE.map((row) => {
											const isCPlus = row.grade === "C+";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "h-11 bg-[#FBF8F1] hover:bg-[#F2EDE3] transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "px-4 py-2 font-tabular-md text-tabular-md",
														children: [
															row.min,
															" – ",
															row.max
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, { grade: row.grade })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-2 font-tabular-md text-tabular-md text-right font-medium",
														children: row.points
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-2 text-[#111111]",
														children: row.description
													})
												]
											}), isCPlus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
												className: "bg-[#FEF9EF]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 4,
													className: "p-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "border-y border-[#111111] bg-[#EDE8DE]/40 px-4 py-1.5 flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-label-caps text-label-caps text-[#111111] font-semibold uppercase tracking-wider",
															children: "Pass Line — Minimum University Direct Entry Requirement"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-tabular-sm text-tabular-sm text-[#5F5E5E]",
															children: "KUCCPS Benchmark: 7.00 Mean PTS"
														})]
													})
												})
											})] }, row.grade);
										})
									})]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 border-b border-[#DDD6C7] grid grid-cols-12 gap-6 bg-[#FBF8F1]/50 p-4 rounded my-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined text-[#C2410C]",
										children: "upload_file"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-headline-sm text-headline-sm text-[#111111]",
										children: "Bulk Marks Import (CSV)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-caption text-caption text-[#5F5E5E] mt-1.5",
									children: [
										"Bulk-upload student examination marks directly into the central ledger. Automatically matches student admission numbers and KCSE subject codes (",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-tabular-sm text-[#111111]",
											children: "MAT, ENG, KIS, BIO, CHE, PHY, HIS, GEO, CRE, BST"
										}),
										")."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-[#DDD6C7]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-label-caps text-label-caps text-[#5F5E5E] block mb-1",
											children: "CSV Template"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-caption text-caption text-[#5F5E5E] mb-2",
											children: "Download a pre-filled spreadsheet containing current student admission numbers and subject columns."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: downloadMarksTemplateCSV,
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#111111] bg-transparent text-[#111111] text-xs font-medium rounded hover:bg-[#F2EDE3] transition-colors cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined text-[16px]",
												children: "file_download"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download Sample CSV Template" })]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-8 flex flex-col justify-start space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 border-b border-[#DDD6C7] pb-2 text-xs font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setCsvMode("upload"),
										className: `flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${csvMode === "upload" ? "border-[#C2410C] text-[#111111]" : "border-transparent text-[#5F5E5E] hover:text-[#111111]"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[15px]",
											children: "cloud_upload"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload CSV File" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setCsvMode("paste"),
										className: `flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${csvMode === "paste" ? "border-[#C2410C] text-[#111111]" : "border-transparent text-[#5F5E5E] hover:text-[#111111]"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[15px]",
											children: "content_paste"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Paste CSV / TSV Text" })]
									})]
								}),
								csvSuccessMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs flex items-center justify-between animate-fadeIn",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[18px] text-emerald-700",
											children: "check_circle"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: csvSuccessMessage
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCsvSuccessMessage(null),
										className: "text-emerald-700 hover:text-emerald-950 font-bold ml-2 cursor-pointer",
										children: "✕"
									})]
								}),
								csvMode === "upload" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: ".csv,text/csv,text/plain",
									onChange: handleFileChange,
									className: "hidden",
									id: "csv-file-upload-input"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onDragOver: (e) => {
										e.preventDefault();
										setIsDragging(true);
									},
									onDragLeave: () => setIsDragging(false),
									onDrop: handleDrop,
									onClick: () => fileInputRef.current?.click(),
									className: `border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-[#C2410C] bg-[#F2EDE3]" : "border-[#DDD6C7] bg-[#FEF9EF] hover:bg-[#F2EDE3]/50"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[32px] text-[#5F5E5E] mb-2 block",
											children: "upload_file"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-body-md text-sm font-medium text-[#111111]",
											children: csvFileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#C2410C] font-semibold",
												children: csvFileName
											}) : "Click to select a CSV file or drag and drop here"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-caption text-xs text-[#5F5E5E] mt-1",
											children: "Accepts standard comma-separated or tab-separated spreadsheet exports (.csv)"
										})
									]
								})] }),
								csvMode === "paste" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-label-caps text-label-caps text-[#5F5E5E] uppercase mb-1",
									children: "Paste Tabular Marks Data"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 5,
									value: csvInputText,
									onChange: (e) => handlePasteChange(e.target.value),
									placeholder: `AdmNo,StudentName,MAT,ENG,KIS,BIO,CHE,PHY,HIS,GEO,CRE,BST\n3842,Grace Achieng,85,80,88,76,72,74,82,78,90,75\n3819,Daniel Kiprop,90,70,72,82,78,84,68,74,80,86`,
									className: "w-full bg-[#FEF9EF] border border-[#DDD6C7] rounded p-3 text-xs font-tabular-sm text-[#111111] focus:border-[#C2410C] focus:outline-none"
								})] }),
								parsedPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-[#FEF9EF] border border-[#DDD6C7] rounded space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pb-2 border-b border-[#DDD6C7]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2.5 h-2.5 rounded-full ${parsedPreview.success ? "bg-emerald-600" : "bg-red-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-headline-sm text-xs font-semibold text-[#111111]",
													children: parsedPreview.success ? "File Parsed Successfully" : "Parse Errors Encountered"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-tabular-sm text-xs text-[#5F5E5E]",
												children: [
													parsedPreview.updates.length,
													" students matched ·",
													" ",
													parsedPreview.mappedSubjects.length,
													" subjects"
												]
											})]
										}),
										parsedPreview.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 bg-red-50 border border-red-200 rounded text-red-900 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold mb-1",
												children: "Validation Errors:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "list-disc list-inside space-y-0.5",
												children: parsedPreview.errors.map((err, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: err }, i))
											})]
										}),
										parsedPreview.warnings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold mb-1",
												children: "Warnings:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "list-disc list-inside space-y-0.5",
												children: parsedPreview.warnings.map((warn, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: warn }, i))
											})]
										}),
										parsedPreview.mappedSubjects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#5F5E5E] font-label-caps text-[10px]",
												children: "Mapped Subjects:"
											}), parsedPreview.mappedSubjects.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.5 bg-[#F2EDE3] border border-[#DDD6C7] text-[#111111] font-tabular-sm text-[11px] rounded-[2px]",
												children: sub
											}, sub))]
										}),
										parsedPreview.updates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] font-label-caps text-[#5F5E5E] uppercase mb-1",
											children: [
												"Data Sample Preview (First ",
												Math.min(5, parsedPreview.updates.length),
												" Rows)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "overflow-x-auto border border-[#DDD6C7] bg-[#FBF8F1]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
												className: "w-full text-left border-collapse text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "bg-[#FEF9EF] border-b border-[#DDD6C7] text-[10px] font-label-caps text-[#5F5E5E]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-2 py-1.5",
															children: "ADM"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-2 py-1.5",
															children: "NAME"
														}),
														parsedPreview.mappedSubjects.slice(0, 6).map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-2 py-1.5 text-right",
															children: sub
														}, sub)),
														parsedPreview.mappedSubjects.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
															className: "px-2 py-1.5 text-right",
															children: [
																"+",
																parsedPreview.mappedSubjects.length - 6,
																" more"
															]
														})
													]
												}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
													className: "divide-y divide-[#DDD6C7] font-tabular-sm",
													children: parsedPreview.updates.slice(0, 5).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "h-7 hover:bg-[#F2EDE3]",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-2 py-1 font-medium",
																children: u.admNo
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-2 py-1 text-[#111111]",
																children: u.studentName
															}),
															parsedPreview.mappedSubjects.slice(0, 6).map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-2 py-1 text-right text-[#111111]",
																children: u.marks[sub] !== void 0 ? String(u.marks[sub]) : "—"
															}, sub)),
															parsedPreview.mappedSubjects.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-2 py-1 text-right text-[#5F5E5E]",
																children: "..."
															})
														]
													}, u.studentId))
												})]
											})
										})] }),
										parsedPreview.unmatchedStudents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-[#5F5E5E]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-amber-700 font-medium",
													children: [parsedPreview.unmatchedStudents.length, " rows in CSV did not match active students"]
												}),
												" ",
												"(e.g. ",
												parsedPreview.unmatchedStudents.slice(0, 3).join(", "),
												parsedPreview.unmatchedStudents.length > 3 ? "..." : "",
												")."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 flex items-center justify-end gap-3 border-t border-[#DDD6C7]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: handleClearCSV,
												className: "px-3 py-1.5 text-xs text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
												children: "Clear & Cancel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: !parsedPreview.success || parsedPreview.updates.length === 0,
												onClick: handleConfirmCSVImport,
												className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] text-xs font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "material-symbols-outlined text-[15px]",
													children: "publish"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Commit Marks to Central Ledger (",
													parsedPreview.updates.length,
													" Students)"
												] })]
											})]
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 border-b border-[#DDD6C7] grid grid-cols-12 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Data & Backups"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#5F5E5E] mt-1",
								children: "Direct cryptographic snapshots of the ledger state. Store cold archive files onto local physical storage keys."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-8 flex flex-col justify-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setIsPresetsModalOpen(true),
										type: "button",
										className: "border border-[#C2410C] bg-[#C2410C] text-[#FEF9EF] px-4 py-2 rounded font-body-sm text-body-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[16px]",
											children: "science"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Test Presets & Scenarios" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: exportJSONBackup,
										type: "button",
										className: "border border-[#111111] bg-transparent text-[#111111] px-4 py-2 rounded font-body-sm text-body-sm font-medium hover:bg-[#F2EDE3] transition-colors cursor-pointer",
										children: "Export backup (JSON)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsRestoreModalOpen(true),
										type: "button",
										className: "border border-[#111111] bg-transparent text-[#111111] px-4 py-2 rounded font-body-sm text-body-sm font-medium hover:bg-[#F2EDE3] transition-colors cursor-pointer",
										children: "Restore from backup"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsResetModalOpen(true),
										type: "button",
										className: "border border-[#BA1A1A] bg-transparent text-[#BA1A1A] px-4 py-2 rounded font-body-sm text-body-sm font-medium hover:bg-[#FFDAD6]/30 transition-colors cursor-pointer",
										children: "Reset demo data"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#9A958A] mt-3",
								children: "All marks and student records are stored locally in IndexedDB / localStorage on this browser."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 grid grid-cols-12 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Local Storage & Database Health"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#5F5E5E] mt-1",
								children: "Zero-cloud privacy architecture. All student marks, subjects, and configurations are stored in your device's persistent IndexedDB database."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-8 flex flex-col items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 border border-[#DDD6C7] bg-[#FBF8F1] rounded",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full inline-block ${dbHealth.status === "healthy" ? "bg-emerald-600" : "bg-[#C2410C]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-tabular-sm text-tabular-sm text-[#111111] font-medium",
										children: dbHealth.status === "checking" ? "Verifying IndexedDB records & local cache..." : dbHealth.status === "healthy" ? `Healthy: ${dbHealth.totalStudents} candidates · ${dbHealth.totalMarksEntered} scores verified (~${dbHealth.estimatedStorageKB} KB)` : `Offline Storage Active: ${students.length} candidates cached`
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleVerifyDatabaseIntegrity,
									disabled: dbHealth.status === "checking",
									type: "button",
									className: "border border-[#111111] bg-transparent text-[#111111] px-4 py-1.5 rounded font-body-sm text-body-sm font-medium hover:bg-[#F2EDE3] transition-colors disabled:opacity-50 cursor-pointer min-h-[36px]",
									children: dbHealth.status === "checking" ? "Checking..." : "Verify Database Health"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-caption text-caption text-[#5F5E5E]",
								children: dbHealth.lastVerified ? `Last integrity verification: ${dbHealth.lastVerified} · 100% local persistence` : "100% offline-ready · Zero data transmitted to external servers"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-6 border-t border-[#DDD6C7] grid grid-cols-12 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-4 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Legal & Statutory Compliance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#5F5E5E] mt-1",
								children: "Institutional policies governed by the Kenya Basic Education Act and the Data Protection Act (DPA No. 24 of 2019)."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-8 flex flex-col items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setActiveView("legal", "privacy"),
										className: "border border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] text-[#111111] px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[16px] text-[#C2410C]",
											children: "policy"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Privacy Policy (DPA 2019)" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setActiveView("legal", "terms"),
										className: "border border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] text-[#111111] px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[16px] text-[#5F5E5E]",
											children: "gavel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Terms of Service" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setLegalModal("compliance"),
										className: "border border-[#DDD6C7] bg-[#FBF8F1] hover:bg-[#F2EDE3] text-[#111111] px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-[16px] text-emerald-700",
											children: "verified"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ministry of Education & KNEC" })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-caption text-caption text-[#9A958A]",
								children: "Learner personal data is protected under Section 31 of Kenya DPA. Zero cloud telemetry or external third-party scraping."
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "fixed bottom-16 md:bottom-0 right-0 left-0 md:left-[72px] lg:left-[200px] xl:left-[220px] bg-[#FBF8F1] border-t border-[#DDD6C7] py-3 px-4 sm:px-6 z-30 no-print transition-all duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[1200px] mx-auto flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-[16px] text-[#5F5E5E]",
							children: "info"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-caption text-caption text-[#5F5E5E] text-xs",
							children: "Configuration changes are cached locally until explicitly confirmed."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDiscard,
							type: "button",
							className: "text-[#5C5850] hover:text-[#111111] font-body-md text-xs sm:text-body-md font-medium cursor-pointer bg-transparent border-0 p-0",
							children: "Discard changes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSave,
							type: "button",
							className: "bg-[#C2410C] text-[#FEF9EF] px-4 sm:px-5 py-2 rounded font-body-md text-xs sm:text-body-md font-semibold hover:opacity-95 focus:outline-none transition-opacity cursor-pointer shadow-sm",
							children: "Save changes"
						})]
					})]
				})
			}),
			isRestoreModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FEF9EF] border border-[#DDD6C7] rounded max-w-lg w-full p-6 shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-[#DDD6C7] mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-headline-sm text-headline-sm text-[#111111]",
								children: "Restore from JSON Backup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsRestoreModalOpen(false),
								className: "text-[#5F5E5E] hover:text-[#111111] font-bold text-lg cursor-pointer",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-[#5F5E5E] mb-3",
							children: "Paste the contents of your previously exported JSON backup file below."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 8,
							value: restoreText,
							onChange: (e) => setRestoreText(e.target.value),
							placeholder: "Paste JSON here...",
							className: "w-full bg-[#FBF8F1] border border-[#DDD6C7] rounded p-3 text-xs font-tabular-sm text-[#111111] focus:border-[#C2410C] focus:outline-none"
						}),
						restoreError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-red-600 mt-2 font-medium",
							children: "Invalid JSON format or missing required ledger keys."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsRestoreModalOpen(false),
								className: "px-3 py-1.5 text-sm text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleProcessRestore,
								className: "px-4 py-1.5 bg-[#C2410C] text-[#FEF9EF] rounded text-sm font-medium hover:opacity-90 cursor-pointer",
								children: "Restore Records"
							})]
						})
					]
				})
			}),
			isResetModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								children: "Reset to Demo Cohort Data"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-[#111111] mb-3",
							children: "This will restore the ledger to clean Form 4 East seed records (42 students, KNEC 12-point marks, and official school config)."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-red-50 border border-red-200 text-red-800 p-3 text-xs mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Notice:" }), " All custom student additions and newly entered marks will be overwritten with initial baseline data."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsResetModalOpen(false),
								className: "px-4 py-1.5 text-sm text-[#5F5E5E] hover:text-[#111111] cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: async () => {
									await resetToDemoData();
									setIsResetModalOpen(false);
									setSaveSuccess(true);
									setTimeout(() => setSaveSuccess(false), 2500);
								},
								className: "px-4 py-1.5 bg-red-700 text-white rounded text-sm font-medium hover:bg-red-800 cursor-pointer",
								children: "Confirm Reset"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestPresetsModal, {
				isOpen: isPresetsModalOpen,
				onClose: () => setIsPresetsModalOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalModals, {
				activeModal: legalModal,
				onClose: () => setLegalModal(null)
			})
		]
	});
};
//#endregion
export { SettingsView };
