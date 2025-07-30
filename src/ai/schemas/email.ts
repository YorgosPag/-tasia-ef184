
import { z } from 'genkit';

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
