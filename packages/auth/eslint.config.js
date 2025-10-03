import baseConfig, { restrictEnvAccess } from "@darsunaa/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["script/**"],
  },
  ...baseConfig,
  ...restrictEnvAccess,
];
