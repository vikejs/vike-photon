import { apply, serve } from '@photonjs/hono'
import { Hono } from 'hono'

function startServer() {
  const app = new Hono()
  apply(app)
  const port = process.env.PORT || 3000

  return serve(app, { port })
}

export default startServer()
