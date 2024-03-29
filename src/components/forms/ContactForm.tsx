"use client";
import React, { useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { sendEmail } from "@/actions/sendEmail";
import { type SendEmailResponse } from "@/actions/validators/ContactFormValidator";
import SubmitButton from "./SubmitButton";
import { toast } from "../ui/use-toast";
import { useFormState } from "react-dom";
import { TypographySmall } from "../ui/typography";
import { isObject } from "@/lib/isObject";
import clsx from "clsx";

const initialState: SendEmailResponse = {
  success: null,
  error: null,
  errorType: null,
  message: null,
};

function ContactForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [{ success, message, error, errorType }, formAction] = useFormState(
    sendEmail,
    initialState
  );

  if (success === true) {
    toast({ title: "Success", description: message, variant: "default" });
    ref.current?.reset();
  } else if (success === false && errorType === "Internal") {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }

  return (
    <form action={formAction} ref={ref} className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          className={clsx({
            "border-destructive": isObject(error) && error.name,
          })}
        />
        {isObject(error) && error.name && (
          <TypographySmall variant="destructive">{error.name}</TypographySmall>
        )}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          className={clsx({
            "border-destructive": isObject(error) && error.email,
          })}
        />
        {isObject(error) && error.email && (
          <TypographySmall variant="destructive">{error.email}</TypographySmall>
        )}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          className={clsx({
            input: true,
            "border-destructive": isObject(error) && error.message,
          })}
        />
        {isObject(error) && error.message && (
          <TypographySmall variant="destructive">
            {error.message}
          </TypographySmall>
        )}
      </div>
      <SubmitButton type="submit">Submit</SubmitButton>
    </form>
  );
}

export default ContactForm;
