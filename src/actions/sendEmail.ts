"use server";
import { createTransport } from "nodemailer";
import { z } from "zod";

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

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  message: z.string().min(10, { message: "Please elaborate your message" }),
});

type FlattenedErrors = z.inferFlattenedErrors<typeof FormSchema>;

enum ErrorType {
  Internal = "Internal",
  ZodFieldErrors = "ZodFieldErrors",
}

type SendEmailResponse = {
  success: boolean | null; // Whether the email was sent successfully
  error?: string | FlattenedErrors["fieldErrors"] | null; // If success is false, this will be the error object or string
  errorType?: ErrorType | null; // If success is false, this will be the type of error
  message?: string | null; // Message (success/failure) should be displayed to the user
};

export async function sendEmail(
  prevState: SendEmailResponse,
  formData: FormData
): Promise<SendEmailResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const validatedData = FormSchema.safeParse({ name, email, message });

  if (!validatedData.success) {
    const flattenedErrors: FlattenedErrors = validatedData.error.flatten();
    return {
      success: false,
      error: flattenedErrors.fieldErrors,
      errorType: ErrorType.ZodFieldErrors,
    };
  }

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
    return {
      success: true,
      message: "Thank you for the message!",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Something went wrong!",
      errorType: ErrorType.Internal,
      message: "Something went wrong!",
    };
  }
}
