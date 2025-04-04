const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = (email, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendEmailHtml = (email, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    html: htmlContent,
  };

  console.log("In email service: ", email);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendEmail, sendEmailHtml };
