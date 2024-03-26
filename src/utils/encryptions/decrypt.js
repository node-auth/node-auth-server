const crypto = require('crypto');

module.exports.decryptAES256CBC = (encryptedText, secretKey, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedText += decipher.final('utf-8');
    return encryptedText;
}