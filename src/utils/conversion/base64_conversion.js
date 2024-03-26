module.exports.textToBase64 = (text) => {
    return Buffer.from(text).toString('base64');
}
  
module.exports.base64ToText = (base64) => {
    return Buffer.from(base64, 'base64').toString('utf-8');
}