import { createServer } from 'node:http'
import { once } from 'node:events'
import JWT from 'jsonwebtoken'

const DEFAULT_USER = {
  user: 'luposki',
  password: '123'
}

const JWT_KEY = '1234'

async function loginRoute(request, response) {
  const { user, password } = JSON.parse(await once(request, 'data'))
  if(user !== DEFAULT_USER.user || password !== DEFAULT_USER.password) {
    response.writeHead(401)
    response.end(JSON.stringify({ error: 'user invalid' }))
    return
  }
  
  const token = JWT.sign({ user, message: 'hey duuude!' }, JWT_KEY)
  
  response.end(JSON.stringify({ token }))
}

function isHeadersValid(headers) {
  try {
    const auth = headers.authorization.replace(/bearer\s/ig, '')
    JWT.verify(auth, JWT_KEY)
    return true
  } catch (e) {
    return false
  }
}

async function handle(request, response) {
  if(request.url === '/login' && request.method === 'POST') {
    return loginRoute(request, response)
  }
  
  if(!isHeadersValid(request.headers)) {
    response.writeHead(400)
    return response.end(JSON.stringify({ error: 'invalid token!' }))
  }
  
  response.end(JSON.stringify({ result: 'Hey welcome!' }))
}

const app = createServer(handle)

app.listen(3000, () => {
  console.log("app run at http://localhost:3000")
})

export { app }