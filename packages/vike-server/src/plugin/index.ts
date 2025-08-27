export { vikeServer, vikeServer as default }

import { installPhoton } from '@photonjs/runtime/vite'
import type { Plugin } from 'vite'
import { configPlugin } from './plugins/configPlugin.js'
import { serverEntryPlugin } from './plugins/serverEntryPlugin.js'
import { setPhotonMeta } from './plugins/setPhotonMeta.js'
import { standalonePlugin } from './plugins/standalonePlugin.js'
import { vikeServerConfigToPhotonPlugin } from './plugins/vikeServerConfigToPhotonPlugin.js'

type PluginInterop = Record<string, unknown> & { name: string }
function vikeServer(): PluginInterop[] {
  return [
    configPlugin(),
    vikeServerConfigToPhotonPlugin(),
    ...serverEntryPlugin(),
    standalonePlugin(),
    setPhotonMeta(),
    ...installPhoton('vike-server', {
      resolveMiddlewares() {
        return 'vike-server/universal-middlewares'
      }
    })
    // biome-ignore lint/suspicious/noExplicitAny: cast
  ] satisfies Plugin[] as any
}
