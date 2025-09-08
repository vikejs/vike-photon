import { addPhotonEntry } from "@photonjs/core/api";
import { getVikeConfig } from "vike/plugin";
import type { Plugin } from "vite";
import { pageNamePrefix } from "../../api.js";

// Here, we programatically declare all Vike's routes into Photon
// Further vike-* packages, like vike-vercel, can update those entries (for instance, setting vercel specific metadata)
export function routesPlugins(): Plugin[] {
  return [
    {
      name: "vike-photon:routes:build",
      apply: "build",

      applyToEnvironment(env) {
        return env.name === "ssr";
      },

      buildStart: {
        // Prefer to add new entries as soon as possible, giving some room for other plugins to interact with
        order: "pre",
        handler() {
          const vikeConfig = getVikeConfig(this.environment.config);

          for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
            const name = `${pageNamePrefix}${pageId}`;
            // Convert Vike's routes to rou3 format
            // For conversions from popular formats, see https://www.npmjs.com/package/convert-route
            const route = typeof page.route === "string" ? getParametrizedRoute(page.route) : null;
            addPhotonEntry(this, name, {
              route: route ?? undefined,
              // Tell the API that this route is compatible with `codeSplitting.framework: false`
              type: "server-config",
              // Additional meta that can be used by other vike-* packages to update the entry
              vikeMeta: {
                pageId,
                page,
              },
            });
          }
        },
      },

      sharedDuringBuild: true,
    },
  ];
}

function getSegmentRou3(segment: string): string {
  if (segment.startsWith("@")) {
    return `/:${segment.slice(1)}`;
  }
  if (segment === "*") {
    return "/**";
  }
  return `/${segment}`;
}

function getParametrizedRoute(route: string): string {
  const segments = (route.replace(/\/$/, "") || "/").slice(1).split("/");
  return segments.map(getSegmentRou3).join("");
}
