function validHex(hex) {
  return typeof hex === "string" && /^[0-9A-Fa-f]{32}$/.test(hex.trim());
}

// Challenge say to disregard line if there are any errors, but not empty files or field errors.
function parseCSV(csvContent, filename) {
  if (!csvContent || csvContent.trim() === "") return [];

  const lines = csvContent.split("\n");
  const validLines = [];

  const dataLines = lines;

  for (const line of dataLines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") continue;

    const columns = trimmedLine.split(",");

    if (columns.length === 4) {
      const [file, text, numberStr, hex] = columns;

      // Opcional Validation: verify that the 'file' field matches the filename
      if (file.trim() !== filename) continue;

      const number = parseInt(numberStr, 10);
      if (!isNaN(number) && validHex(hex)) {
        validLines.push({
          text: text.trim(),
          number,
          hex: hex.trim(),
        });
      }
    }
  }

  return validLines;
}

module.exports = { parseCSV };
