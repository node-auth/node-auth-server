// ADD DAYS
module.exports.addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports.addHours = (date, numOfHours) => {
    const dateCopy = new Date(date.getTime());
    dateCopy.setTime(dateCopy.getTime() + numOfHours * 60 * 60 * 1000);
    return dateCopy;
}

module.exports.addSeconds = (date, numOfSeconds) => {
    const dateCopy = new Date(date.getTime());
    dateCopy.setTime(dateCopy.getTime() + numOfSeconds * 1000);
    return dateCopy;
}

// SUBTRACT
module.exports.subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}