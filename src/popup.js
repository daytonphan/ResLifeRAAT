import { parseCSV } from "./parseCSV.js";
import { generateICS, downloadICS } from "./icsGenerator.js";

document.addEventListener('DOMContentLoaded', () => {
	const fileInput = document.getElementById('csvFileInput');
	const convertBtn = document.getElementById('convertButton');

	if (!convertBtn || !fileInput) return;

	// hide convert button until a file is selected
	try { convertBtn.style.display = 'none'; } catch (e) {}

	fileInput.addEventListener('change', () => {
		const hasFile = fileInput.files && fileInput.files.length > 0;
		convertBtn.style.display = hasFile ? '' : 'none';
	});

	convertBtn.addEventListener('click', async () => {
		const file = fileInput.files && fileInput.files[0];
		if (!file) {
			alert('Please select a CSV file first.');
			return;
		}

		try {
			const csvText = await file.text();
			const rows = await parseCSV(csvText);
			const icsText = generateICS(rows);
			// use helper in icsGenerator to trigger download
			if (typeof downloadICS === 'function') {
				downloadICS(icsText);
			} else {
				// fallback: create blob and download
				const blob = new Blob([icsText], { type: 'text/calendar' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'roompact-duty-schedule.ics';
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			}
			console.log('✅ test-output.ics generated');
		} catch (err) {
			console.error('Error converting CSV:', err);
			alert('Failed to convert CSV. See console for details.');
		}
	});
});
