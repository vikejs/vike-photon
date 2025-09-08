import { cloudflare } from "@photonjs/cloudflare/vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";

export default {
  plugins: [react(), vike(), cloudflare()],
};
