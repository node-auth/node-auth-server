const crypto = require('crypto');
const speakeasy = require('speakeasy');

module.exports.generateRandomCode = (minNum, maxNum) => {
    const randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    const authorizationCode = crypto.randomBytes(randomNumber).toString('base64');
    return authorizationCode;
}

module.exports.generateTOTP = (secretKey, timeWindow = 180, otpLength = 6) => {
    const otp = speakeasy.totp({
        secret: secretKey,
        encoding: 'base32',
        digits: otpLength,
        step: timeWindow
    });
    return otp;
}

module.exports.verifyOTP = (secretKey, otp, timeWindow = 180) => {
    const isValid = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'base32',
        token: otp,
        step: timeWindow
    });
    return isValid;
}