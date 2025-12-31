import { parseDateTime } from "./parseCSV.js";

export function generateICS(rows) {
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`;

  rows.forEach(row => {
    const start = formatICS(parseDateTime(row["Start Date"], row["Start Time"]));
    const end = formatICS(parseDateTime(row["End Date"], row["End Time"]));

    ics += `BEGIN:VEVENT
SUMMARY:RA Duty – ${row["Shift Region"]}
DTSTART:${start}
DTEND:${end}
LOCATION:${row["Shift Region"]}
DESCRIPTION:You are the RA on Duty tonight. Better pick up the phone on time...\\n${row["First Name"]} ${row["Last Name"]}\\n${row["Email"]}\\nHours: ${row["Hours"]}
END:VEVENT
`;
  });

  ics += "END:VCALENDAR";
  return ics;
}

function formatICS([y, m, d, h, min]) {
  return `${y}${String(m).padStart(2,"0")}${String(d).padStart(2,"0")}T${String(h).padStart(2,"0")}${String(min).padStart(2,"0")}00`;
}

export function downloadICS(text) {
  const blob = new Blob([text], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roompact-duty-schedule.ics";
  a.click();
  URL.revokeObjectURL(url);
}
