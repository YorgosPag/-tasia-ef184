import { defineConfig } from '@genkit-ai/core';
import { googleGenerativeAI } from '@genkit-ai/googleai';

export default defineConfig({
  plugins: [googleGenerativeAI()],
  flows: [],
});
