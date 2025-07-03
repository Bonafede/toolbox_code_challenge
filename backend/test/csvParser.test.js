const { describe, it } = require("mocha");
const chai = require("chai");
const { parseCSV } = require("../src/services/csvParser.js");

const { expect } = chai;

describe("CSV Parser Unit Tests", function () {
  describe("parseCSV function", function () {
    it("should parse valid CSV content", function () {
      const csvContent =
        "file,text,number,hex\ntest.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765";
      const result = parseCSV(csvContent, "test.csv");

      expect(result).to.be.an("array");
      expect(result).to.have.length(1);
      expect(result[0]).to.deep.equal({
        text: "RgTya",
        number: 64075909,
        hex: "70ad29aacf0b690b0467fe2b2767f765",
      });
    });

    it("should handle empty or null input", function () {
      expect(parseCSV("", "test.csv")).to.deep.equal([]);
      expect(parseCSV(null, "test.csv")).to.deep.equal([]);
      expect(parseCSV(undefined, "test.csv")).to.deep.equal([]);
    });

    it("should skip lines with invalid data", function () {
      const csvContent =
        "file,text,number,hex\ntest.csv,invalid,notNumber,invalidHex\ntest.csv,valid,123,70ad29aacf0b690b0467fe2b2767f765";
      const result = parseCSV(csvContent, "test.csv");

      expect(result).to.have.length(1);
      expect(result[0].text).to.equal("valid");
      expect(result[0].number).to.equal(123);
    });

    it("should validate hex format strictly", function () {
      const validHex = "70ad29aacf0b690b0467fe2b2767f765";
      const invalidHex1 = "70ad29aacf0b690b0467fe2b2767f76"; // 31 chars
      const invalidHex2 = "70ad29aacf0b690b0467fe2b2767f7655"; // 33 chars
      const invalidHex3 = "70ad29aacf0b690b0467fe2b2767f76g"; // invalid char

      expect(
        parseCSV(
          `file,text,number,hex\ntest.csv,valid,123,${validHex}`,
          "test.csv",
        ),
      ).to.have.length(1);
      expect(
        parseCSV(
          `file,text,number,hex\ntest.csv,invalid,123,${invalidHex1}`,
          "test.csv",
        ),
      ).to.have.length(0);
      expect(
        parseCSV(
          `file,text,number,hex\ntest.csv,invalid,123,${invalidHex2}`,
          "test.csv",
        ),
      ).to.have.length(0);
      expect(
        parseCSV(
          `file,text,number,hex\ntest.csv,invalid,123,${invalidHex3}`,
          "test.csv",
        ),
      ).to.have.length(0);
    });

    it("should skip lines with wrong filename", function () {
      const csvContent =
        "file,text,number,hex\nother.csv,wrong,123,70ad29aacf0b690b0467fe2b2767f765\ntest.csv,correct,456,70ad29aacf0b690b0467fe2b2767f765";
      const result = parseCSV(csvContent, "test.csv");

      expect(result).to.have.length(1);
      expect(result[0].text).to.equal("correct");
    });

    it("should trim whitespace from fields", function () {
      const csvContent =
        "file,text,number,hex\ntest.csv, spaced ,123, 70ad29aacf0b690b0467fe2b2767f765 ";
      const result = parseCSV(csvContent, "test.csv");

      expect(result).to.have.length(1);
      expect(result[0].text).to.equal("spaced");
      expect(result[0].hex).to.equal("70ad29aacf0b690b0467fe2b2767f765");
    });
  });
});
