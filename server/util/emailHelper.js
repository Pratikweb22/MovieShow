const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Replace {{key}} with actual values
function replaceContent(content, creds) {
  return Object.keys(creds).reduce((acc, key) => {
    return acc.replace(new RegExp(`{{${key}}}`, "g"), creds[key]);
  }, content);
}

async function EmailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname, "email_templates", templateName);
    const content = await fs.promises.readFile(templatePath, "utf-8");

    const emailDetails = {
      from: `"Scaler Shows" <${process.env.GMAIL_USER}>`,
      to: receiverEmail,
      subject: templateName.includes("otp")
        ? "OTP for Password Reset - Scaler Shows"
        : "Your Movie Ticket - Scaler Shows",
      text: templateName.includes("otp")
        ? `Hi ${creds.name}, your reset OTP is: ${creds.otp}`
        : `Hi ${creds.name}, your ticket for ${creds.movie} is confirmed at ${creds.theatre} on ${creds.date} at ${creds.time}. Seats: ${creds.seats}. Transaction ID: ${creds.transactionId}.`,
      html: replaceContent(content, creds),
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail(emailDetails);
    console.log("✅ Email sent successfully to:", receiverEmail);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
}

module.exports = EmailHelper;
