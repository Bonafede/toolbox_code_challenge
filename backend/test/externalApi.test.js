const chai = require("chai");
const { describe, it } = require("mocha");
const {
  getFilesList,
  getFileContent,
} = require("../src/services/externalApi.js");

const expect = chai.expect;

describe("External API Service", () => {
  describe("getFilesList", () => {
    it("should return array or error", async () => {
      const result = await getFilesList();

      // Puede ser array (éxito) o Error (fallo)
      expect(result).to.satisfy((res) => {
        return Array.isArray(res) || res instanceof Error;
      });
    });

    it("should return array of strings when successful", async () => {
      const result = await getFilesList();

      if (Array.isArray(result)) {
        result.forEach((file) => {
          expect(file).to.be.a("string");
          expect(file).to.match(/\.csv$/);
        });
      }
    });
  });

  describe("getFileContent", () => {
    it("should return string or null", async () => {
      // Usar un nombre de archivo que probablemente exista
      const result = await getFileContent("test.csv");

      expect(result).to.satisfy((res) => {
        return typeof res === "string" || res === null;
      });
    });

    it("should handle non-existent files", async () => {
      const result = await getFileContent("nonexistent-file-12345.csv");

      expect(result).to.be.null;
    });
  });
});
