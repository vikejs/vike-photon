import { type Photon, PhotonDependencyError } from "@photonjs/core";
import { photon } from "@photonjs/core/vite";
import type { BuildOptions } from "esbuild";
import type { Config } from "vike/types";
import type { Plugin } from "vite";
import { vikePhoton } from "./plugin/index.js";
import { createDeferred } from "./utils/deferred.js";

export { config as default };

// Dynamically load @photonjs/cloudflare plugin
const loadCloudflarePromise = createDeferred<Plugin[]>();

const _config = {
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
    get plugins() {
      if (!loadCloudflarePromise.isResolved) {
        loadCloudflarePromise.resolve([]);
      }
      return [photon(), vikePhoton(), loadCloudflarePromise.promise];
    },
  },
  // @ts-expect-error
  stream: {
    enable: null,
    type: "web",
  },
  meta: {
    photon: {
      env: { config: true },
      global: true,
    },
    cloudflare: {
      env: { config: true },
      effect({ configValue }) {
        if (configValue) {
          loadCloudflarePromise.resolve(dynamicallyLoadCloudflare(configValue));
        }
        return {};
      },
    },
    // +stream is defined by vike-{react,vue,solid} but we define it again here to avoid Vike throwing the "unknown config" error if the user doesn't use vike-{react,vue,solid}
    stream: {
      env: { config: true },
      isDefinedByPeerDependency: true,
    },
  },
} satisfies Config;

const config = _config as Omit<typeof _config, "stream">;

type CloudflareConfig = Parameters<typeof import("@photonjs/cloudflare/vite").cloudflare>[0];

async function dynamicallyLoadCloudflare(cloudflareConfig?: CloudflareConfig) {
  const { cloudflare } = await import("@photonjs/cloudflare/vite").catch((e) => {
    throw new PhotonDependencyError(`Please install @photonjs/cloudflare to use +cloudflare configuration.`, {
      cause: e,
    });
  });
  return cloudflare(cloudflareConfig);
}

declare global {
  namespace Vike {
    interface Config {
      photon?: Photon.Config & { standalone?: boolean | null | { esbuild: BuildOptions } };
      cloudflare?: CloudflareConfig;
    }
  }
}
