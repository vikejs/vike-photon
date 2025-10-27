import compressMiddlewareFactory from "@universal-middleware/compress";
import { enhance, type Get, type UniversalMiddleware, url } from "@universal-middleware/core";
import { getGlobalContext } from "vike/server";
import type { GlobalContextServer } from "vike/types";
import { isVercel } from "../../utils/isVercel.js";
import type { VikeOptions } from "../types.js";

export const compressMiddleware = ((options?) =>
  enhance(
    async (request, _context) => {
      const globalContext = (await getGlobalContext()) as GlobalContextServer;
      const compressOptions = globalContext.config.photon?.compress;
      const deprecatedCompressOptions = options?.compress;
      const compressionType = resolveCompressConfig(compressOptions, deprecatedCompressOptions);

      if (compressionType === false || process.env.NODE_ENV !== "production") return;

      const compressMiddlewareInternal = compressMiddlewareFactory()(request);

      return async (response) => {
        const isAsset = url(request).pathname.startsWith("/assets/");
        const shouldCompressResponse = compressionType === true || (compressionType === "static" && isAsset);
        if (shouldCompressResponse) {
          return compressMiddlewareInternal(response);
        }
      };
    },
    {
      name: "vike-photon:compress",
      immutable: false,
    },
  )) satisfies Get<[options: VikeOptions], UniversalMiddleware>;

function resolveCompressConfig(
  compressOptions: boolean | "static" | undefined,
  deprecatedCompressOptions: boolean | "static" | undefined,
): boolean | "static" {
  if (typeof compressOptions !== "undefined") {
    return compressOptions;
  }

  if (typeof deprecatedCompressOptions !== "undefined") {
    console.warn(
      "[vike-photon][warning][deprecation] Replace `getMiddlewares(...)` usage with `photon.compress` setting. See https://vike.dev/vike-photon#compression",
    );

    return deprecatedCompressOptions;
  }

  return !isVercel();
}
