import { cloudflare } from '@photonjs/cloudflare/vite'
import react from '@vitejs/plugin-react'
import vikePhoton from 'vike-photon/plugin'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike(), vikePhoton(), cloudflare()]
}
