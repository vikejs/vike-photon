import type { Photon } from "@photonjs/core";
import { photon } from "@photonjs/core/vite";
import type { BuildOptions } from "esbuild";
import type { Config } from "vike/types";
import { vikePhoton } from "./plugin/index.js";
import type { CloudflareConfig } from "./targets/cloudflare/index.js";

export { config as default };

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
    plugins: [photon(), vikePhoton()],
  },
  // @ts-expect-error
  stream: {
    enable: null,
    type: "web",
  },
  meta: {
    // +stream is defined by vike-{react,vue,solid} but we define it again here to avoid Vike throwing the "unknown config" error if the user doesn't use vike-{react,vue,solid}
    stream: {
      env: { config: true },
      isDefinedByPeerDependency: true,
    },
    photon: {
      env: { config: true },
      global: true,
    },
    // Cloudflare configs
    cloudflare: {
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
    // FIXME
    headers: {
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

      // Cloudflare
      cloudflare?: CloudflareConfig;

      // Vercel
      isr?: boolean | { expiration: number };
      edge?: boolean;
      // TODO reuse +headersResponse https://vike.dev/headersResponse
      headers?: Record<string, string>;
    }
  }
}
