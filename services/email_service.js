const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

module.exports.sendEmail = async (email, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Reyco Seguma 👻" <segumareyco@gmail.com>', // sender address
            to: email,
            subject: subject,
            text: text,
            html: html,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, message: 'Successfuly sent' }
    } catch (err) {
        console.log(err);
        return { success: false, message: 'Something went wrong' }
    }
}