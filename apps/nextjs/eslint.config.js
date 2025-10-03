import baseConfig, { restrictEnvAccess } from "@darsunaa/eslint-config/base";
import nextjsConfig from "@darsunaa/eslint-config/nextjs";
import reactConfig from "@darsunaa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
