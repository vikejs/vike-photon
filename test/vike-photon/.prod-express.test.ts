process.env.VIKE_NODE_FRAMEWORK = 'express'
process.env.NODE_ENV = 'production'

import { testRun } from './.testRun'

testRun('pnpm run prod')
