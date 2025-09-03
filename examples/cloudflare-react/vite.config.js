import { cloudflare } from '@photonjs/cloudflare/vite'
import react from '@vitejs/plugin-react'
import vikeServer from 'vike-server/plugin'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike(), vikeServer(), cloudflare()]
}
