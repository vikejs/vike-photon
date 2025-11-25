import { installPhoton } from "@photonjs/runtime/vite";
import { getVikeConfig } from "vike/plugin";
import type { PluginOption } from "vite";
import { configPlugin } from "./plugins/configPlugin.js";
import { routesPlugins } from "./plugins/routes.js";
import { serverEntryPlugin } from "./plugins/serverEntryPlugin.js";
import { setPhotonMeta } from "./plugins/setPhotonMeta.js";
import { targetsPlugin } from "./plugins/targets.js";
import { vikePhotonConfigToPhotonPlugin } from "./plugins/vikePhotonConfigToPhotonPlugin.js";

export { vikePhoton, vikePhoton as default };

export type PluginInterop = Record<string, unknown> & { name: string };
function vikePhoton(): (PluginInterop | Promise<PluginInterop | PluginInterop[]>)[] {
  return [
    configPlugin(),
    vikePhotonConfigToPhotonPlugin(),
    ...serverEntryPlugin(),
    setPhotonMeta(),
    ...installPhoton("vike-photon", {
      resolveMiddlewares() {
        // biome-ignore lint/suspicious/noExplicitAny: cast
        const vikeConfig = getVikeConfig((this as any).environment.config);

        // Absolute path to +middleware files
        const plusMiddleware = (
          vikeConfig.dangerouslyUseInternals._pageConfigGlobal.configValueSources.middleware ?? []
        )
          .map((m) => {
            if ("filePathAbsoluteFilesystem" in m.definedAt) {
              return m.definedAt.filePathAbsoluteFilesystem;
            }
            return null;
          })
          .filter(Boolean) as string[];

        return [...plusMiddleware, "vike-photon/universal-middlewares"];
      },
    }),
    ...routesPlugins(),
    targetsPlugin(),
    // biome-ignore lint/suspicious/noExplicitAny: cast
  ] satisfies PluginOption as any;
}
