import Papa from "papaparse";

function parseCSV(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject
    });
  });
}

function parseDateTime(dateStr, timeStr) {
  const date = new Date(`${dateStr} ${timeStr}`);
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  ];
}

export { parseCSV, parseDateTime };