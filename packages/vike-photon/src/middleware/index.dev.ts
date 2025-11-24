import type { UniversalMiddleware } from "@universal-middleware/core";
import { renderPageHandler } from "./middlewares/vike.js";
import type { VikeOptions } from "./types.js";

export function getMiddlewares<T = unknown>(options?: VikeOptions<T>): UniversalMiddleware[] {
  return [renderPageHandler(options)];
}

export default getMiddlewares();
