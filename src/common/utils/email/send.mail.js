import nodemailer from "nodemailer";
import { APPKICATION_NAME, EMAIL_APP, EMAIL_APP_PASSWORD } from "../../../../config/config.service.js";

export const sendEmail = async ({
    to,
    cc,
    bcc,
    subject,
    html,
    attachements=[]
}={}) =>{
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_APP,
        pass: EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"${APPKICATION_NAME}" <${EMAIL_APP}>`, 
      to,
      cc,
      bcc,
      subject,
      html,
      attachements
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}