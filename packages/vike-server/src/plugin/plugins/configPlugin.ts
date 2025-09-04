import type { Plugin } from 'vite'

export function configPlugin(): Plugin {
  return {
    name: 'vike-server:common-config',
    config() {
      return {
        resolve: {
          // Contains virtual modules
          noExternal: ['vike-server']
        },
        ssr: {
          optimizeDeps: {
            // Those are ESM packages, no need to optimize them
            exclude: ['vike-server', 'vike'],
            // Still optimize this dual-format dependency
            include: ['vike > @brillout/require-shim']
          }
        },
        photon: {
          // Vike does not support declaring its routes as individual Universal Handlers.
          // Settings `framework: false` signals deployment targets that each route bundles the whole app.
          // If it were `framework: true` (default), Photon considers that each route points to a Universal Handler,
          // allowing deployment targets to code-split the app, and provide better error messages when using the `addPhotonEntry` api.
          codeSplitting: {
            framework: false
          }
        }
      }
    }
  }
}
