import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  message: z.string().min(10, { message: "Please elaborate your message" }),
});

export type ContactFormFlattenedErrors = z.inferFlattenedErrors<
  typeof ContactFormSchema
>;

export enum ContactFormErrorType {
  Internal = "Internal",
  ZodFieldErrors = "ZodFieldErrors",
}

export type SendEmailResponse = {
  success: boolean | null; // Whether the email was sent successfully
  error?: string | ContactFormFlattenedErrors["fieldErrors"] | null; // If success is false, this will be the error object or string
  errorType?: ContactFormErrorType | null; // If success is false, this will be the type of error
  message?: string | null; // Message (success/failure) should be displayed to the user
};
