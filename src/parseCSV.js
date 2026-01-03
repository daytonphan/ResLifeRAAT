function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);

  // Parse header line
  const headers = parseCSVLine(lines[0]).map(h =>
    h.replace(/^"|"$/g, "").trim()
  );

  // Parse data rows
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, i) => {
      row[header] = values[i]?.replace(/^"|"$/g, "") ?? "";
    });

    return row;
  });
}

// Handles quoted CSV fields properly
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    throw new Error(`Invalid date/time: ${dateStr} ${timeStr}`);
  }

  const date = new Date(`${dateStr} ${timeStr}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Failed to parse date: ${dateStr} ${timeStr}`);
  }

  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  ];
}

export { parseCSV, parseDateTime };
