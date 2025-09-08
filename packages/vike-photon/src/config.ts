import type { Photon } from "@photonjs/core";
import { photon } from "@photonjs/core/vite";
import type { BuildOptions } from "esbuild";
import type { Config } from "vike/types";
import { vikePhoton } from "./plugin/index.js";

export { config as default };

const config = {
  name: "vike-photon",
  require: {
    vike: ">=0.4.238",
    "vike-react": {
      version: ">=0.6.4",
      optional: true,
    },
    "vike-vue": {
      version: ">=0.9.2",
      optional: true,
    },
    "vike-solid": {
      version: ">=0.7.11",
      optional: true,
    },
  },
  vite: {
    plugins: [photon(), vikePhoton()],
  },
  // @ts-expect-error
  stream: {
    enable: null,
    type: "web",
  },
  meta: {
    server: {
      env: { config: true },
      global: true,
    },
    // +stream is defined by vike-{react,vue,solid} but we define it again here to avoid Vike throwing the "unknown config" error if the user doesn't use vike-{react,vue,solid}
    stream: {
      env: { config: true },
      isDefinedByPeerDependency: true,
    },
  },
} satisfies Config;

declare global {
  namespace Vike {
    interface Config {
      server?: Photon.Config & { standalone?: boolean | null | { esbuild: BuildOptions } };
    }
  }
}
