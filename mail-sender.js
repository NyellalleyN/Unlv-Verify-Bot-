const nodemailer = require("nodemailer");
const { serverEmail, serverPassword } = require("./config.json");

module.exports = class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: serverEmail,
        pass: serverPassword,
      },
    });
  }

  async sendEmail(userEmail, code) {
    const mailOptions = {
      from: serverEmail,
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
