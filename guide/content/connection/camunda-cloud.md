---
title: 'Camunda Cloud'
date: 2019-10-26T16:59:15+10:00
draft: false
---

## Connect to Camunda Cloud

[Camunda Cloud](https://zeebe.io/cloud/) provides a fully managed Zeebe service with TLS and OAuth. 

### Client version 0.22 and above

The Zeebe Node client version 0.22 and above provides a convenience that handles the TLS and some of the OAuth configuration for Camunda Cloud.

To use with Camunda Cloud, set these values in code. Note that `cacheDir` is optional, and should be used when the directory `~` is not writable in your runtime environment, to set a custom token cache directory.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

// cacheDir is optional - see OAuth JWT caching
const zbc = new ZBClient({
  camundaCloud: {
    clientId: 'yStuGvJ6a1RQhy8DQpeXJ80yEpar3pXh',
    clientSecret: 'WZahIGHjyj0-oQ7DZ_aH2wwNuZt5O8Sq0ZJTz0OaxfO7D6jaDBZxM_Q-BHRsiGO_',
    clusterId: '103ca930-6da6-4df7-aa97-941eb1f85040',
    cacheDir: './tokens'
  }
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
  {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// cacheDir is optional - see OAuth JWT caching
const zbc = new ZBClient({
  camundaCloud: {
    clientId: 'yStuGvJ6a1RQhy8DQpeXJ80yEpar3pXh',
    clientSecret: 'WZahIGHjyj0-oQ7DZ_aH2wwNuZt5O8Sq0ZJTz0OaxfO7D6jaDBZxM_Q-BHRsiGO_',
    clusterId: '103ca930-6da6-4df7-aa97-941eb1f85040',
    cacheDir: './tokens'
	}
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

### Environmentalizing Camunda Cloud (client version >= 0.22)

To use Camunda Cloud with clients version 0.22 and above, set the environment variables:

```bash
ZEEBE_ADDRESS  # Set with "Zeebe Cluster Id" value
ZEEBE_CLIENT_ID # Set with "clientId" value
ZEEBE_CLIENT_SECRET # Set with "clientSecret" value
```

Setting only these three OAuth values is interpreted by the client as necessary and sufficient for Camunda Cloud, and it will enable TLS and correctly set the OAuth token audience and Authorization URL.

Optionally, set a custom token cache directory:

```bash
ZEEBE_TOKEN_CACHE_DIR
```

### Client version prior to 0.22

The OAuth authorization endpoint changed in November 2019. Client versions prior to 0.22 are hard-coded to use the previous authorization endpoint, so the convenience configuration will not work. You will need to provide all the configuration details. 

The `oAuth.url` is a constant - it's the Camunda Cloud token endpoint. The other values depend on your cluster, and come from your Camunda Cloud account. The `oAuth.audience` needs to be set to your cluster Id with the `.zeebe.camunda.io` domain added to it.

The `oAuth.cacheDir` setting is optional, and should be set if the directory `~` is not writable in your run-time environment - for example, AWS Lambda with the default mounts.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  useTLS: true,
  oAuth: {
    url: '@TODO my-oAuth-endpoint.com',
    audience: '103ca930-6da6-4df7-aa97-941eb1f85040.zeebe.camunda.io',
    clientId: 'yStuGvJ6a1RQhy8DQpeXJ80yEpar3pXh',
    clientSecret: 'WZahIGHjyj0-oQ7DZ_aH2wwNuZt5O8Sq0ZJTz0OaxfO7D6jaDBZxM_Q-BHRsiGO_',
    clusterId: '103ca930-6da6-4df7-aa97-941eb1f85040',
    cacheDir: '/cache'
  },
  hostname: '103ca930-6da6-4df7-aa97-941eb1f85040.zeebe.camunda.io',
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
    url: '@TODO my-oAuth-endpoint.com',
    audience: '103ca930-6da6-4df7-aa97-941eb1f85040.zeebe.camunda.io',
    clientId: 'yStuGvJ6a1RQhy8DQpeXJ80yEpar3pXh',
    clientSecret: 'WZahIGHjyj0-oQ7DZ_aH2wwNuZt5O8Sq0ZJTz0OaxfO7D6jaDBZxM_Q-BHRsiGO_',
    clusterId: '103ca930-6da6-4df7-aa97-941eb1f85040',
    cacheDir: '/cache'
  },
  hostname: '103ca930-6da6-4df7-aa97-941eb1f85040.zeebe.camunda.io',
  port: 443
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

### Environmentalizing Camunda Cloud (client version < 0.22)

For clients prior to 0.22, you need to set all the environment variables for oAuth, using the appropriate values for Camunda Cloud and your cluster. See above for how you get those.

```bash
ZEEBE_TOKEN_AUDIENCE
ZEEBE_AUTHORIZATION_SERVER_URL=@TODO
ZEEBE_CLIENT_ID
ZEEBE_CLIENT_SECRET
```

Optionally, set a custom token cache directory:

```bash
ZEEBE_TOKEN_CACHE_DIR
```