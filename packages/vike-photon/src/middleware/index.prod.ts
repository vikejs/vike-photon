import type { UniversalMiddleware } from "@universal-middleware/core";
import { compressMiddleware } from "./middlewares/compress.js";
import { serveStaticMiddleware } from "./middlewares/serveStatic.js";
import { renderPageHandler } from "./middlewares/vike.js";
import type { VikeOptions } from "./types.js";

export function getMiddlewares<T = unknown>(options?: VikeOptions<T>): UniversalMiddleware[] {
  return [compressMiddleware(options), serveStaticMiddleware(options), renderPageHandler(options)];
}

export default getMiddlewares();
