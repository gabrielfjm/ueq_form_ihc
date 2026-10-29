import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  globalTeardown: "./tests/e2e/limpeza.ts",
  // o servidor de desenvolvimento compila cada rota na primeira visita e fica lento com a suíte inteira
  // rodando; 15 s de espera e 4 workers evitam falhas que são só de tempo
  expect: { timeout: 15_000 },
  // os fluxos do participante criam um estudo antes e passam dos 30 s padrão no servidor de dev
  timeout: 60_000,
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    locale: "pt-BR",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
