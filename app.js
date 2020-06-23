const encryptionUtils = require('./utils/encryptionUtils');
const stegUtils = require('./utils/steganographyUtils');
const fileUtils = require('./utils/fileUtils');

console.log("Lets code some shit!");

embedMessage();
//extractMessage();

function embedMessage(){
	
	//var data = fs.readFileSync("./documents/message.txt");
	
	
	fileUtils.readMessageFile("./documents/message.txt", function(err,data){
		var encryptedMessage = encryptionUtils.encryptText(data);
		
		stegUtils.embedMessage(encryptedMessage, './documents/glasgow-png.png');
		
	});
}

function extractMessage(){
	stegUtils.extractMessage('output.png');
}
