/** biome-ignore-all lint/suspicious/noExplicitAny: type file */
import type { RuntimeAdapterTarget } from "@universal-middleware/core";

export type VikeOptions<T = unknown> = {
  pageContext?:
    | ((req: RuntimeAdapterTarget<T>) => Record<string, any> | Promise<Record<string, any>>)
    | Record<string, any>;
  compress?: boolean | "static";
  /** @deprecated Replaced by +config.js#photon.sirv option, see vike-photon#sirv */
  static?: boolean | string | { root?: string; cache?: boolean };
  onError?: (err: unknown) => void;
};
