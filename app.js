const usbDetect = require('usb-detection');
const drivelist = require('drivelist');
const fs = require('fs');

const encryptionUtils = require('./utils/encryptionUtils');
const stegUtils = require('./utils/steganographyUtils');
const fileUtils = require('./utils/fileUtils');

const MESSAGE_FILE = 'message.txt';
const OUTPUT_FILE = 'output.png';
const IMAGE_EXTENSION = '.png'

usbDetect.startMonitoring();

console.log('Steganography Pi now running!');

usbDetect.on('add', (device) => { 
	
	console.log('USB Device connected');
	
	var waitTillMounted = setInterval(function(){
		drivelist.list().then((drives) => {
			drives.forEach((drive) => {
				if(drive.busType === 'USB' && drive.description.includes(device.deviceName)){
					clearInterval(waitTillMounted);
					deriveAction(drive);
				}
			});
		}).catch((e) => console.log(e));
	}, 3000);
	
});

/*
 * We need to find out if we want to embed or extract a message
 */
function deriveAction(usbDrive){
	var _root = usbDrive.mountpoints[0].path + '/';
	
	var hasMessageFile = fs.existsSync(_root + MESSAGE_FILE);
	var pngFiles = fs.readdirSync(_root).filter(fn => fn.endsWith(IMAGE_EXTENSION) && fn != OUTPUT_FILE);
	var hasOutputFile = fs.existsSync(_root + OUTPUT_FILE);
		
	if(hasMessageFile && pngFiles.length > 0){
		console.log('About to embed message.txt into image');
		
		embedMessage(_root, pngFiles);
	}else if(hasOutputFile){
		console.log('About to extract message from image');
		
		extractMessage();
	}else{
		throw new Error('Ooops! It looks like your missing the appropriate files.');
	}

}


function embedMessage(usbRoot, pngFiles){
	
	fileUtils.readMessageFile(usbRoot + MESSAGE_FILE, function(err,data){
		var encryptedMessage = encryptionUtils.encryptText(data);
		
		stegUtils.embedMessage(encryptedMessage, usbRoot + pngFiles[0]).then(console.log('then then?'));
		
	});
}

function extractMessage(){
	stegUtils.extractMessage('output.png');
}
