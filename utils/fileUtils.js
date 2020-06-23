const fs = require('fs');

module.exports = {
	
	readMessageFile : (dir, callback) => {
		
		fs.readFile(dir, function (err, content) {
			if (err) return callback(err)
			callback(null, content)
		});
	},
	
	readImageBuffer	: (dir, callback) => {
		fs.readFile(dir, function(err, buffer){
			if (err) throw err;
			callback(null,buffer);
		});
	}
	
	
}
