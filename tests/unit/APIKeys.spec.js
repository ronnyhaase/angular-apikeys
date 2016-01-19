'use strict';

// Disable JSHint: "Expected an assignment or function call and instead saw an expression."
// Otherwise JSHint dislikes ChaiJS
/*jshint -W030 */

var expect = chai.expect;

describe('Unit: APIKeys', function() {
	// Some defaults for testing
	var invalidKeys = [
				true, 1, [1], {a:'a'}, /[a-z]/,

				false, 0, null, undefined, NaN
		],
		validKey = 'test',
		validValue = '1234567890';

	describe('API', function () {
		var service;

		beforeEach(function() {
			module('apikeys');
		});
		beforeEach(inject(function(apiKeys){
			service = apiKeys;
		}));

		describe('#set()', function () {
			it('should return true when calling with valid key & value', function () {
				expect(
					service.set(validKey, validValue)
				).to.be.ok;
			});

			it('should return false if key is not a string or anything strange', function () {
				invalidKeys.forEach(function (id) {
					expect(
						service.set(id, validValue)
					).to.not.be.ok;

					// Probably shouldn't use yet untested methods
					/*expect(
						service.get(id)
					).to.not.equal(value)
						.and.to.not.be.ok;*/
				});
			});

			it('should also return false if key is a empty string', function () {
				expect(
					service.set('', validValue)
				).to.not.be.ok;
			});
		});

		describe('#get()', function () {
			it('should return the value for a valid key, if set with #set() before', function () {
				service.set(validKey, validValue);
				expect(
					service.get(validKey)
				).to.be.eq(validValue);
			});

			it('should return undefined for a valid key, NOT set before', function () {
				expect(
					service.get(validKey)
				).to.be.undefined;
			});

			it('should return false for any invalid key', function () {
				invalidKeys.forEach(function (key) {
					expect(
						service.get(key)
					).to.be.false;
				});
			});

			it('should return false for a key containing a empty string', function () {
				expect(
					service.get('')
				).to.be.false;
			});
		});

		describe('(scenarios)', function () {
			it('#set() does really not store invalid keys', function () {
				invalidKeys.forEach(function (id) {
					expect(
						service.set(id, validValue)
					).to.not.be.ok;

					expect(
						service.get(id)
					).to.not.equal(validValue)
						.and.to.not.be.ok;
				});
			});
		});
	});

	// Test if provider works in configuration phase
	describe('Angular configuration phase', function () {
		var provider;

		beforeEach(function () {
			angular.module('test.apikeys', ['apikeys'])
				.config(function (apiKeysProvider) {
					provider = apiKeysProvider;
				});

			module('test.apikeys', 'apikeys');
			inject();
		});

		it('should be injected', function () {
			expect(provider).to.not.be.undefined;
		});

		it('should have it\'s methods #get() and #set()', function () {
			expect(provider.get).to.not.be.undefined;
			expect(provider.set).to.not.be.undefined;
		});

		it('should store a valid key/value pair with #set() and return it with #get()', function () {
			expect(
				provider.set(validKey, validValue)
			).to.not.be.false;

			expect(
				provider.get(validKey)
			).to.equal(validValue);
		});
	});

	// Test if provider and instance work hand in hand (config- and run-time)
	describe('Angular runtime', function () {
		var provider,
			instance;

		beforeEach(function () {
			angular.module('test.apikeys', ['apikeys'])
					.config(function (apiKeysProvider) {
						provider = apiKeysProvider;
					})
					.run(function (apiKeys) {
						instance = apiKeys;
					});

			module('test.apikeys', 'apikeys');
			inject();
		});

		it('should access values that were set in configuration phase via the provider, at runtime via the instance', function () {
			provider.set(validKey, validValue);
			expect(
				instance.get(validKey)
			).to.equal(validValue);
		});
	});
});