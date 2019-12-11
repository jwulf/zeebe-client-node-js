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
import { ZBLogger } from 'zeebe-node'

const logger = new ZBLogger({
	loglevel: 'INFO',
	namespace: 'my-application-context',
})

logger.info('Starting...')
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBLogger } = require('zeebe-node')

const logger = new ZBLogger({
	loglevel: 'INFO',
	namespace: 'my-application-context',
})

logger.info('Starting...')
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}
