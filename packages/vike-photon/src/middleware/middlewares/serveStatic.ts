import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Get, UniversalMiddleware } from "@universal-middleware/core";
import { cloneRequest, enhance, url as getUrl } from "@universal-middleware/core";
import { getGlobalContext } from "vike/server";
import type { GlobalContextServer } from "vike/types";
import { assert } from "../../utils/assert.js";
import { isVercel } from "../../utils/isVercel.js";
import type { VikeOptions } from "../types.js";

type SirvOptions = NonNullable<Vike.Config["photon"]>["static"];
type SirvOptionsWithRoot = NonNullable<Omit<SirvOptions, "root">> & { root: string };

async function removeBaseUrl(req: Request) {
  if (!req.url) return req;
  const globalContext = (await getGlobalContext()) as GlobalContextServer;
  assert(!globalContext.isClientSide);
  const baseAssets = globalContext.baseAssets;
  // Don't choke on older Vike versions
  if (baseAssets === undefined) return req;
  const url = getUrl(req);
  let pathnameWithoutBase = url.pathname.slice(baseAssets.length);
  if (!pathnameWithoutBase.startsWith("/")) pathnameWithoutBase = `/${pathnameWithoutBase}`;

  const newUrl = new URL(pathnameWithoutBase, url.origin);
  newUrl.search = url.search;
  return cloneRequest(req, {
    url: newUrl.toString(),
  });
}

function getDefaultStaticDir() {
  const argv1 = process.argv[1];
  const entrypointDirAbs = argv1
    ? dirname(isAbsolute(argv1) ? argv1 : join(process.cwd(), argv1))
    : dirname(fileURLToPath(import.meta.url));
  return join(entrypointDirAbs, "..", "client");
}

function resolveStaticConfig(
  sirvOptions: SirvOptions | undefined,
  deprecatedStatic: VikeOptions["static"] | undefined,
): false | SirvOptionsWithRoot {
  if (deprecatedStatic || typeof deprecatedStatic === "boolean") {
    console.warn(
      "[vike-photon][warning][deprecation] Replace `getMiddlewares(...)` usage with `photon.static` setting. See https://vike.dev/vike-photon#static-files",
    );
  }

  // Disable static file serving for Vercel,
  // as it will serve static files on its own
  // See vercel.json > outputDirectory
  if (isVercel()) return false;

  if (sirvOptions === false) return false;

  if (sirvOptions === true) {
    return { root: getDefaultStaticDir() };
  }

  if (sirvOptions) {
    return {
      ...sirvOptions,
      root: sirvOptions.root ?? getDefaultStaticDir(),
    };
  }

  // Fallback to `deprecatedStatic`
  if (deprecatedStatic === false) return false;

  if (typeof deprecatedStatic === "string") {
    return { root: deprecatedStatic };
  }

  if (deprecatedStatic === true || deprecatedStatic === undefined) {
    return { root: getDefaultStaticDir() };
  }
  return {
    root: deprecatedStatic.root ?? getDefaultStaticDir(),
  };
}

export const serveStaticMiddleware = ((options?) => {
  let staticConfig: SirvOptionsWithRoot | false | null = null;
  let staticMiddleware: UniversalMiddleware | null = null;

  return enhance(
    async (request, context, runtime) => {
      if (staticConfig === null) {
        const globalContext = (await getGlobalContext()) as GlobalContextServer;
        const sirvOptions = globalContext.config.photon?.static;
        const deprecatedStaticOptions = options?.static;
        staticConfig = resolveStaticConfig(sirvOptions, deprecatedStaticOptions);
      }

      if (staticConfig === false) return;

      if (staticMiddleware === null) {
        const { default: sirv } = await import("@universal-middleware/sirv");
        const { root, ...sirvOptions } = staticConfig as SirvOptionsWithRoot;
        staticMiddleware = sirv(root, { etag: true, ...sirvOptions });
      }

      const newReq = await removeBaseUrl(request);
      return staticMiddleware(newReq, context, runtime);
    },
    {
      name: "vike-photon:sirv",
      immutable: false,
    },
  );
}) satisfies Get<[options: VikeOptions], UniversalMiddleware>;
