module.exports = {
	
	binaryStringToText: (binary) => {
		
		var _hiddenMessage = "";
		
		var bytes = binary.match(/.{1,8}/g); //find a nicer way to do this
		
		for(i = 0; i < bytes.length; i++){
			_hiddenMessage += String.fromCharCode(parseInt(bytes[i], 2));
		}
		
		return _hiddenMessage;
	},
	
	messageTextToBinaryString:	(message) => {
		var _binaryString = "";
		
		for (var i = 0; i < message.length; i++) {
			_binaryString += module.exports.byteFromBinary(message[i].charCodeAt(0).toString(2));
		}
		
		return _binaryString;
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
