
var gpgverify = require('./app')


var opts = { encoding: "ascii" }
var sig = fs.readFileSync("challenge.sig", opts)
var pubkey = fs.readFileSync("jon.pubkey", opts)
var pubkey2 = fs.readFileSync("jon.m2.pubkey", opts)


gpgverify(sig, pubkey, function(err, status) {
	console.log("first test: " + status === true)
})

gpgverify(sig, pubkey2, function(err, status) {
	console.log("second test: " + status === false)
})