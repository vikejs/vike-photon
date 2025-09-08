import type { Plugin } from "vite";

export function setPhotonMeta(): Plugin {
  return {
    name: "vike-photon:set-photon-meta",
    transform: {
      filter: {
        id: [/\+middleware\.[jt]s/],
      },
      handler(_code, id) {
        // Forces full-reload on server side when a +middleware file is modified
        return { meta: { photonConfig: { isGlobal: true } } };
      },
    },
  };
}
