import { cloudflare } from "@photonjs/cloudflare/vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import vikePhoton from "vike-photon/plugin";

export default {
  plugins: [react(), vike(), vikePhoton(), cloudflare()],
};
