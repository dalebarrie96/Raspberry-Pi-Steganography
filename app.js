var fs = require('fs');
var Jimp = require('jimp');

var _width;
var _height;

console.log("hello world");
/*
console.log("testing image stuff");
testImageStuff();
*/
console.log("testing message stuff");
testMessageStuff();

function testImageStuff(){
 
	fs.readFile('documents/glasgow-png.png', function(err, buffer){
		
		Jimp.read(buffer)
			.then(image => {
				// Do stuff with the image.
				console.log("successfully in jimp image format");
				_width = image.bitmap.width;
				_height = image.bitmap.height;
				
				console.log("width = " + _width + " height = " + _height);
				
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
						
						console.log(red | 1);
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

	  console.log(data)
	});
}
