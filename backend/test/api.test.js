const { describe, it } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app.js");

chai.use(chaiHttp);
const { expect } = chai;

describe("API Integration Tests", function () {
  this.timeout(15000);

  describe("GET /files/data", function () {
    it("should return 200 status", function (done) {
      chai
        .request(app)
        .get("/files/data")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should return application/json content-type", function (done) {
      chai
        .request(app)
        .get("/files/data")
        .end(function (err, res) {
          expect(res).to.have.header("content-type", /application\/json/);
          done();
        });
    });

    it("should return valid data structure", function (done) {
      chai
        .request(app)
        .get("/files/data")
        .timeout(10000)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");

          // Si hay datos, verificar estructura
          if (res.body.length > 0) {
            const fileObject = res.body[0];
            expect(fileObject).to.have.property("file");
            expect(fileObject).to.have.property("lines");
            expect(fileObject.file).to.be.a("string");
            expect(fileObject.lines).to.be.an("array");

            // Si hay líneas, verificar estructura
            if (fileObject.lines.length > 0) {
              const line = fileObject.lines[0];
              expect(line).to.have.property("text");
              expect(line).to.have.property("number");
              expect(line).to.have.property("hex");
              expect(line.text).to.be.a("string");
              expect(line.number).to.be.a("number");
              expect(line.hex).to.be.a("string");
              expect(line.hex).to.match(/^[0-9a-fA-F]{32}$/);
            }
          }
          done();
        });
    });

    it("should return array of objects with correct structure when data exists", function (done) {
      chai
        .request(app)
        .get("/files/data")
        .timeout(10000)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");

          for (const fileObj of res.body) {
            expect(fileObj).to.have.property("file");
            expect(fileObj.file).to.be.a("string");
            expect(fileObj).to.have.property("lines");
            expect(fileObj.lines).to.be.an("array");

            for (const line of fileObj.lines) {
              expect(line).to.have.property("text").that.is.a("string");
              expect(line).to.have.property("number").that.is.a("number");
              expect(line).to.have.property("hex").that.is.a("string");
              expect(line.hex).to.match(/^[0-9a-fA-F]{32}$/);
            }
          }

          done();
        });
    });

    it("should return data for specific file when fileName query parameter is provided", function (done) {
      this.timeout(15000);

      // First get the list of files to use a valid filename
      chai
        .request(app)
        .get("/files/list")
        .end(function (err, listRes) {
          if (listRes.body.length === 0) {
            // Skip test if no files available
            done();
            return;
          }

          const fileName = listRes.body[0]; // Use first available file

          chai
            .request(app)
            .get("/files/data")
            .query({ fileName: fileName })
            .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("array");

              // Should return only one file object
              if (res.body.length > 0) {
                expect(res.body).to.have.length(1);
                expect(res.body[0]).to.have.property("file", fileName);
                expect(res.body[0]).to.have.property("lines");
              }

              done();
            });
        });
    });

    it("should return 404 when fileName query parameter specifies non-existent file", function (done) {
      chai
        .request(app)
        .get("/files/data")
        .query({ fileName: "nonexistent.csv" })
        .end(function (err, res) {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error", "File not found");
          expect(res.body).to.have.property("message");
          expect(res.body).to.have.property("availableFiles");
          expect(res.body.availableFiles).to.be.an("array");
          done();
        });
    });

    it("should return all files when no fileName query parameter is provided", function (done) {
      chai
        .request(app)
        .get("/files/data")
        .timeout(10000)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");

          // This should work the same as before - return all available files
          for (const fileObj of res.body) {
            expect(fileObj).to.have.property("file");
            expect(fileObj).to.have.property("lines");
          }

          done();
        });
    });
  });

  describe("GET /files/list", function () {
    it("should return 200 status", function (done) {
      chai
        .request(app)
        .get("/files/list")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should return application/json content-type", function (done) {
      chai
        .request(app)
        .get("/files/list")
        .end(function (err, res) {
          expect(res).to.have.header("content-type", /application\/json/);
          done();
        });
    });

    it("should return array of strings (filenames)", function (done) {
      chai
        .request(app)
        .get("/files/list")
        .timeout(10000)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");

          // Si hay archivos, verificar que son strings
          if (res.body.length > 0) {
            for (const filename of res.body) {
              expect(filename).to.be.a("string");
              expect(filename).to.not.be.empty;
            }
          }
          done();
        });
    });
  });

  describe("GET /health", function () {
    it("should return health check message", function (done) {
      chai
        .request(app)
        .get("/health")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("status", "ok");
          done();
        });
    });
  });

  describe("GET /nonexistent", function () {
    it("should return 404 for nonexistent endpoints", function (done) {
      chai
        .request(app)
        .get("/nonexistent")
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
