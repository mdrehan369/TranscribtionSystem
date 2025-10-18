import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import cors from "@fastify/cors"
import logger from "./config/logger.config.js"
import fastifyEnv from "@fastify/env";
import { envOptions, type EnvConfig } from "./config/env.config.js";
import { corsOptions } from "./config/cors.config.js";
import fastifyCookie from "@fastify/cookie";

import prismaPlugin from "./plugins/prisma.plugin.js"

import MedicalInstituteController from "./modules/medicalInstitute/medicalInstitute.controller.js";
import authPlugin from "./plugins/auth.plugin.js";
import DoctorController from "./modules/doctor/doctor.controller.js";
import AuthController from "./modules/auth/auth.controller.js";
import TranscribeController from "./modules/transcribe/transcribe.controller.js";

const fastify = Fastify({ logger });

await fastify.register(fastifyMultipart);

await fastify.register(fastifyEnv, envOptions)

await fastify.register(fastifyCookie, {
  secret: fastify.getEnvs<EnvConfig>().COOKIE, // Required for signed cookies
});

await fastify.register(cors, corsOptions);

await fastify.register(prismaPlugin)
await fastify.register(authPlugin)

await fastify.register(AuthController, { prefix: "/api/v1/auth" })
await fastify.register(MedicalInstituteController, { prefix: "/api/v1/medical-institute" });
await fastify.register(DoctorController, { prefix: "/api/v1/doctor" });
await fastify.register(TranscribeController, { prefix: "/api/v1/transcribe" });

fastify.get("/", async () => {
  return { hello: "world" };
});

const start = async () => {
  try {
    const port = fastify.getEnvs<EnvConfig>().PORT || 5000
    await fastify.listen({ port });
    fastify.log.info(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

