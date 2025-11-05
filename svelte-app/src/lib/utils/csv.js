/**
 * Generate CSV string from data and metadata
 * @param {Array<Array<number>>} data - 2D array of data
 * @param {Array<string>} columns - Column headers
 * @param {Object} metadata - Metadata object
 * @returns {string} - CSV formatted string
 */
export function generateCSV(data, columns = [], metadata = {}) {
	let csv = '';

	// Write column headers if provided
	if (columns.length > 0) {
		csv += columns.join(',') + '\n';
	}

	// Write data rows
	for (const row of data) {
		if (Array.isArray(row)) {
			csv += row.join(',') + '\n';
		} else {
			csv += row + '\n';
		}
	}

	// Write metadata as comments
	for (const [key, value] of Object.entries(metadata)) {
		let formattedKey = key.replace(/_/g, ' ');
		formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
		csv += `# ${formattedKey} = ${value}\n`;
	}

	return csv;
}

/**
 * Trigger download of CSV file
 * @param {string} content - CSV content
 * @param {string} filename - Name of file to download
 */
export function downloadCSV(content, filename) {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');

	const url = URL.createObjectURL(blob);
	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Clean up the URL object
	setTimeout(() => URL.revokeObjectURL(url), 100);
}
