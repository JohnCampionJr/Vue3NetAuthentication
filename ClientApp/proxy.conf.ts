require('process')

const { env } = process

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001'

const proxy = {
  target,
  secure: false
}

export default {
  '/weatherforecast': proxy,
  '/api': proxy
}
