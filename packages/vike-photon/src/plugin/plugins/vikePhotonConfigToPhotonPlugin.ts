import { getVikeConfig } from "vike/plugin";
import type { Plugin } from "vite";

// Forward config from Vike to Photon
export function vikePhotonConfigToPhotonPlugin(): Plugin {
  return {
    name: "vike-photon:to-photon-config",
    config(userConfig) {
      const vikeConfig = getVikeConfig(userConfig);

      if (vikeConfig.config.photon) {
        const { standalone: _, ...photonConfig } = vikeConfig.config.photon;

        return {
          photon: photonConfig,
        };
      }
    },
  };
}
