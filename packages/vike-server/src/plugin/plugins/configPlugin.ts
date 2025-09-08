import type { Plugin } from 'vite'

export function configPlugin(): Plugin {
  return {
    name: 'vike-photon:common-config',
    config() {
      return {
        resolve: {
          // Contains virtual modules
          noExternal: ['vike-photon']
        },
        ssr: {
          optimizeDeps: {
            // Those are ESM packages, no need to optimize them
            exclude: ['vike-photon', 'vike'],
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
        },
        builder: {
          // Override Vike's buildApp, because it exit(0)
          async buildApp(builder) {
            if (builder.environments.client) {
              await builder.build(builder.environments.client)
            }
            if (builder.environments.ssr) {
              await builder.build(builder.environments.ssr)
            }
          }
        }
      }
    }
  }
}
