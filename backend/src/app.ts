import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fs from "fs";
import type { FastifyReply, FastifyRequest } from "fastify";
import { pipeline } from "stream/promises";
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

fastify.get("/", async () => {
  return { hello: "world" };
});

fastify.post(
  "/upload",
  async function upload(request: FastifyRequest, reply: FastifyReply) {
    fastify.log.info("Request Incoming for file upload")
    const file = await request.file();

    fastify.log.info(file?.filename)

    if (!file) return reply.status(400).send({ success: false, message: "File not send!" })

    await pipeline(file.file, fs.createWriteStream(file.filename))

    return reply.send({ success: true, message: "File uploaded successfully" });
  }
);

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

