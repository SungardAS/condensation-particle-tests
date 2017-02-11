var assert = require("assert");
var CondensationTests = require("../");
var Condensation = require("condensation/lib/condensation");
var path = require("path");

var testConfig={
  s3: [
    {
      aws: {
        region: 'us-east-1',
        bucket: '',
      },
      validate: false,
      create: false
    }
  ],
  projectName: "test",
  root: path.join('test','fixtures','projects','test'),
  taskPrefix: '',
  dist: path.join('test','dist','test')
};

var cTests = new CondensationTests({condensation: (new Condensation(null,testConfig))});

describe("testParticle", function() {
  it("should test a particle", function() {
    cTests.testParticle(
      "parameter",
      "test_param",
      require("./fixtures/particles/test_param_1"),
      {hOpts: {hash: {logicalId: "Parameter1" }} }
    );
  });

  it("backwards compatible with incorrect hArgs assignment", function() {
    cTests.testParticle(
      "parameter",
      "test_param",
      require("./fixtures/particles/test_param_1"),
      {hArgs: {logicalId: "Parameter1" } }
    );
  });
});

