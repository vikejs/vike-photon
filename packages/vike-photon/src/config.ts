import type { Photon } from "@photonjs/core";
import { photon } from "@photonjs/core/vite";
import type { RuntimeAdapterTarget } from "@universal-middleware/core";
import type { BuildOptions } from "esbuild";
import type { Config } from "vike/types";
import { vikePhoton } from "./plugin/index.js";
import { isDependencyInstalledByUser } from "./utils/isDependencyInstalledByUser.js";

export { config as default };

const _config = {
  name: "vike-photon" as const,
  require: {
    vike: ">=0.4.244" as const,
    "vike-react": {
      version: ">=0.6.4" as const,
      optional: true,
    },
    "vike-vue": {
      version: ">=0.9.2" as const,
      optional: true,
    },
    "vike-solid": {
      version: ">=0.7.11" as const,
      optional: true,
    },
  },
  vite: {
    plugins: [photon(), vikePhoton()],
  },
  // @ts-expect-error Defined by vike-react/vike-vue/vike-solid (see comment below)
  stream: {
    enable: null,
    type: "web" as const,
  },
  cli: {
    async preview() {
      if (await isDependencyInstalledByUser("@photonjs/cloudflare")) {
        return "vite";
      }
      if (await isDependencyInstalledByUser("@photonjs/vercel")) {
        return false;
      }
      return undefined;
    },
  },
  meta: {
    // +stream is defined by vike-{react,vue,solid} but we define it again here to avoid Vike throwing the "unknown config" error if the user doesn't use vike-{react,vue,solid}
    stream: {
      isDefinedByPeerDependency: true,
    },
    photon: {
      env: { config: true },
      global: true,
    },

    // Vercel configs
    isr: {
      env: { server: true, config: true },
      eager: true,
      effect({ configValue }) {
        // an actual ISR value exists for a Page, so we disable prerendering for it
        if (configValue) {
          return {
            prerender: false,
          };
        }
      },
    },
    edge: {
      env: { server: true, config: true },
      eager: true,
    },
  },
} satisfies Config;

const config = _config as Omit<typeof _config, "stream">;

declare global {
  namespace Vike {
    interface Config {
      photon?: Photon.Config & { standalone?: boolean | null | { esbuild: BuildOptions } };

      // Vercel
      isr?: boolean | { expiration: number };
      edge?: boolean;
    }

    interface Photon {
      // server: 'express' | 'hono' | ...
    }

    interface PageContextServer {
      runtime: RuntimeAdapterTarget<Photon extends { server: string } ? Photon["server"] : "srvx">;
    }
  }
}
