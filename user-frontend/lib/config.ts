function numberFromEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Food24KH",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  khrPerUsd: numberFromEnv(process.env.NEXT_PUBLIC_KHR_PER_USD, 4100),
  serviceFeeRate: numberFromEnv(process.env.NEXT_PUBLIC_SERVICE_FEE_RATE, 0.02),
};
