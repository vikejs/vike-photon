import { apply, serve } from "@photonjs/express";
import express from "express";

function startServer() {
  const app = express();
  apply(app);
  const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

  return serve(app, { port });
}

export default startServer();
