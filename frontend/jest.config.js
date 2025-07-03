module.exports = {
   transform: {
     "^.+\\.(js|jsx)$": "babel-jest"
   },
   moduleNameMapper: {
     "\\.(css|less)$": "identity-obj-proxy"
   },
   testEnvironment: 'jest-environment-jsdom',
   setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
   reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Frontend Test Report",
      outputPath: "test/report/frontend.html"
    }]
  ]
 };