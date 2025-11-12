import app from "./app";

const DEFAULT_PORT = 3000;
app.listen({ port: DEFAULT_PORT }, (err, address) => {
  if (err) { app.log.error(err); process.exit(1); }
  app.log.info(`Server is running on ${address}`);
}
);