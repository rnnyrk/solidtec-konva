import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config.js';

export function getTheme() {
  return resolveConfig(tailwindConfig).theme;
}
