import { defineConfig } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

export default defineConfig({
  plugins: [googleAI({
    apiVersion: "v1beta"
  })],
  flows: [],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});
