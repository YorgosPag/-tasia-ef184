
'use client';

/**
 * Converts an array of objects to a CSV string.
 * Uses a semicolon (;) as a delimiter for better compatibility with Greek Excel.
 * @param data The array of data to convert.
 * @returns A string in CSV format.
 */
function convertToCsv<T extends object>(data: T[]): string {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => {
      const value = (obj as any)[header];
      // Handle null/undefined, escape quotes, and wrap in quotes if necessary
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Escape double quotes by doubling them
      const escapedValue = stringValue.replace(/"/g, '""');
      // Wrap in quotes if it contains commas, semicolons, newlines, or quotes
      if (/[",;\n]/.test(escapedValue)) {
        return `"${escapedValue}"`;
      }
      return escapedValue;
    }).join(';')
  );
  return [headers.join(';'), ...rows].join('\n');
};

/**
 * Triggers a file download in the browser.
 * @param blob The Blob object to download.
 * @param filename The desired name of the file.
 */
function triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


/**
 * Exports an array of objects to a JSON file and triggers a download.
 * @param data The array of data to export.
 * @param fileName The desired name of the file, without the extension.
 */
export function exportToJson<T>(data: T[], fileName: string): void {
  if (!data || data.length === 0) {
    console.warn('Export aborted: No data provided.');
    return;
  }

  // Convert the data to a JSON string
  const jsonString = JSON.stringify(data, (key, value) => {
    // Custom replacer to handle special Firebase types if necessary
    if (value && typeof value === 'object' && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')) {
      // Convert Firestore Timestamp to ISO string
      return new Date(value.seconds * 1000 + value.nanoseconds / 1000000).toISOString();
    }
    return value;
  }, 2); // The '2' argument formats the JSON with an indent of 2 spaces for readability

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });
  triggerDownload(blob, `${fileName}.json`);
}


/**
 * Exports an array of objects to a CSV file and triggers a download.
 * @param data The array of data to export.
 * @param fileName The desired name of the file, without the extension.
 */
export function exportToCsv<T extends object>(data: T[], fileName: string): void {
    if (!data || data.length === 0) {
        console.warn('Export to CSV aborted: No data provided.');
        return;
    }
    const csvString = convertToCsv(data);
    // Add BOM for Excel to recognize UTF-8 encoding correctly
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${fileName}.csv`);
}
