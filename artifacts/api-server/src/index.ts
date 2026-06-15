import app from "./app";
import { logger } from "./lib/logger";
import { ensureSeed } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

ensureSeed()
  .then(() => {
    logger.info("Seed complete");
  })
  .catch((err) => {
    logger.warn({ err }, "Seed failed — continuing anyway");
  });

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
