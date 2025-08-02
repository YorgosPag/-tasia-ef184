import { defineFlow } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";

export const ask = defineFlow(
  {
    name: "ask",
    inputSchema: "string",
    outputSchema: "string",
  },
  async (input) => {
    const model = googleAI.generativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(input);
    return result.response.text();
  }
);
