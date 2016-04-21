var Condensation = require('condensation/lib/condensation');
var _ = require("lodash");
var assert = require("assert");
var path = require("path");


/*
 * Utilities for testing condensation particles
 *
 * @class
 * @param {Object} [options] test configuration
 * @param {Object} [options.condensation] Condensation object to use for tests.
 */
var CondensationTests = function(options) {
  options = options || {};
  var condensation = this.condensation = options.condensation || new Condensation();
};

/*
 * Returns a clean hOpts object
 *
 * @function
 * @return {Object} minimal hOpts (handlebars options object) needed for testing
 */
CondensationTests.prototype.hOptsFunc = function() {
  return {
    data: {
      _file: {
        path: [
          this.condensation.options.projectFullPath,
          'particles',
          'cftemplates',
          '____test_template'
        ].join(path.sep)
      }
    },
    hash: {}
  };
};

/*
 * Compile and execute handlebars processing for a given particle
 *
 * @function
 * @param {String} particleType Name of the particle type
 * @param {String} particlePath Relative path to the particle
 * @param {Object} [options] processing configuration
 * @param {Object} [options.logicalId] the Logical ID for the particle
 * @param {Object} [options.hArgs] Handlebars arguments to use for processing the particle
 * @param {Boolean} [options.validateJson=true] Whether to valide the output as valid JSON
 * @return {String} The processed particle
 *
 */
CondensationTests.prototype.processParticle = function(particleType,particlePath,options) {
  options = _.merge(
    options,
    {validateJson: true}
  );

  var hOpts = this.hOptsFunc();
  hOpts.hash.logicalId = options.logicalId;
  hOpts.hash = _.merge(hOpts.hash,options.hArgs);

  var result = this.condensation.helpers[particleType].apply(null,[particlePath, hOpts]);

  if (options.validateJson) {
    try {
      result = JSON.parse(result);
    }
    catch(e) {
      result = JSON.parse('{' + result + '}');
    }
  }

  return result;
};

/*
 * Compile and execute handlebars processing for a given particle
 *
 * @function
 * @param {String} particleType Name of the particle type
 * @param {String} particlePath Relative path to the particle
 * @param {Object} fixture A fixtue to compare the processed output to
 * @param {Object} [options] processing configuration
 * @param {Object} [options.logicalId] the Logical ID for the particle
 * @param {Object} [options.hArgs] Handlebars arguments to use for processing the particle
 * @param {Boolean} [options.validateJson=true] Whether to valide the output as valid JSON
 * @param {String} [options.assertType] How to assert against the fixture. If options.validateJson is true then assertType will be deepEqual. If false then equal
 * @return {String} The processed particle
 *
 */
CondensationTests.prototype.testParticle = function(particleType,particlePath,fixture,options) {
  options = _.merge(
    options,
    {validateJson: true}
  );


  if (options.expectError) {
    assert.throws(this.processParticle.bind(this,particleType,particlePath,options));
  }
  else {
    var assertType = "deepEqual";
    if (!options.validateJson) {
      assertType = "equal"
    }

    var result = this.processParticle(particleType,particlePath,options);

    assert[assertType](result, fixture);
  }

};


module.exports = CondensationTests;