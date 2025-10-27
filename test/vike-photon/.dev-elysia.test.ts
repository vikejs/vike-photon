process.env.VIKE_NODE_FRAMEWORK = "elysia";
process.env.NODE_ENV = "development";

import { testRun } from "./.testRun";

testRun("bun --bun --silent run dev", { skipServerHMR: true, skipStatic: true, isFlaky: true, noServerHook: true });
