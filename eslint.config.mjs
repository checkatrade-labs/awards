import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Limit files to 200 lines to ensure components are focused and maintainable
      "max-lines": ["error", {
        max: 200,
        skipBlankLines: true,
        skipComments: true
      }]
    }
  }
];

export default eslintConfig;
