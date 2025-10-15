import path from "node:path";
import { type PackageJson, readPackage } from "pkg-types";
import { getVikeConfig } from "vike/plugin";
import { normalizePath, type PluginOption } from "vite";
import { setTargetVercel } from "../../targets/vercel/index.js";

function isDependencyInstalledByUser(localPackage: PackageJson, pkg: string) {
  for (const prop of ["devDependencies", "dependencies"]) {
    if (localPackage[prop] && Object.keys(localPackage[prop]).includes(pkg)) {
      return true;
    }
  }
  return false;
}

export async function targetsPlugin(): Promise<PluginOption[] | undefined> {
  const localPackage = await readPackage();

  if (isDependencyInstalledByUser(localPackage, "@photonjs/cloudflare")) {
    return await import("@photonjs/cloudflare/vite").then((p) => p.cloudflare());
  }

  if (isDependencyInstalledByUser(localPackage, "@photonjs/vercel")) {
    const vpv = await import("@photonjs/vercel/vite").then((p) => p.vercel());
    const { getVercelAPI } = await import("@photonjs/vercel/api");

    let vikePrerenderOutdir: string | undefined;

    return [
      ...vpv,
      {
        name: "vike-photon:vercel:setup",
        apply: "build",

        buildStart: {
          order: "pre",
          handler() {
            // biome-ignore lint/suspicious/noExplicitAny: TODO PluginContext type should be simplified
            const api = getVercelAPI(this as any);
            // Override `@photonjs/vercel` config
            api.defaultSupportsResponseStreaming = true;
          },
        },
      },
      // Read +config values from +Page files, and compute `vercel` property on each entry
      {
        name: "vike-photon:vercel:entries",
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
      // Copy assets to vercel_client outDir
      {
        name: "vike-photon:vercel:prerender-read-config",
        apply: "build",

        applyToEnvironment(env) {
          return env.name === "client";
        },

        closeBundle: {
          order: "post",
          handler() {
            // Read outDir while in client env, where prerendering is executed
            vikePrerenderOutdir = normalizePath(
              path.isAbsolute(this.environment.config.build.outDir)
                ? this.environment.config.build.outDir
                : path.posix.join(this.environment.config.root, this.environment.config.build.outDir),
            );
          },
        },

        sharedDuringBuild: true,
      },
      {
        name: "vike-photon:vercel:prerender",
        apply: "build",

        applyToEnvironment(env) {
          return env.name === "vercel_client";
        },

        buildStart() {
          const vikeConfig = getVikeConfig(this.environment.config);
          if (vikeConfig?.prerenderContext?.output && vikePrerenderOutdir) {
            for (const file of vikeConfig.prerenderContext.output) {
              const is404 = Boolean(file.pageContext.is404);
              const key = is404 ? "404.html" : normalizePath(file.filePath).substring(vikePrerenderOutdir.length + 1);

              // Emit static HTML files in `vercel_client` env
              this.emitFile({
                type: "asset",
                fileName: key,
                originalFileName: key,
                source: file.fileContent,
              });
            }
          }
        },

        sharedDuringBuild: true,
      },
    ];
  }
}
