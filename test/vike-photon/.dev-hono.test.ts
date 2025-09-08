process.env.VIKE_NODE_FRAMEWORK = "hono";
process.env.NODE_ENV = "development";

import { testRun } from "./.testRun";

testRun("pnpm run dev");
