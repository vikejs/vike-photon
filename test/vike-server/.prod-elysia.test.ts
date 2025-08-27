process.env.VIKE_NODE_FRAMEWORK = 'elysia'
process.env.NODE_ENV = 'production'

import { testRun } from './.testRun'

testRun('bun --bun --silent run prod:bun', { noServerHook: true })
