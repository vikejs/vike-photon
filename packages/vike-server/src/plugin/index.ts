export { vikeServer, vikeServer as default }

import { commonConfig } from './plugins/commonConfig.js'
import { devServerPlugin } from './plugins/devServerPlugin.js'
import { serverEntryPlugin } from './plugins/serverEntryPlugin.js'
import { standalonePlugin } from './plugins/standalonePlugin.js'
import type { Plugin } from 'vite'

type PluginInterop = Record<string, unknown> & { name: string }
// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
function vikeServer(): PluginInterop[] {
  const plugins: Plugin[] = [
    //
    ...commonConfig(),
    ...serverEntryPlugin(),
    devServerPlugin(),
    standalonePlugin()
  ]
  return plugins as any
}
