//this file is for testing the csvParse and icsGenerator modules locally using src/testdata/sample.csv

import fs from "fs";
import { parseCSV } from "./parseCSV.js";
import { generateICS } from "./icsGenerator.js";

const csvText = fs.readFileSync("src/testdata/sample.csv", "utf8");

const rows = await parseCSV(csvText);

const icsText = generateICS(rows);

fs.writeFileSync("test-output.ics", icsText);

console.log("✅ test-output.ics generated");
