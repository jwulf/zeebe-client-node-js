---
title: 'Camunda Cloud'
date: 2019-10-26T16:59:15+10:00
draft: false
---

## Connect to Camunda Cloud

[Camunda Cloud](https://zeebe.io/cloud/) provides a fully managed Zeebe service with TLS and OAuth. 

The Zeebe Node client provides a convenience that handles the TLS and some of the OAuth configuration for Camunda Cloud.

To use with Camunda Cloud, set these values in code. Note that `cacheDir` is optional, and should be used when the directory `~/.camunda` is not writable in your runtime environment, to set a custom token cache directory (see the section on <a href="/connection/oauth/#oauth-jwt-caching">OAuth JWT caching</a>).

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

### Environmentalizing Camunda Cloud

To use Camunda Cloud, set the environment variables:

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
