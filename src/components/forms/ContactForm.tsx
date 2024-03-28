"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { sendEmail } from "@/actions/sendEmail";
import SubmitButton from "./SubmitButton";
import { useToast } from "../ui/use-toast";

function ContactForm() {
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    const { error, message } = await sendEmail(formData);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: message, variant: "default" });
    }
  };

  return (
    <form action={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="John Doe" />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          className="input"
        />
      </div>
      <SubmitButton type="submit">Submit</SubmitButton>
    </form>
  );
}

export default ContactForm;
