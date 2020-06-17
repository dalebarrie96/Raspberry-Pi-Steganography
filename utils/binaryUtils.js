module.exports = {
	
	binaryStringToText: (binary) => {
		
		console.log(binary);
		console.log("Converting above binary to original string");
		
		var hiddenMessage = "";

		
		var bytes = binary.match(/.{1,8}/g); //find a nicer way to do this
		
		for(i = 0; i < bytes.length; i++){
			hiddenMessage += String.fromCharCode(parseInt(bytes[i], 2));
		}
		
		return hiddenMessage;
	},
	
	byteFromBinary: (bin) => {
		return ("000000000" + bin).substr(-8);
	},
	
	byteFromNumber: (n) => {
		if (n < 0 || n > 255 || n % 1 !== 0) {
			throw new Error(n + " does not fit in a byte");
		}
		return ("000000000" + n.toString(2)).substr(-8);
	}
}
