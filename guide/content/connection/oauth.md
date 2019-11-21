---
title: 'OAuth'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Connect to a broker with OAuth

You can secure a Zeebe cluster with OAuth using a proxy. In this case, the Node client can retrieve a JWT (JSON Web Token) from a token endpoint to use to authorize requests to the broker.

If you are using OAuth, you are probably using TLS as well, so TLS is automatically enabled when OAuth is configured. You need to explicitly disable TLS if you are using OAuth without TLS, and re-examine your life choices (I'm kidding - this is for a development POC ...right??).

In the following example, we enable OAuth:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  oAuth: {
    url: 'my-oAuth-endpoint.com',
    audience: 'token-audience',
    clientId: 'oAuth-client-id',
    clientSecret: 'oAuth-client-secret',
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 443
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  oAuth: {
    url: 'my-oAuth-endpoint.com',
    audience: 'token-audience',
    clientId: 'oAuth-client-id',
    clientSecret: 'oAuth-client-secret',
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 443
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

### Environmentalizing OAuth configuration

The following environment variables control OAuth configuration:

```bash
ZEEBE_TOKEN_AUDIENCE
ZEEBE_AUTHORIZATION_SERVER_URL
ZEEBE_CLIENT_ID
ZEEBE_CLIENT_SECRET
```

### OAuth JWT caching

The Node client caches the JWT in-memory, and only requests a new token when the current token expires. This is important for performance, as the client doesn't need to request a token for each request. This speeds up network requests to the gateway and reduces calls to your token-issuing endpoint.

The Node client also caches the token on disk. This is important in development when you are restarting your application frequently, and also when running in a stateless environment like AWS Lambda.

By default, the JWT is cached in the directory `~/.camunda`. In some environments (such as AWS Lambda) this directory is not writable. To avoid unbounded token requests, the ZBClient will throw in its constructor if it cannot write to the token cache directory.

You can configure a token cache directory in the oAuth configuration using the optional `cacheDir` parameter, like this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  useTLS: true,
  oAuth: {
    url: 'my-oAuth-endpoint.com',
    audience: 'token-audience',
    clientId: 'oAuth-client-id',
    clientSecret: 'oAuth-client-secret',
    cacheDir: '/cache'
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 443
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  useTLS: true,
  oAuth: {
    url: 'my-oAuth-endpoint.com',
    audience: 'token-audience',
    clientId: 'oAuth-client-id',
    clientSecret: 'oAuth-client-secret',
    cacheDir: '/cache'
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 443
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

### Environmentalizing JWT cache

The following environment variable overrides the JWT cache directory:

```bash
ZEEBE_TOKEN_CACHE_DIR
```