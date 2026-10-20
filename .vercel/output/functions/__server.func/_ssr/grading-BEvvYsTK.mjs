//#region node_modules/.nitro/vite/services/ssr/assets/grading-BEvvYsTK.js
var KCSE_GRADING_TABLE = [
	{
		min: 80,
		max: 100,
		grade: "A",
		points: 12,
		tier: "honors",
		description: "Excellent"
	},
	{
		min: 75,
		max: 79,
		grade: "A-",
		points: 11,
		tier: "honors",
		description: "Very Good"
	},
	{
		min: 70,
		max: 74,
		grade: "B+",
		points: 10,
		tier: "honors",
		description: "Good"
	},
	{
		min: 65,
		max: 69,
		grade: "B",
		points: 9,
		tier: "competent",
		description: "Above Average"
	},
	{
		min: 60,
		max: 64,
		grade: "B-",
		points: 8,
		tier: "competent",
		description: "Average"
	},
	{
		min: 55,
		max: 59,
		grade: "C+",
		points: 7,
		tier: "competent",
		description: "Competent (University Cutoff)"
	},
	{
		min: 50,
		max: 54,
		grade: "C",
		points: 6,
		tier: "marginal",
		description: "Satisfactory"
	},
	{
		min: 45,
		max: 49,
		grade: "C-",
		points: 5,
		tier: "marginal",
		description: "Below Average"
	},
	{
		min: 40,
		max: 44,
		grade: "D+",
		points: 4,
		tier: "marginal",
		description: "Weak"
	},
	{
		min: 35,
		max: 39,
		grade: "D",
		points: 3,
		tier: "critical",
		description: "Poor"
	},
	{
		min: 30,
		max: 34,
		grade: "D-",
		points: 2,
		tier: "critical",
		description: "Very Poor"
	},
	{
		min: 0,
		max: 29,
		grade: "E",
		points: 1,
		tier: "critical",
		description: "Critical / Fail"
	}
];
/**
* Validate and clean a mark input value.
* Accepts: numbers 0-100, 'ABS', or null/undefined.
* Rejects: letters other than ABS, negative numbers, >100.
*/
function sanitizeMarkInput(input) {
	if (input === null || input === void 0 || input === "") return null;
	if (typeof input === "string") {
		const trimmed = input.trim().toUpperCase();
		if (trimmed === "ABS" || trimmed === "ABSENT" || trimmed === "A") return "ABS";
		if (trimmed === "" || trimmed === "-" || trimmed === "—") return null;
		const num = Number(trimmed);
		if (isNaN(num)) return null;
		return Math.max(0, Math.min(100, Math.round(num)));
	}
	if (typeof input === "number") {
		if (isNaN(input)) return null;
		return Math.max(0, Math.min(100, Math.round(input)));
	}
	return null;
}
/**
* Converts a subject score to KCSE Grade and Points.
* Null means not entered; 'ABS' means absent.
*/
function getGradeFromScore(score) {
	if (score === null || score === void 0) return {
		grade: "E",
		points: 0,
		tier: "critical",
		description: "Not Entered"
	};
	if (score === "ABS") return {
		grade: "E",
		points: 0,
		tier: "critical",
		description: "Absent"
	};
	const num = Math.round(Number(score));
	const clamped = Math.max(0, Math.min(100, num));
	for (const item of KCSE_GRADING_TABLE) if (clamped >= item.min && clamped <= item.max) return {
		grade: item.grade,
		points: item.points,
		tier: item.tier,
		description: item.description
	};
	return {
		grade: "E",
		points: 1,
		tier: "critical",
		description: "Critical / Fail"
	};
}
/**
* Neutralize formula injection characters (=, +, -, @) to prevent CSV injection vulnerability
*/
function sanitizeCSVCell(value) {
	if (value === null || value === void 0) return "";
	let str = String(value);
	if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
	return `"${str.replace(/"/g, "\"\"")}"`;
}
/**
* Export tabular data to CSV with UTF-8 BOM for Microsoft Excel compatibility
*/
function exportTableToCSV(filename, headers, rows) {
	const csvContent = "﻿" + [headers.map(sanitizeCSVCell).join(","), ...rows.map((row) => row.map(sanitizeCSVCell).join(","))].join("\r\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", `${filename}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
function parseCSVLine(line, delimiter = ",") {
	const result = [];
	let current = "";
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === "\"") if (inQuotes && line[i + 1] === "\"") {
			current += "\"";
			i++;
		} else inQuotes = !inQuotes;
		else if (char === delimiter && !inQuotes) {
			result.push(current.trim());
			current = "";
		} else current += char;
	}
	result.push(current.trim());
	return result;
}
/**
* Robust CSV parser for marks upload
* Handles BOM, CRLF, quoted commas, tab delimiters, and formula injection neutralisation
*/
function parseMarksCSV(csvContent, students, subjects) {
	const errors = [];
	const warnings = [];
	const rawLines = csvContent.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim().length > 0);
	if (rawLines.length < 2) return {
		success: false,
		updates: [],
		mappedSubjects: [],
		unmatchedStudents: [],
		totalRows: 0,
		warnings,
		errors: ["The CSV file is empty or missing headers and data rows."]
	};
	const firstLine = rawLines[0];
	let delimiter = ",";
	if (firstLine.includes("	")) delimiter = "	";
	else if (firstLine.includes(";") && !firstLine.includes(",")) delimiter = ";";
	const headerCells = parseCSVLine(firstLine, delimiter).map((h) => h.trim());
	let admColIdx = -1;
	let nameColIdx = -1;
	const subjectColMap = [];
	headerCells.forEach((header, idx) => {
		const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (normalized === "adm" || normalized === "admno" || normalized === "admission" || normalized === "admissionno" || normalized === "admnumber" || normalized === "regno" || normalized === "studentid") {
			admColIdx = idx;
			return;
		}
		if (normalized === "name" || normalized === "studentname" || normalized === "fullname" || normalized === "student") {
			nameColIdx = idx;
			return;
		}
		const matchedSubject = subjects.find((s) => s.code.toLowerCase() === header.toLowerCase().trim() || s.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized);
		if (matchedSubject) subjectColMap.push({
			colIdx: idx,
			subjectCode: matchedSubject.code
		});
	});
	if (admColIdx === -1) if (headerCells.length > 0 && !subjectColMap.some((m) => m.colIdx === 0)) {
		admColIdx = 0;
		warnings.push(`Assuming first column ("${headerCells[0]}") contains Admission Numbers.`);
	} else errors.push("Could not detect an Admission Number column (\"AdmNo\", \"Admission\", etc.).");
	if (subjectColMap.length === 0) errors.push("No recognized KCSE subjects detected in headers (e.g. MAT, ENG, KIS, BIO, CHE).");
	if (errors.length > 0) return {
		success: false,
		updates: [],
		mappedSubjects: [],
		unmatchedStudents: [],
		totalRows: rawLines.length - 1,
		warnings,
		errors
	};
	const updates = [];
	const unmatchedStudents = [];
	for (let r = 1; r < rawLines.length; r++) {
		const rowCells = parseCSVLine(rawLines[r], delimiter);
		if (rowCells.length === 0 || rowCells.every((c) => c === "")) continue;
		const admVal = admColIdx >= 0 && admColIdx < rowCells.length ? rowCells[admColIdx].trim() : "";
		const nameVal = nameColIdx >= 0 && nameColIdx < rowCells.length ? rowCells[nameColIdx].trim() : "";
		if (!admVal && !nameVal) continue;
		const matchedStudent = students.find((s) => {
			if (admVal && s.admNo.toLowerCase() === admVal.toLowerCase()) return true;
			if (nameVal && s.name.toLowerCase() === nameVal.toLowerCase()) return true;
			return false;
		});
		if (!matchedStudent) {
			unmatchedStudents.push(admVal ? `Adm: ${admVal} (${nameVal || "No name"})` : nameVal);
			continue;
		}
		const studentMarks = {};
		subjectColMap.forEach(({ colIdx, subjectCode }) => {
			if (colIdx < rowCells.length) {
				const rawCell = rowCells[colIdx].trim();
				const upper = rawCell.toUpperCase();
				if (upper === "ABS" || upper === "ABSENT" || upper === "A") studentMarks[subjectCode] = "ABS";
				else if (rawCell === "" || rawCell === "-" || rawCell === "—") {} else {
					const num = Number(rawCell);
					if (!isNaN(num)) studentMarks[subjectCode] = Math.max(0, Math.min(100, Math.round(num)));
				}
			}
		});
		updates.push({
			studentId: matchedStudent.id,
			studentName: matchedStudent.name,
			admNo: matchedStudent.admNo,
			marks: studentMarks
		});
	}
	return {
		success: updates.length > 0,
		updates,
		mappedSubjects: subjectColMap.map((m) => m.subjectCode),
		unmatchedStudents,
		totalRows: rawLines.length - 1,
		warnings,
		errors
	};
}
//#endregion
export { sanitizeMarkInput as a, parseMarksCSV as i, exportTableToCSV as n, getGradeFromScore as r, KCSE_GRADING_TABLE as t };
