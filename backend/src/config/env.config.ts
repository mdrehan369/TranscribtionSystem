const schema = {
  type: "object",
  required: [],
  properties: {
    PORT: {
      type: "string",
      default: 5000,
    },
    HOST: {
      type: "string",
      default: "0.0.0.0",
    },
    COOKIE: {
      type: "string",
      default: "supersecretcookiekey",
    },
    FRONTEND_URL: {
      type: "string",
      default: "http://localhost:3000",
    },
    TRANSCRIBER_URL: {
      type: "string",
      default: "http://localhost:8000",
    },
    JWT_SECRET_KEY: {
      type: "string",
      default: "secret"
    }
  },
};

export type EnvConfig = {
  PORT: number;
  HOST: string;
  COOKIE: string;
  FRONTEND_URL: string;
  TRANSCRIBER_URL: string;
  JWT_SECRET_KEY: string;
};

export const envOptions = {
  confKey: "config", // optional, default: 'config'
  schema: schema,
  dotenv: true,
};
