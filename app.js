var fs = require('fs')
	,	path = require('path')
	,	spawn = require('child_process').spawn
	,	guid = require('guid')

// gpg --homedir d:/prog/nodejs/temppgp/tempdir/blah --import jon.pubkey

function verify(pubkey, sig, done) {
	var rnd = guid.raw();
	var homedir = path.resolve(__dirname, "tempdir", rnd)

	var makedir = spawn("mkdir", [homedir])
	makedir.on('close', function(code) {
		var makering = spawn("gpg", ["--homedir", homedir, "--import"])
		makering.stdin.write(pubkey)
		makering.stdin.end()

		makering.on('close', function(code) {
			
			var verify = spawn("gpg", ["--homedir", homedir, "--verify"])
			verify.stdin.write(sig)
			verify.stdin.end()
			
			verify.on('close', function(code) {
				log("code from verify: ", code)
				
				var success = code === 0;
				// ok we're done, lets remove the temp folder.
				spawn("rm", ["-r", homedir])
				
				done(null, success)
			})
		})
	})
}

module.exports = verify