const nodemailer = require("nodemailer");
const {
  smtpHost,
  emailPort,
} = require("./config.json");

module.exports = class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: emailPort,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(userEmail, code) {
    const mailOptions = {
      from: "UNLVAuth"+ "@" + smtpHost,
      to: userEmail,
      subject: "UNLV Email Verification Code",
      text: "Your email verification code is:" + code,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
