const fileInput = document.getElementById("csvFileInput");

document.getElementById("convertButton").addEventListener("click", async () => {
    const file = fileInput.files[0];

    if (!file) {
        alert("Please choose a CSV file.")
        return;
    }

    const rows = await parseCSV(file);
    
    const icsText = generateICS(rows);

    downloadICS(icsText)
    
    console.log("✅ ics file downloaded");
});

// helper functions from parseCSV and icsGenerator

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

function generateICS(rows) { // edited from icsGenerator.js, does not use ics library
  // Helper to format date/time for ICS: YYYYMMDDTHHMMSS
  function formatDateTime(dateStr, timeStr) {
    const [year, month, day] = dateStr.split("-");
    const [hour, minute] = timeStr.split(":");
    return `${year}${month}${day}T${hour}${minute}00`;
  }

  function getUID(index) {
    return `${Date.now()}-${index}@raat`;
  }

  let icsContent =
    "BEGIN:VCALENDAR\r\n" +
    "VERSION:2.0\r\n" +
    "CALSCALE:GREGORIAN\r\n" +
    "PRODID:-//UC Berkeley RAAT//EN\r\n";

  rows.forEach((row, index) => {
    const start = formatDateTime(row["Start Date"], row["Start Time"]);
    const end = formatDateTime(row["End Date"], row["End Time"]);

    const description = `
RA on Duty
${row["First Name"]} ${row["Last Name"]}
${row["Email"]}
Hours: ${row["Hours"]}
    `.trim().replace(/\n/g, "\\n"); // escape newlines for ICS

    icsContent +=
      "BEGIN:VEVENT\r\n" +
      `UID:${getUID(index)}\r\n` +
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\r\n` +
      `DTSTART:${start}\r\n` +
      `DTEND:${end}\r\n` +
      `SUMMARY:RA Duty – ${row["Shift Region"]}\r\n` +
      `LOCATION:${row["Shift Region"]}\r\n` +
      `DESCRIPTION:${description}\r\n` +
      "END:VEVENT\r\n";
  });

  icsContent += "END:VCALENDAR";

  return icsContent;
}

function downloadICS(content) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.ics";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}