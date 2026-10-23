import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // O seed roda no terminal: a saída é o resultado dele, não log esquecido
    files: ["prisma/**"],
    rules: { "no-console": "off" },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "src/generated/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
