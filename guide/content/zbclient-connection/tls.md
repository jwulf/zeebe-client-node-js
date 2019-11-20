---
title: 'TLS'
date: 2019-10-28T16:59:15+10:00
draft: false
---

## Connect to a broker with TLS

You can secure communication between your client applications and the Zeebe broker cluster using [TLS (Transport Layer Security)](https://en.wikipedia.org/wiki/Transport_Layer_Security). This needs to be enabled in the broker, or in an reverse proxy, to use.

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