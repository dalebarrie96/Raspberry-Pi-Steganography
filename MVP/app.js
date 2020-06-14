var fs = require('fs');
var Jimp = require('jimp');
var binaryUtils = require('./utils/binaryUtils');

//console.log("hello world");
/*
console.log("testing image stuff");
testImageStuff();
*/

/*
console.log("testing message stuff");
testMessageStuff();
*/

//firstEncryptMessageTest();
firstDecryptMessageTest(88);

function firstEncryptMessageTest(){
	
	var _binaryString = "";
	
	fs.readFile("documents/message.txt", 'utf8', function(err, data) {
	  if (err) throw err;
	  
	  console.log("message to hide is - " + data)

	  for (var i = 0; i < data.length; i++) {
		_binaryString += binaryUtils.byteFromBinary(data[i].charCodeAt(0).toString(2));
		
	  }
	  
	  console.log("Binary string is: ");
	  console.log(_binaryString);
	  console.log(_binaryString.length);
	  
	  fs.readFile('documents/glasgow-png.png', function(err, buffer){
		if (err) throw err;
		
		console.log("About to scan an manipulate image");
		
		Jimp.read(buffer)
			.then(image => {

				
				image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
					//get the red pixel to update
					var red = this.bitmap.data[idx + 0];
					var green = this.bitmap.data[idx + 1];
					var blue = this.bitmap.data[idx + 2];
					var alpha = this.bitmap.data[idx + 3];
					
					var currentBit = image.getPixelColor(x, y);
					
					  
					if (_binaryString) {
						var bit = _binaryString.charAt(0);
						
						if(bit == 1){
							red = red |= 1;
						}else if(bit == 0){
							red = red &= ~1;
						}
						
						var _newhex = Jimp.rgbaToInt(red, green, blue, alpha); //new hex value
					
						image.setPixelColor( _newhex, x, y); // sets the colour of this pixel
						
						_binaryString = _binaryString.substr(1); //this is to remove first character of binary string
						
					}
				});
				
				image.write('output.png'); // save
				
			})
			.catch(err => {
				// Handle an exception.
				console.log("something went wrong! oops");
				console.log(err);
			});
			
		});	
	  
	});
	

}

function firstDecryptMessageTest(pixToScan){
	
	console.log("about to decrypt the output image");
	
	var message="";
	var binaryString = "";
	
	fs.readFile('output.png', function(err, buffer){
		if (err) throw err;
		
		console.log("About to scan an manipulate image");
		
		Jimp.read(buffer)
			.then(image => {
				
				var pixCount = 0;
				
				image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
					pixCount++;
					//get the red pixel to update
					var red = this.bitmap.data[idx + 0];
					var green = this.bitmap.data[idx + 1];
					var blue = this.bitmap.data[idx + 2];
					var alpha = this.bitmap.data[idx + 3];
					
					//s = s.substr(1); //this is to remove first character of binary strin
					
					  
					if (pixCount <= pixToScan) {
						binaryString += red.toString(2).slice(-1);						
					}
				});
				console.log("Binary String extracted was: ")
				console.log(binaryString);
				
				console.log("decrypted message = ");
				console.log(binaryUtils.binaryStringToText(binaryString));
				
			})
			.catch(err => {
				// Handle an exception.
				console.log("something went wrong! oops");
				console.log(err);
			});
			
		
			
	});	

}


function testImageStuff(){
 
	fs.readFile('documents/glasgow-png.png', function(err, buffer){
		
		Jimp.read(buffer)
			.then(image => {
				// Do stuff with the image.
				console.log("successfully in jimp image format");
				
				//console.log("width = " + _width + " height = " + _height);
				
				image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
					// x, y is the position of this pixel on the image
					// idx is the position start position of this rgba tuple in the bitmap Buffer
					// this is the image
					 
					var red = this.bitmap.data[idx + 0];
					var green = this.bitmap.data[idx + 1];
					var blue = this.bitmap.data[idx + 2];
					var alpha = this.bitmap.data[idx + 3];
					
					var _newhex = Jimp.rgbaToInt(255, 255, 255, 255); //new hex value
					
					var bit = image.getPixelColor(x, y);
					
					//image.setPixelColor( _newhex, x, y); // sets the colour of this pixel
					  
					if (x == image.bitmap.width - 1 && y == image.bitmap.height - 1) {
						// image scan finished save new copy
						
						//image.write('test.png'); // save
						
						//console.log("image has been created");
						
						/*
						changing LSB to 1 with toString
						console.log(red.toString(2) | 1);
						
						var newint = parseInt(red.toString(2) | 1,2);
						
						console.log(newint);
						*/
						
						console.log(red);
						
						console.log(red |= 1);
					}
				});
			})
			.catch(err => {
				// Handle an exception.
				console.log("something went wrong! oops");
				console.log(err);
			});
	});	

}



function testMessageStuff(){
	
	fs.readFile("documents/message.txt", 'utf8', function(err, data) {
	  if (err) throw err;

	  console.log(data);
	  for (var i = 0; i < data.length; i++) {
		  console.log("character = " + data[i] + " (" + data[i].charCodeAt(0).toString(2) + ") ");
	  }
	  console.log("parse int from h binary = " + parseInt('01101000', 2));
	  console.log("Char code from above " + String.fromCharCode(parseInt('01101000', 2)));
	  
	});
}
