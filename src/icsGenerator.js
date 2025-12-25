import { createEvents } from "ics";
import { parseDateTime } from "./parseCSV.js";

export function generateICS(rows) {
  const events = rows.map(row => ({
    title: `RA Duty – ${row["Shift Region"]}`,
    start: parseDateTime(row["Start Date"], row["Start Time"]),
    end: parseDateTime(row["End Date"], row["End Time"]),
    location: row["Shift Region"],
    description: `
RA on Duty
${row["First Name"]} ${row["Last Name"]}
${row["Email"]}
Hours: ${row["Hours"]}
    `.trim()
  }));

  const { value } = createEvents(events);
  return value;
}

export function downloadICS(icsText) {
  const blob = new Blob([icsText], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "roompact-duty-schedule.ics";
  a.click();

  URL.revokeObjectURL(url);
}