const crypto = require('crypto');

module.exports.encryptAES256CBC = (textToEncrypt, secretKey, iv) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encryptedText = cipher.update(textToEncrypt, 'utf-8', 'hex');
    encryptedText += cipher.final('hex');
    return encryptedText;
}

module.exports.encryptSHA256 = (textToEncrypt) => {
    const hash = crypto.createHash('sha256');
    hash.update(textToEncrypt);
    return hash.digest('hex');
}