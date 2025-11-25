import { apply, serve } from "@photonjs/hono";
import { Hono } from "hono";

function startServer() {
  const app = new Hono();
  apply(app);

  return serve(app);
}

export default startServer();
