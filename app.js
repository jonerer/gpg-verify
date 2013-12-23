var path = require('path')
	,	spawn = require('child_process').spawn
	,	guid = require('guid')

var log = console.log
// gpg --homedir d:/prog/nodejs/temppgp/tempdir/blah --import jon.pubkey

var errtext = "";

function log_errs(spawn) {
	spawn.stderr.on('data', function(err) {
		errtext += err;
	})
}

function verify(sig, pubkey, done) {
	var rnd = guid.raw();
	var homedir = path.resolve(__dirname, "tempdir", rnd)

	var makedir = spawn("mkdir", [homedir])
	//log(homedir)
	log_errs(makedir)
	makedir.on('close', function(code) {
		var makering = spawn("gpg", ["--homedir", homedir, "--import"])
		makering.stdin.write(pubkey)
		makering.stdin.end()
		
		//log_errs(makering)
		makering.on('close', function(code) {
			
			var verify = spawn("gpg", ["--homedir", homedir, "--verify"])
			verify.stdin.write(sig)
			verify.stdin.end()
			
			//log_errs(verify)
			verify.on('close', function(code) {
				//console.log("code from verify: ", code)
				
				var success = code === 0
				// ok we're done, lets remove the temp folder.
				spawn("rm", ["-r", homedir])
				
				if (errtext) {
					done(errtext, false)
				} else {
					done(null, success)
				}
			})
		})
	})
}

module.exports = verify