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
  var condensation = this.condensation = options.condensation || new (require('condensation/lib/condensation'))();
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
 * @param {Object} [options.cOpts] Mock condensation settings for the current test
 * @param {Array} [options.hArgs] Mock an array of arguments sent by handlebars
 * @param {Object} [options.hOpts] Mock the options hash passed by handlebars
 * @param {Object} [options.hashOpts] shortcut for setting {hOpts: {hash: {} }}
 * @param {Boolean} [options.validateJson=true] Whether to valide the output as valid JSON
 * @param {Boolean} [options.expectError=false] If `true` expect the test to throw an error
 * @return {String} The processed particle
 *
 */
CondensationTests.prototype.processParticle = function(particleType,particlePath,options) {
  options = _.merge(
    {validateJson: true},
    options
  );

  var hOpts = this.hOptsFunc();
  hOpts.hash.logicalId = options.logicalId;
  hOpts.hash = _.merge(hOpts.hash, options.hashOpts);
  hOpts = _.merge(hOpts,options.hOpts);

  var cOpts = options.cOpts;
  var hArgs = options.hArgs;

  /*
   * For Backwards compatibility only
   * Prior to 0.5.4 hArgs was incorrecty used instead of hOpts
   *
   * hArg should be an array of string arguments, but if it is an object then it will be treated like hOpts
   */
  if (options.hArgs && !_.isArray(options.hArgs)) {
    hOpts.hash = _.merge(hOpts.hash,options.hArgs);
    delete options.hArgs;
  }

  var result = this.condensation.helpers[particleType].apply(cOpts,_.compact(_.flatten([particlePath, hArgs, hOpts])));

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
 * @param {Object} [options.cOpts] Mock condensation settings for the current test
 * @param {Array} [options.hArgs] Mock an array of arguments sent by handlebars
 * @param {Object} [options.hOpts] Mock the options hash passed by handlebars
 * @param {Object} [options.hashOpts] shortcut for setting {hOpts: {hash: {} }}
 * @param {Object} [options.logicalId] shortcut for {hOpts: {hash: {logicalId: "" }}}
 * @param {Boolean} [options.validateJson=true] Whether to valide the output as valid JSON
 * @param {String} [options.assertType] How to assert against the fixture. If options.validateJson is true then assertType will be deepEqual. If false then equal
 * @return {String} The processed particle
 *
 */
CondensationTests.prototype.testParticle = function(particleType,particlePath,fixture,options) {
  options = _.merge(
    {validateJson: true},
    options
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
