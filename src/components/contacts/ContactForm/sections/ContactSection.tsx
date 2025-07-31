"use client";

import React from "react";
import { PhoneFieldSet } from "./contact/PhoneFieldSet";
import { EmailFieldSet } from "./contact/EmailFieldSet";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "@/lib/validation/contactSchema";

interface ContactSectionProps {
  form: UseFormReturn<ContactFormValues>;
}

export function ContactSection({ form }: ContactSectionProps) {
  return (
    <div className="space-y-6 p-1 pt-4">
      <EmailFieldSet form={form} />
      <PhoneFieldSet form={form} />
    </div>
  );
}
