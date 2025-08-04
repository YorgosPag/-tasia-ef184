import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

export default genkit({
  plugins: [googleAI({
    apiVersion: "v1beta"
  })],
  flows: [],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
