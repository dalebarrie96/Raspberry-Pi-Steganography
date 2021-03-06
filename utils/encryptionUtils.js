'use-strict';
const crypto = require('crypto');
let config = require('../config.json');

const ENCRYPTION_METHOD = 'aes-256-cbc'; 
const ENCRYPTION_KEY_LENGTH = 32; // (32 bytes/characters)
const IV_LENGTH = 16; // 16 for AES

let password = config.password;
let salt = config.salt;
let IV = config.IV.length == IV_LENGTH ? config.IV : Buffer.alloc(IV_LENGTH);

const key = generateKeySync(password, salt, ENCRYPTION_KEY_LENGTH);


module.exports = {
	
	encryptText : (plainText) => {
		console.log('About to encrypt text');
		
		const cipher = crypto.createCipheriv(ENCRYPTION_METHOD, key, IV);
		
		let encryptedText = cipher.update(plainText, 'utf8', 'hex');
		encryptedText += cipher.final('hex');
		
		return encryptedText;
	},
	
	decryptText : (encryptedText) => {
		console.log('About to decrypt text');

		const decipher = crypto.createDecipheriv(ENCRYPTION_METHOD, key, IV);
				
		let decryptedText = decipher.update(Buffer.from(encryptedText, 'hex'), 'hex', 'utf8');
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
