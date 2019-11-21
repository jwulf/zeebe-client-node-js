---
title: 'Basic Auth'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Connect to a broker with Basic Auth 

You can secure a Zeebe cluster with Basic Auth using an reverse proxy. In this case you can use a username / password pair as effectively an API key for your client applications.

## Basic Auth without TLS

To enable Basic Auth without TLS:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  basicAuth: {    
    username: 'basicAuth-username',
    password: 'basicAuth-password',
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 80
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  basicAuth: {    
    username: 'basicAuth-username',
    password: 'basicAuth-password',
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 80
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

## Basic Auth with TLS

To enable Basic Auth with TLS:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  basicAuth: {    
    username: 'basicAuth-username',
    password: 'basicAuth-password',
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 443,
  useTLS: true
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  basicAuth: {    
    username: 'basicAuth-username',
    password: 'basicAuth-password',
  },
  hostname: 'my-secure-zeebe-gateway.com',
  port: 443,
  useTLS: true
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

### Environmentalizing Basic Auth configuration

The following environment variables control Basic Auth configuration:

```bash
ZEEBE_BASIC_AUTH_USERNAME
ZEEBE_BASIC_AUTH_PASSWORD
```

To enable TLS on the connection:

```bash
ZEEBE_SECURE_CONNECTION=true
```