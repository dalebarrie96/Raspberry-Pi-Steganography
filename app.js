const usbDetect = require('usb-detection');
const drivelist = require('drivelist');
const fs = require('fs');
const fsp = require("fs/promises"); 

const encryptionUtils = require('./utils/encryptionUtils');
const stegUtils = require('./utils/steganographyUtils');
const fileUtils = require('./utils/fileUtils');

const MESSAGE_FILE = 'message.txt';
const OUTPUT_FILE_PREFIX = 'steg_';
const IMAGE_EXTENSION = '.png'

usbDetect.startMonitoring();

console.log('Steganography Pi now running!');

usbDetect.on('add', (device) => { 
	
	console.log('USB Device connected');
	
	let waitTillMounted = setInterval(function(){
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
	let _root = usbDrive.mountpoints[0].path + '/';
	
	let hasMessageFile = fs.existsSync(_root + MESSAGE_FILE);
	let pngFiles = fs.readdirSync(_root).filter(fn => fn.endsWith(IMAGE_EXTENSION) && !fn.startsWith(OUTPUT_FILE_PREFIX));
	let outputFiles = fs.readdirSync(_root).filter(fn => fn.startsWith(OUTPUT_FILE_PREFIX));
		
	if(hasMessageFile && pngFiles.length > 0){
		console.log('About to embed message.txt into image');
		
		startEmbedMessage(_root, pngFiles);
	}else if(outputFiles.length > 0){
		console.log('About to extract message from images');
		
		extractMessages(_root,outputFiles);
	}else{
		throw new Error('Ooops! It looks like your missing the appropriate files.');
	}

}


function startEmbedMessage(usbRoot, pngFiles){
	
	fileUtils.readMessageFile(usbRoot + MESSAGE_FILE, function(err,data){
		let encryptedMessage = encryptionUtils.encryptText(data)
		
		stegUtils.embedMessage(encryptedMessage, usbRoot + pngFiles[0]).then((res) => {
			console.log(res.message);
			handleEmbedCleanUp(usbRoot, pngFiles[0]);
		}).catch((rej) => {
			console.error(rej.message);
		})
		
	});
}


function handleEmbedCleanUp(usbRoot, filename){
	
	//delete original image
	let origPromise = fsp.unlink(usbRoot + filename);
	//delete message file
	let messagePromise = fsp.unlink(usbRoot + MESSAGE_FILE);
	//move output file to flash drive with new name
	let copyPromise = fileUtils.copyImage(__dirname+'/output.png', usbRoot + OUTPUT_FILE_PREFIX + filename);
	
	Promise.allSettled([origPromise,messagePromise,copyPromise]).then((results) => results.forEach((result) => console.log(result.status)))
}

function extractMessages(usbRoot, filesArray){
	
	filesArray.forEach((item, index) => {
		let prom = stegUtils.extractMessage(usbRoot + item);
		
		prom.then((res) => {
			
			let hexString = res.hexString;
			
			let message = encryptionUtils.decryptText(hexString);
			
			fileUtils.writeExtractedMessageFile(message, usbRoot, item).then((res) => {
				console.log(res.message);
			}).catch((rej) => {
				console.error(rej.message);
			})
		
		}).catch((rej) => {
			console.error(rej);
		
		})
	});
	
}

