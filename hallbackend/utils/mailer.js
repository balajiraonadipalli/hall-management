const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: "akashbalu2001@gmail.com",
    pass: "dvqr exxe bayy hcou"  
  }
});

const sendBookingMail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: "akashbalu2001@gmail.com",
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendBookingMail;
