import { cloudflare } from '@photonjs/cloudflare/vite'
import react from '@vitejs/plugin-react'
import vikeServer from 'vike-server/plugin'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike(), vikeServer(), cloudflare()],
  photon: {
    server: 'server.js'
  },
  ssr: {
    optimizeDeps: {
      // FIXME
      exclude: [
        'vike-server',
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
        '@photonjs/srvx'
      ]
    }
  }
}
