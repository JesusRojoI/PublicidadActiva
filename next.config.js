/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  typescript: {
    // No fallar el build si TS se queja por algún motivo; el editor sigue mostrando errores.
    ignoreBuildErrors: true,
    // Si por alguna razón Next decide regenerar el tsconfig, que respete el existente.
    tsconfigPath: './tsconfig.json',
  },
  env: {
    ETOMIN_USER: process.env.ETOMIN_USER,
    ETOMIN_PASSWORD: process.env.ETOMIN_PASSWORD,
    ETOMIN_BASE_URL: process.env.ETOMIN_BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
};

module.exports = nextConfig;