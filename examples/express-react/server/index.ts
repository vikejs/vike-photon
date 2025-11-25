import { apply, serve } from "@photonjs/express";
import express from "express";

function startServer() {
  const app = express();
  apply(app);

  return serve(app);
}

export default startServer();
