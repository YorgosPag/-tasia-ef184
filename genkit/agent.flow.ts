import { flow, z } from '@genkit-ai/core';
import { generateText } from '@genkit-ai/googleai';

export const askAgent = flow(
  {
    name: 'askAgent',
    inputSchema: z.object({
      prompt: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ prompt }) => {
    const result = await generateText({
      model: 'models/gemini-pro',
      prompt,
    });

    return result.text || '🤷 Δεν έχω απάντηση.';
  }
);
