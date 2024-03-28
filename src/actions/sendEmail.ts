"use server";
import { createTransport } from "nodemailer";

const RECEIVING_EMAIL = process.env.RECEIVING_EMAIL as string;
const SENDING_EMAIL = process.env.SENDING_EMAIL as string;
const SENDING_EMAIL_PASSWORD = process.env.SENDING_EMAIL_PASSWORD as string;

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDING_EMAIL,
    pass: SENDING_EMAIL_PASSWORD,
  },
});

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const mailOptions = {
    from: { name: "Contact Me", address: SENDING_EMAIL },
    to: RECEIVING_EMAIL,
    replyTo: email,
    subject: `${name} <${email}>`,
    text: message,
    html: `
      <div>${message.replace(/\n/g, "<br>")}</div>
    `,
  };

  try {
    const sentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", JSON.stringify(sentMessageInfo, null, 2));
    return { error: null, message: "Thank you for the message!" };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong!", message: null };
  }
}
