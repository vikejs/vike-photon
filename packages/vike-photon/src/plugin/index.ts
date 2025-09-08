export { vikePhoton, vikePhoton as default }

import { installPhoton } from '@photonjs/runtime/vite'
import type { Plugin } from 'vite'
import { configPlugin } from './plugins/configPlugin.js'
import { routesPlugins } from './plugins/routes.js'
import { serverEntryPlugin } from './plugins/serverEntryPlugin.js'
import { setPhotonMeta } from './plugins/setPhotonMeta.js'
import { standalonePlugin } from './plugins/standalonePlugin.js'
import { vikePhotonConfigToPhotonPlugin } from './plugins/vikePhotonConfigToPhotonPlugin.js'

type PluginInterop = Record<string, unknown> & { name: string }
function vikePhoton(): PluginInterop[] {
  return [
    configPlugin(),
    vikePhotonConfigToPhotonPlugin(),
    ...serverEntryPlugin(),
    standalonePlugin(),
    setPhotonMeta(),
    ...installPhoton('vike-photon', {
      resolveMiddlewares() {
        return 'vike-photon/universal-middlewares'
      }
    }),
    ...routesPlugins()
    // biome-ignore lint/suspicious/noExplicitAny: cast
  ] satisfies Plugin[] as any
}
