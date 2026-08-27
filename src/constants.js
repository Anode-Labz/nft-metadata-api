function getHost() {
  const configuredHost = process.env.HOST

  if (!configuredHost) {
    throw new Error('The HOST environment variable is required')
  }

  let host

  try {
    host = new URL(configuredHost)
  } catch {
    throw new Error('The HOST environment variable must be a valid URL')
  }

  if (!['http:', 'https:'].includes(host.protocol) || host.username || host.password) {
    throw new Error('The HOST environment variable must use HTTP(S) without credentials')
  }

  return host.origin
}

const HOST = getHost()

module.exports = {
  HOST,
}
