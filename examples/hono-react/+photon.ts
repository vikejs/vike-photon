// https://vike.dev/vike-photon
import type { Config } from "vike/types";

export default {
  server: "./server/index",
  // Build
  standalone: {
    bundle: true,
  },
} satisfies Config["photon"];
