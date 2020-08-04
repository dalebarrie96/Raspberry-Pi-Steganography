const fs = require('fs');

//i wrote this before i found out about fs/promise... will rewrite soon

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
	},
	
	copyImage : (readFile, writefile) => {
		return new Promise(function(res,rej){
			fs.readFile(readFile, (err, data) => {
			  if (err) rej({'status': 'error', 'message' : 'Error reading message embedded image.'});
			  fs.writeFile(writefile, data, function (err) {
				  if (err) rej({'status': 'error', 'message' : 'Error writing message embedded image.'});
				  res({'status': 'success', 'message' : 'Successfully copied message embedded image onto usb.'});
				});
			});	
		});
	},
	
	writeExtractedMessageFile : (message,filepath, file) => {
		return new Promise(function(res,rej){
			fs.writeFile(filepath + file + '.txt', message, function (err) {
				if (err) rej({'status': 'error', 'message' : 'Error creating extracted message text file.'});
				res({'status': 'success', 'message' : 'Successfully created extracted message file on USB.'});
			});
		});
	}
	
	
}
