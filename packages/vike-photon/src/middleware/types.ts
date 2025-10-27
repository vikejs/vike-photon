/** biome-ignore-all lint/suspicious/noExplicitAny: type file */
import type { RuntimeAdapterTarget } from "@universal-middleware/core";

export type VikeOptions<T = unknown> = {
  pageContext?:
    | ((req: RuntimeAdapterTarget<T>) => Record<string, any> | Promise<Record<string, any>>)
    | Record<string, any>;
  /** @deprecated Replaced by +config.js#photon.compress option, see https://vike.dev/vike-photon#compression */
  compress?: boolean | "static";
  /** @deprecated Replaced by +config.js#photon.static option, see https://vike.dev/vike-photon#static-files */
  static?: boolean | string | { root?: string; cache?: boolean };
  onError?: (err: unknown) => void;
};
