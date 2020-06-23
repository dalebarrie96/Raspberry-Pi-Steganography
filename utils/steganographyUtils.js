const Jimp = require('jimp');
const fs = require('fs');
const fileUtils = require('../utils/fileUtils');
const binaryUtils = require('../utils/binaryUtils');

module.exports = {
	
	embedMessage : (message, filepath) => {
		
		fileUtils.readImageBuffer(filepath, function(err,buffer){
				
			Jimp.read(buffer)
				.then(image => {
					
				var _width = image.bitmap.width;
				var _height = image.bitmap.height;
				
				var _total_pixels = _width * _height;
				
				if(canEmbedMessage(_total_pixels,message)){
					
					var _binaryString = binaryUtils.messageTextToBinaryString(message);
					
					var _count = 1;
					
					image.scan(0, 0, _width, _height , function(x, y, idx) {
						
						var red = this.bitmap.data[idx + 0];
						var green = this.bitmap.data[idx + 1];
						var blue = this.bitmap.data[idx + 2];
						var alpha = this.bitmap.data[idx + 3];
						
						if(_count === 8 && _binaryString.length > 0){
							//we need to add a keep reading check bit (0)
							red = red &= ~1;
							
							_count = 1;
							
							saveNewPixel(image,idx,red,x,y);
							
						}else if(_count === 8 && _binaryString.length === 0){
							//we need to add a stop reading check bit (1)
							
							red = red |= 1;
							
							_count = 1;
							
							saveNewPixel(image,idx,red,x,y);
							
						}else{
							//we need to add a message bit
							var bit = _binaryString.charAt(0);
							
							if(bit == 1){
								red = red |= 1;
							}else if(bit == 0){
								red = red &= ~1;
							}
							
							saveNewPixel(image,idx,red,x,y);
							
							_binaryString = _binaryString.substr(1);
							
							_count++;
						
						}
						
					});
				
					image.write('output.png'); // save
					
				}
				
			})
			.catch(err => {
				// Handle an exception.
				console.log("something went wrong! oops");
				console.log(err);
			});
			
		});
	},
	
	extractMessage : (filepath) => {
		
		fileUtils.readImageBuffer(filepath, function(err,buffer){
		
			var _binaryString = "";
					
			var _finalString = "";
			
			Jimp.read(buffer)
				.then(image => {
					
					var _count = 1;
					
					image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
						//get the red pixel to update
						var red = this.bitmap.data[idx + 0];
						var green = this.bitmap.data[idx + 1];
						var blue = this.bitmap.data[idx + 2];
						var alpha = this.bitmap.data[idx + 3];
						
						if(_count == 8){
							//we need to add a keep reading check if we should keep reading or not
							var _checkBit = red.toString(2).slice(-1);
							
							if(_checkBit == 0){
								_count = 1;
							}else{
								_finalString = _binaryString
							}
								
						}else{
							//we need to add a message bit
							_binaryString += red.toString(2).slice(-1);
							
							_count++;						
						}
					});
					
					console.log(_finalString);
					console.log(binaryUtils.binaryStringToText(_finalString));
				})
				.catch(err => {
					// Handle an exception.
					console.log("something went wrong! oops");
					console.log(err);
				});
		});	
	}
}

function saveNewPixel(image,index,r, x, y){
	var g = image.bitmap.data[index + 1];
	var b = image.bitmap.data[index + 2];
	var a = image.bitmap.data[index + 3];
	
	var _newhex = Jimp.rgbaToInt(r, g, b, a);
					
	image.setPixelColor( _newhex, x, y); 
}

/*
 * Check to see if there is enough pixels to hide the message
 * 
 * TODO: Maybe if it doesnt fit, we should consider modifying more than the red bytes
 */
function canEmbedMessage(pixels, message){
	
	//we have a check bit after each byte of data
	var _noOfCheckBits = message.length;
	var _noOfBits = binaryUtils.messageTextToBinaryString(message).length;
	var _totalBits = _noOfCheckBits + _noOfBits
	
	return _totalBits < pixels ? true : false;
}

