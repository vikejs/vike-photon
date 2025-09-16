import type { Plugin } from "vite";

// biome-ignore lint/suspicious/noExplicitAny: any
export type PluginContext = ThisParameterType<Extract<Plugin["resolveId"], (...args: never) => any>>;
