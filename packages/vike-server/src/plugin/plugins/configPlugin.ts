import type { Plugin } from 'vite'

export function configPlugin(): Plugin {
  return {
    name: 'vike-server:common-config',
    config() {
      return {
        resolve: {
          noExternal: ['vike-server']
        }
      }
    }
  }
}
