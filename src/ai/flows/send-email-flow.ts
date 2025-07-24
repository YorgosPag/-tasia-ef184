
'use server';
/**
 * @fileOverview A Genkit flow for sending emails via SendGrid.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import sgMail from '@sendgrid/mail';

export const SendEmailInputSchema = z.object({
  to: z.string().email().describe('The recipient email address.'),
  subject: z.string().describe('The subject of the email.'),
  text: z.string().describe('The plain text content of the email.'),
  html: z.string().describe('The HTML content of the email.'),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export const SendEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;


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

    if (!apiKey || !fromEmail || !replyToEmail) {
      console.error('SendGrid environment variables not configured. Please set SENDGRID_API_KEY, NEXT_PUBLIC_SENDGRID_FROM_EMAIL, and NEXT_PUBLIC_LEAD_NOTIFICATION_EMAIL.');
      return { success: false, message: 'Email service is not configured.' };
    }

    sgMail.setApiKey(apiKey);

    try {
      await sgMail.send({
        ...input,
        from: fromEmail,
        replyTo: replyToEmail,
      });
      return { success: true, message: 'Email sent successfully.' };
    } catch (error: any) {
      console.error('SendGrid Error:', error.response?.body || error);
      return { success: false, message: 'Failed to send email.' };
    }
  }
);
