var fs = require('fs')
	,	gpgverify = require('./app')
	,	assert = require("assert")

var log = console.log
var opts = { encoding: "ascii" }
var sig = fs.readFileSync("challenge.sig", opts)
var pubkey = fs.readFileSync("jon.pubkey", opts)
var pubkey2 = fs.readFileSync("jon.m2.pubkey", opts)


describe("gpg-verify", function() {
	it("should return true for a signature with matching pubkey", function(done) {
		gpgverify(sig, pubkey, function(err, status) {
			if (err) throw err;
			assert.equal(status, true)
			done();
		})	
	})

	it("should return false for a signature with a non-matching pubkey", function(done) {
		gpgverify(sig, pubkey2, function(err, status) {
			if (err) throw err;
			assert.equal(status, false);
			done();
		})
	})

	it("should return false for a broken signature", function(done) {
		gpgverify("kek", pubkey2, function(err, status) {
			if (err) throw err;
			assert.equal(status, false);
			done();
		})
	})
})

