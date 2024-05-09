const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports.sendSMS = async (to, body) => {
    try {
        const message = await client.messages.create({
            body: body,
            from: '+12185267003',
            to: to
        });
        console.log(message.sid);
        return { success: true, message: 'Successfuly sent' }
    } catch (err) {
        console.log(err);
        return { success: false, message: 'Something went wrong' }
    }
}