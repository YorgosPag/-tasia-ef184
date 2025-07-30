
'use server';
/**
 * @fileOverview A Genkit flow for sending emails via SendGrid.
 */

import { ai } from '@/ai/genkit';
import sgMail from '@sendgrid/mail';
import {
  SendEmailInputSchema,
  SendEmailOutputSchema,
  type SendEmailInput,
  type SendEmailOutput,
} from '@/ai/schemas/email';

export async function sendEmail(input: SendEmailInput): Promise<SendEmailOutput> {
  return sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailInputSchema,
    outputSchema: SendEmailOutputSchema,
  },
  async (input) => {
    const apiKey = process***REMOVED***.SENDGRID_API_KEY;
    const fromEmail = process***REMOVED***.NEXT_PUBLIC_SENDGRID_FROM_EMAIL;
    const replyToEmail = process***REMOVED***.NEXT_PUBLIC_LEAD_NOTIFICATION_EMAIL;

    if (!apiKey || !fromEmail) {
      console.error('SendGrid environment variables not configured. Please check next.config.js and ***REMOVED***.local');
      return { success: false, message: 'Email service is not configured.' };
    }

    sgMail.setApiKey(apiKey);

    try {
      await sgMail.send({
        ...input,
        from: fromEmail,
        replyTo: replyToEmail || fromEmail,
      });
      return { success: true, message: 'Email sent successfully.' };
    } catch (error: any) {
      console.error('SendGrid Error:', error.response?.body || error);
      return { success: false, message: 'Failed to send email.' };
    }
  }
);
