import { cloudflare } from '@photonjs/cloudflare/vite'
import react from '@vitejs/plugin-react'
import vikeServer from 'vike-server/plugin'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike(), vikeServer(), cloudflare()],
  ssr: {
    optimizeDeps: {
      // FIXME
      exclude: [
        'vike-server',
        'vike',
        '@photonjs/hono',
        '@photonjs/cloudflare',
        '@photonjs/compress',
        '@photonjs/core',
        '@photonjs/elysia',
        '@photonjs/express',
        '@photonjs/fastify',
        '@photonjs/h3',
        '@photonjs/hattip',
        '@photonjs/hono',
        '@photonjs/sirv',
        '@photonjs/srvx',
        '@photonjs/runtime'
      ],
      include: ['vike > @brillout/require-shim']
    }
  }
}
