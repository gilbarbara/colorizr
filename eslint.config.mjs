import { base, vitest } from '@gilbarbara/eslint-config';

export default [
  ...base,
  ...vitest,
  {
    rules: {
      'sort-destructure-keys/sort-destructure-keys': 'off',
    },
  },
];
