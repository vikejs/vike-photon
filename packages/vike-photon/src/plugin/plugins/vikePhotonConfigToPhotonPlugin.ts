import { accessSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
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

        if (photonConfig.server) {
          const serverPath = typeof photonConfig.server === "string" ? photonConfig.server : photonConfig.server.id;
          const possiblePaths: string[] = [serverPath];

          if (!serverPath.startsWith("..")) {
            // Try to resolve server path from project's root folder
            possiblePaths.push(join(userConfig.root ?? process.cwd(), serverPath));
          }

          if (!isAbsolute(serverPath)) {
            // biome-ignore lint/suspicious/noExplicitAny: internal Vike types
            const photonConfigUser: any = (vikeConfig as any)._pageConfigGlobal?.configValueSources?.photon?.[0];

            if (photonConfigUser.definedAt.filePathAbsoluteFilesystem && photonConfigUser?.value?.server) {
              // Try to resolve server path relative to config path
              possiblePaths.push(join(dirname(photonConfigUser.definedAt.filePathAbsoluteFilesystem), serverPath));
            }

            for (const possiblePath of possiblePaths) {
              try {
                accessSync(possiblePath);

                if (typeof photonConfig.server === "string") {
                  photonConfig.server = possiblePath;
                } else {
                  photonConfig.server.id = possiblePath;
                }

                // exit for-loop
                break;
              } catch {
                // only testing if file exists, so we ignore errors
              }
            }
          }
        }

        return {
          photon: photonConfig,
        };
      }
    },
  };
}
