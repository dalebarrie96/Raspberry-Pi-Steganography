var fs = require('fs');
var Jimp = require('jimp');
var binaryUtils = require('./utils/binaryUtils');
var encryptionUtils = require('./utils/encryptionUtils');

console.log("Lets code some shit!")

var str = "hello world";
console.log('about to encrypt - ' + str);

var enc = encryptionUtils.encryptText(str);

console.log('encrypted text:');
console.log(enc);

var dec = encryptionUtils.decryptText(enc);

console.log('decrypted text:');
console.log(dec);
