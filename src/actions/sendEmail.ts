"use server";
import { createTransport } from "nodemailer";

const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const mailOptions = {
    from: SENDER_EMAIL,
    to: SENDER_EMAIL,
    subject: `[Contact Me] ${name} <${email}>`,
    text: `${message} | Reply to: ${email}`,
    html: `
      <div>${message.replace(/\n/g, "<br>")}</div>
      <p>Reply to: ${email}</p>
    `,
  };

  try {
    const sentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", sentMessageInfo);
    return { error: null, message: "Thank you for the message!" };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong!", message: null };
  }
}
