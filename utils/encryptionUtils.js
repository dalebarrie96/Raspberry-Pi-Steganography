const crypto = require('crypto');

const ENCRYPTION_METHOD = 'aes-256-cbc'; 
const ENCRYPTION_KEY_LENGTH = 32; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

var password = 'password123';
var salt = 'saltBae';
var IV = crypto.randomBytes(IV_LENGTH);

const key = generateKeySync(password, salt, ENCRYPTION_KEY_LENGTH);


module.exports = {
	
	encryptText : (plainText) => {
		//const key = generateKeySync(password, salt, ENCRYPTION_KEY_LENGTH);
		const cipher = crypto.createCipheriv(ENCRYPTION_METHOD, key, IV);
		
		let encryptedText = cipher.update(plainText, 'utf8', 'hex');
		encryptedText += cipher.final('hex');
		
		return encryptedText;
	},
	
	decryptText : (encryptedText) => {
		//const key = generateKeySync(password, salt, ENCRYPTION_KEY_LENGTH);
		const decipher = crypto.createDecipheriv(ENCRYPTION_METHOD, key, IV);
		
		let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
		decryptedText += decipher.final('utf8');
		
		return decryptedText;
	}
	
}

/*
 * This will return a buffer of the generated key
 * use toString('hex') if required as string
 */
async function generateKeyAsync(password,salt,byteSize){
	crypto.scrypt(password, salt, byteSize, (err, derivedKey) => {
		if (err) throw err;
		return derivedKey; 
	});
}

/*
 * This will return a buffer of the generated key
 * use toString('hex') if required as string
 */
function generateKeySync(password,salt,byteSize){
	return crypto.scryptSync(password,salt,byteSize);
}
