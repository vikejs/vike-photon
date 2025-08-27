process.env.VIKE_NODE_FRAMEWORK = 'hattip'
process.env.NODE_ENV = 'production'

import { testRun } from './.testRun'

testRun('pnpm run prod')
