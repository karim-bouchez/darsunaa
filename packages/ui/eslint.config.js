import baseConfig from "@darsunaa/eslint-config/base";
import reactConfig from "@darsunaa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
