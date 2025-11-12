import app from "./app";
import { connectMongoose } from "./core/libs/mongoose";

const DEFAULT_PORT = 3000;

// Ensure MongoDB connection is ready before starting server
connectMongoose()
  .then(() => {
    app.listen({ port: DEFAULT_PORT }, (err, address) => {
      if (err) { 
        app.log.error(err); 
        process.exit(1); 
      }
      app.log.info(`Server is running on ${address}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server - MongoDB connection error:', err);
    process.exit(1);
  });