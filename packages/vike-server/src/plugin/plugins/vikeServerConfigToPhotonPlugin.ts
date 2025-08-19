import { getVikeConfig } from 'vike/plugin'
import type { Plugin } from 'vite'

export function vikeServerConfigToPhotonPlugin(): Plugin {
  return {
    name: 'vike-server:to-photon-config',
    async config(userConfig) {
      const vikeConfig = getVikeConfig(userConfig)

      if (vikeConfig.config.server) {
        return {
          photon: vikeConfig.config.server
        }
      }
    },
    // TODO investigate why this happens
    configEnvironment(_name, config) {
      if (config.consumer === 'server') {
        if (config.build?.outDir?.endsWith('/client')) {
          return {
            build: {
              outDir: config.build.outDir.replace(/\/client$/, '/server')
            }
          }
        }
      } else {
        if (config.build?.outDir?.endsWith('/server')) {
          return {
            build: {
              outDir: config.build.outDir.replace(/\/server$/, '/client')
            }
          }
        }
      }
    }
  }
}
