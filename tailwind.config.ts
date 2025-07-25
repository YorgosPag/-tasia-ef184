// This is a workaround for dynamic configs.
// In a real-world scenario, you might have different build processes
// or use environment variables to switch between configurations.
// For this environment, we'll merge the content paths and rely on CSS scoping.

import tasiaConfig from './src/tasia/theme/tailwind.config.tasia';
import nestorConfig from './src/nestor/theme/tailwind.config.nestor';

const mergedConfig = {
  ...tasiaConfig, // Use one as the base
  // Combine content paths from both configs to ensure all files are scanned
  content: [
    ...tasiaConfig.content,
    ...nestorConfig.content,
  ]
};

export default mergedConfig;
