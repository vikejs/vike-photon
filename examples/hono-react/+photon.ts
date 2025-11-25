// https://vike.dev/vike-photon
import type { Config } from "vike/types";

export default {
  server: "./server/index",
  // Build
  standalone: {
    singlefile: true,
  },
} satisfies Config["photon"];
