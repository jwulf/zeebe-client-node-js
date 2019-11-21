---
title: 'ZBLogger'
date: 2019-10-27T17:01:15+10:00
draft: false
---

The ZBLogger class is available for you to use for logging in your application.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

// Suppress all log messages except errors
const zbc = new ZBClient({
  loglevel: 'ERROR'
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// Suppress all log messages except errors
const zbc = new ZBClient({
  loglevel: 'ERROR'
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}