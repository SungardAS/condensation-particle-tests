var assert = require("assert");
var CondensationTests = require("../");

var cTests = new CondensationTests();

describe("testParticle", function() {
  it("should test a particle", function() {
      cTests.testParticle(
        "parameter",
        "test_param",
        {}
        {hOpts: {logicalId: "Parameter1"}}
      );
  });
};

