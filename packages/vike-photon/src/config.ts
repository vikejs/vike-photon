import type { Photon as PhotonCore } from "@photonjs/core";
import { photon } from "@photonjs/core/vite";
import type { RuntimeAdapterTarget } from "@universal-middleware/core";
import standaloner from "standaloner/vite";
import type { Config } from "vike/types";
import { type PluginInterop, vikePhoton } from "./plugin/index.js";
import { createDeferred } from "./utils/deferred.js";
import { isDependencyInstalledByUser } from "./utils/isDependencyInstalledByUser.js";

export { config as default };

const loadStandalonePlugin = createDeferred<PluginInterop[]>();
const vikePhotonOptions: Parameters<typeof vikePhoton>[0] = {};

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
    get plugins() {
      if (!loadStandalonePlugin.isResolved) {
        loadStandalonePlugin.resolve([]);
      }
      return [photon(), vikePhoton(vikePhotonOptions), loadStandalonePlugin.promise];
    },
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
      env: { server: true, config: true },
      global: true,
      effect({ configValue }) {
        if (typeof configValue === "object" && configValue !== null) {
          // target
          if ("target" in configValue) {
            // biome-ignore lint/suspicious/noExplicitAny: cast
            vikePhotonOptions.target = configValue.target as any;
          }
          // standalone
          if ("standalone" in configValue && configValue.standalone) {
            if (typeof configValue.standalone === "object") {
              if ("esbuild" in configValue.standalone) {
                console.warn(
                  "[vike-photon][warning] 'photon.standalone.esbuild' is not supported anymore. Refer to https://github.com/nitedani/standaloner/tree/main/standaloner for supported options",
                );
              }

              // biome-ignore lint/suspicious/noExplicitAny: cast
              loadStandalonePlugin.resolve(standaloner(configValue.standalone as any) as PluginInterop[]);
            } else {
              loadStandalonePlugin.resolve(standaloner() as PluginInterop[]);
            }
          } else {
            loadStandalonePlugin.resolve([]);
          }
        }
        return undefined;
      },
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
    type StandaloneOptions = NonNullable<
      Parameters<typeof import("@photonjs/runtime/vite")["photon"]>[0]
    >["standalone"];

    interface Config {
      photon?: PhotonCore.Config & {
        standalone?: boolean | StandaloneOptions;
        compress?: boolean | "static";
        static?: boolean | (import("@universal-middleware/sirv").ServeOptions & { root?: string });
      };

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
