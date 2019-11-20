---
title: 'Connection to the Zeebe broker'
date: 2019-10-28T16:59:15+10:00
draft: false
---

## Zero-conf constructor vs configuration in code

You can provide configuration to the ZBClient explicitly in your code - via the constructor - or via environment variables.

Explicit configuration in code is quick and easy, and makes sense when you are first experimenting with Zeebe.

We recommend, however, that ultimately you use the zero-conf constructor, and provide all the configuration via environment variables, `docker-compose.yml`, or a K8s config map. This environmentalizes your configuration, making your code portable. When you deploy your application to a test, staging, or production environment, no changes are required in your code.

Note that any explicit configuration in code overrides configuration from the environment - with one exception: the log level can be overridden from the environment.

## Broker Gateway address

The `ZBClient` class establishes a connection to a Zeebe broker cluster, and is used to send commands to the broker.

Conceptually, the ZBClient "talks to a broker". In practice, the ZBClient talks to a gateway, which handles routing and load-balancing in the broker cluster. This means that you provide a gateway address to the ZBClient. In a development setup, you may have a single broker node with the embedded gateway enabled. In this case you can use the simplest constructor:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

In the absence of any other arguments or environment variables, the ZBClient will communicate with a gateway at 127.0.0.1 on port 26500.

You can explicitly provide an address to the constructor if you want. The following examples are functionally equivalent:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

// Use default host and port
const zbc = new ZBClient()

// Use default port
const zbc1 = new ZBClient('127.0.0.1')
const zbc2 = new ZBClient('localhost')

// Use explicit host and port
const zbc1 = new ZBClient('127.0.0.1:26500')
const zbc3 = new ZBClient('localhost:26500')

// Use configuration object
const zbc4 = new ZBClient({
hostname: 'localhost',
port: 26500
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// Use default host and port
const zbc = new ZBClient()

// Use default port
const zbc1 = new ZBClient('127.0.0.1')
const zbc2 = new ZBClient('localhost')

// Use explicit host and port
const zbc1 = new ZBClient('127.0.0.1:26500')
const zbc3 = new ZBClient('localhost:26500')

// Use configuration object
const zbc4 = new ZBClient({
hostname: 'localhost',
port: 26500
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

### Environmentalizing the connection

The ZBClient constructor examines the environment for the variable `ZEEBE_ADDRESS`.

For example, given an `index.js|ts` file like this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

You can run against a local broker simply with:

```bash
node index.js
```

And run the same code against a remote server running on port 80 on zeebe.test.mydomain.com with:

```bash
ZEEBE_ADDRESS=zeebe.test.mydomain.com:80 node index.js
```

## Connect to a broker with TLS

You can secure communication between your client applications and the Zeebe broker cluster using [TLS (Transport Layer Security)](https://en.wikipedia.org/wiki/Transport_Layer_Security). This needs to be enabled in the broker, or in an intermediate proxy to use.

By default, the broker does not secure the client connections with TLS, and the Node client does not use TLS for the connection.

To enable TLS with the Node client and connect to a broker secured with TLS, set the option `useTLS` to `true`:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

// With the default, or a gateway address from the environment
const zbc = new ZBClient({
useTLS: true
})

// With a gateway address provided in the code
const zbc = new ZBClient(gatewayAddress, {
useTLS: true
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// With the default, or a gateway address from the environment
const zbc = new ZBClient({
useTLS: true
})

// With a gateway address provided in the code
const zbc = new ZBClient(gatewayAddress, {
useTLS: true
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

### Environmentalizing TLS

To enable TLS with the Node client and connect to a broker secured with TLS, set the environment variable `ZEEBE_SECURE_CONNECTION`:

```bash
ZEEBE_SECURE_CONNECTION=true
```

## Connect to a broker with OAuth

You can secure a Zeebe cluster with OAuth using an intermediate proxy. In this case, the Node client can retrieve a JWT (JSON Web Token) from a token endpoint to use to authorize requests to the broker.

If you are using OAuth, you are probably using TLS as well, so TLS is automatically enabled when OAuth is configured. You need to explicitly disable TLS if you are using OAuth without TLS, and examine your life choices (I'm kidding - this is for a development POC ...right??).

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

It also caches the token on disk. This is important in development when you are restarting your application frequently, and also when running in a stateless environment like AWS Lambda.

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

## Connect to Camunda Cloud

Camunda Cloud is a fully managed Zeebe service with TLS and OAuth. You can configure each of these - TLS and OAuth - individually, and you should refer to the TLS and OAuth sections if you want do that. However, the Zeebe Node client provides a convenience that handles the TLS and some of the OAuth configuration for Camunda Cloud.

### Client version 0.22 and above

To use with Camunda Cloud, set the environment variables:

You can also set these values in code:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
camundaCloud: {
clusterId: string
clientId: string
clientSecret: string
}
})

{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// With a gateway address address from the environment
const zbc = new ZBClient({
useTLS: true
})

// With a gateway address provided in the code
const zbc = new ZBClient(gatewayAddress, {
useTLS: true
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

### Environmentalizing Camunda Cloud

```bash
ZEEBE_ADDRESS  # Set with "Zeebe Contactpoint" value
ZEEBE_CLIENT_ID # Set with "clientId" value
ZEEBE_CLIENT_SECRET # Set with "clientSecret" value
```

Setting only these three OAuth values is interpreted by the client as necessary and sufficient for Camunda Cloud, and it will enable TLS and correctly set the OAuth token audience and Authorization URL.

### Client version prior to 0.22

The OAuth authorization endpoint changed in November 2019. Client versions prior to 0.22 are hard-coded to use the previous authorization endpoint, so the convenience configuration will not work. You will need to provide all the configuration details:
