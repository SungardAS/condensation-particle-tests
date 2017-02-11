# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.5.4 - 2017-02-11
### Added
- condensation-particle-test now has it own tests
- cOpts option for running tests.  This will mock the condensation
  enviornment of the running test.

### Fixed
- hArgs was incorrectly used as hOpts.  This has been fixed and
  backwards compatibility exists for tests written with ^0.5.0. A new
  option `hashOpts` is the equivelent to the old hArgs implementation.
  Going forward `hArgs` will be an Array of arguments, as it should be,
  and use of `hOpts` or `hashOpts` should be used accordinally.


## 0.5.3 - 2017-01-17
### Fixed
- compatible with condensation 0.6.0

## 0.5.2 - 2016-05-18
### Fixed
- Fixed merge order for validateJson

## 0.5.1 - 2016-04-28
### Fixed
- Fixed peerDependency for [condensation][condensation-url] ^0.5.0

## 0.5.0 - 2016-04-21
### Added
- Initial release to work with [condensation][condensation-url] ^0.5.0


[condensation-url]: https://github.com/SungardAS/condensation
