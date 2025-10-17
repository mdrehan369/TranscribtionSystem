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

const fastify = Fastify({ logger });

await fastify.register(fastifyMultipart);

await fastify.register(fastifyEnv, envOptions)

await fastify.register(cors, corsOptions);

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

