---
title: 'Connection to the Zeebe broker'
date: 2019-10-28T16:59:15+10:00
draft: false
---

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



