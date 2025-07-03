const { config } = require("../config.js");
const fetch = require("node-fetch");

async function getFilesList() {
  try {
    const res = await fetch(`${config.EXTERNAL_API_BASE}/v1/secret/files`, {
      headers: { authorization: config.API_KEY },
    });

    if (!res.ok) throw new Error(`Error fetching files: ${res.status}`);
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error("getFilesList error:", err.message);
    return err;
  }
}

async function getFileContent(fileName) {
  try {
    const res = await fetch(
      `${config.EXTERNAL_API_BASE}/v1/secret/file/${fileName}`,
      {
        headers: { authorization: config.API_KEY },
      },
    );

    if (!res.ok) throw new Error(`Error fetching ${fileName}: ${res.status}`);
    const csvContent = await res.text();
    return csvContent;
  } catch (err) {
    console.error(`getFileContent(${fileName}) error:`, err.message);
    return null;
  }
}

module.exports = { getFilesList, getFileContent };
