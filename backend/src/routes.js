const express = require("express");
const { getFileContent, getFilesList } = require("./services/externalApi.js");
const { parseCSV } = require("./services/csvParser.js");

const router = express.Router();

router.get("/files/data", async (req, res) => {
  try {
    const { fileName } = req.query;
    const filesList = await getFilesList();

    // Check if there was an error in getFilesList
    if (filesList instanceof Error) {
      return res.status(500).json({
        error: "Failed to fetch files list",
        message: filesList.message,
      });
    }

    if (filesList.length === 0) {
      return res.json([]);
    }

    // If fileName is specified, filter to only process that file
    let filesToProcess = filesList;
    if (fileName) {
      // Check if the specified file exists in the list
      if (!filesList.includes(fileName)) {
        return res.status(404).json({
          error: "File not found",
          message: `File "${fileName}" not found in available files`,
          availableFiles: filesList,
        });
      }
      filesToProcess = [fileName];
    }

    const processedFiles = [];

    for (const filename of filesToProcess) {
      const csvContent = await getFileContent(filename);

      if (csvContent !== null) {
        const validLines = parseCSV(csvContent, filename);

        processedFiles.push({
          file: filename,
          lines: validLines,
        });
      }
    }

    res.json(processedFiles);
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

router.get("/files/list", async (req, res) => {
  try {
    const filesList = await getFilesList();

    // Check if there was an error in getFilesList
    if (filesList instanceof Error) {
      return res.status(500).json({
        error: "Failed to fetch files list",
        message: filesList.message,
      });
    }

    res.json(filesList);
  } catch (error) {
    console.error("Error fetching files list:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
