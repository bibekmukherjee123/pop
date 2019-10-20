var nodemailer = require('nodemailer');

let message;
async function sendmail(maildata) {
    console.log(maildata);
    var subject = maildata.subject;
    var mailcontent = maildata.description;
    var toemail = maildata.email;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "property360vr@gmail.com",
            pass: "cfttgsxiymqwhifz"
        }
    });

    const mailOptions = {
        from: "property360vr@gmail.com", // sender address
        to: toemail, // list of receivers
        subject: subject, // Subject line
        html: mailcontent // plain text body
    };

    await transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            message = 'error';
            //logger.log(err);
        } else {
            //logger.log(info);
            message = 'success';
        }
    });
    return message;
}
module.exports = {
    sendmail: sendmail
};