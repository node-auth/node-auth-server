module.exports.prefixPadWithLeadingZeros = (num) => {
    const totalLength = 10;
    return String(num).padStart(totalLength, '0');
}