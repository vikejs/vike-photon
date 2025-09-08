import { getVikeConfig } from 'vike/plugin'
import type { Plugin } from 'vite'

// Forward config from Vike to Photon
export function vikeServerConfigToPhotonPlugin(): Plugin {
  return {
    name: 'vike-server:to-photon-config',
    config(userConfig) {
      const vikeConfig = getVikeConfig(userConfig)

      if (vikeConfig.config.server) {
        return {
          photon: vikeConfig.config.server
        }
      }
    }
  }
}
