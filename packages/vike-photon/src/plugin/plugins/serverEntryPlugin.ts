import { serverEntryVirtualId, type VitePluginServerEntryOptions } from '@brillout/vite-plugin-server-entry/plugin'
import { isPhotonMeta } from '@photonjs/core/api'
import MagicString from 'magic-string'
import type { Plugin } from 'vite'

declare module 'vite' {
  interface UserConfig {
    vitePluginServerEntry?: VitePluginServerEntryOptions
  }
}

export function serverEntryPlugin(): Plugin[] {
  return [
    {
      name: 'vike-photon:serverEntry',
      apply: 'build',

      applyToEnvironment(env) {
        return env.config.consumer === 'server'
      },

      transform: {
        order: 'post',
        handler(code, id) {
          const meta = this.getModuleInfo(id)?.meta
          if (
            // No additional Photon target package is in use, so Photon entries are considered Target entries
            (isPhotonMeta(meta) && this.environment.config.photon.defaultBuildEnv === 'ssr') ||
            // `isTargetEntry` is defined by Photon targets
            meta?.photonConfig?.isTargetEntry
          ) {
            const ms = new MagicString(code)

            if (meta?.photon?.standalone !== true) {
              // Inject Vike virtual server entry
              ms.prepend(`import "${serverEntryVirtualId}";\n`)
            }

            return {
              code: ms.toString(),
              map: ms.generateMap({
                hires: true,
                source: id
              })
            }
          }
        }
      },

      sharedDuringBuild: true
    },
    {
      name: 'vike-photon:serverEntry:vitePluginServerEntry',
      /* `inject: true` also needs to be set when running `$ vike preview`, see https://github.com/vikejs/vike/blob/97f1a076cb62fd6b9b210769474a06e368792459/vike/node/api/preview.ts#L21
      apply: 'build',
      */
      config() {
        return {
          vitePluginServerEntry: {
            // Tell Vike that we're injecting import statements that import the server entry `serverEntryVirtualId`
            inject: true,
            disableAutoImport: true
          }
        }
      },

      sharedDuringBuild: true
    }
  ]
}
