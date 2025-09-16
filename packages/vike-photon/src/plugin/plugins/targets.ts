import { isPackageExists } from "local-pkg";
import type { PluginOption } from "vite";
import { setTargetVercel } from "../../targets/vercel/index.js";

export async function targetsPlugin(): Promise<PluginOption[] | undefined> {
  if (isPackageExists("@photonjs/cloudflare")) {
    return await import("@photonjs/cloudflare/vite").then((p) => p.cloudflare());
  }

  if (isPackageExists("vite-plugin-vercel")) {
    const vpv = await import("vite-plugin-vercel").then((p) => p.vercel());

    return [
      ...vpv,
      // Read +config values from +Page files, and compute `vercel` property on each entry
      {
        name: "vike-photon:vercel",
        apply: "build",

        applyToEnvironment(env) {
          return env.name === "ssr";
        },

        buildStart: {
          handler() {
            setTargetVercel(this);
          },
        },

        sharedDuringBuild: true,
      },
    ];
  }
}
