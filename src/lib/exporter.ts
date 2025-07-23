
'use client';

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

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the temporary anchor and revoking the URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
