import type { CookieSerializeOptions } from "@fastify/cookie";

export const AUTH_TOKEN = "auth_token"

export const cookieOptions: CookieSerializeOptions = {
  // Sets the SameSite attribute to 'None'
  // This allows the cookie to be sent with cross-origin requests, like from a front-end on a different port.
  sameSite: "none",

  // The 'Secure' flag must be set to 'true' if SameSite is 'none'.
  // However, `localhost` is considered a secure context, so browsers will accept this over HTTP.
  // In production, your server should be using HTTPS, so this value would remain `true`.
  secure: true,

  // This prevents client-side JavaScript from accessing the cookie.
  // It's a key security measure that you should use in both dev and production.
  httpOnly: true,

  // Sets the cookie's path to the root domain.
  // This ensures the cookie is sent with all requests to your application.
  path: '/',
  // Set an expiration for persistent cookies, for example, 1 day.
  // This is a good practice even in dev to test session expiration.
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
};
