// This is a workaround for dynamic configs.
// In a real-world scenario, you might have different build processes
// or use environment variables to switch between configurations.
// For this environment, we'll merge the content paths and rely on CSS scoping.

import tasiaConfig from './src/tasia/theme/tailwind.config.tasia';
import ecoConfig from './src/eco/theme/tailwind.config.eco';

const mergedConfig = {
  ...tasiaConfig, // Use one as the base
  content: [
    ...tasiaConfig.content,
    ...ecoConfig.content,
  ]
};

export default mergedConfig;
