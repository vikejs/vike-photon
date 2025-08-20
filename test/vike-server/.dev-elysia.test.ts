process.env.VIKE_NODE_FRAMEWORK = 'elysia'

import { testRun } from './.testRun'

testRun('bun --bun --silent run dev', { skipServerHMR: true, isFlaky: true, noServerHook: true })
