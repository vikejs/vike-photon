export { config }

import vikePhoton from 'vike-photon/config'

const config = {
  // https://vike.dev/extends
  extends: [vikePhoton],
  server: {
    entry: 'server/index.js'
  }
}
