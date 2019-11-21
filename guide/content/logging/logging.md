---
title: 'Logging'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Log format

The Node client logs its messages using a structured JSON format - [ndjson](http://ndjson.org/). These messages are designed to be easily parsed by scripts.

The messages are output to the console by default, and look like this:

```
{"timestamp":"2019-11-21T13:52:00.961Z","context":"/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:433","level":50,"message":"[topology]: Attempt 5 (max: 50).","time":"2019 Nov-21 23:52:00PM","pollInterval":30000,"namespace":"ZBClient"}
{"timestamp":"2019-11-21T13:52:00.962Z","context":"/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:441","level":50,"message":"[topology]: 14 UNAVAILABLE: failed to connect to all addresses","time":"2019 Nov-21 23:52:00PM","pollInterval":30000,"namespace":"ZBClient"}
```

To view log messages in a human-readable format, you can pipe your program's output through [`pino-pretty`](https://www.npmjs.com/package/pino-pretty). This results in output like this:

```
[2019 Nov-21 23:52:54PM] ERROR:
    context: "/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:433"
    message: "[topology]: Attempt 5 (max: 50)."
    pollInterval: 30000
    namespace: "ZBClient"
[2019 Nov-21 23:52:54PM] ERROR:
    context: "/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:441"
    message: "[topology]: 14 UNAVAILABLE: failed to connect to all addresses"
    pollInterval: 30000
    namespace: "ZBClient"
```

## Log message levels

There are three levels of log messages:

* 20 - DEBUG
* 30 - INFO
* 50 - ERROR

## Set the logging level

By default, the client logs at `INFO` level.

Set the log level of the ZBClient to one of the log levels - `DEBUG`, `INFO`, `ERROR`; or to `NONE` to suppress all logging.

You can set the logging level of the ZBClient via the ZBClient constructor:

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

And via the environment:

```bash
ZEEBE_NODE_LOG_LEVEL
```

Any environment setting will override the constructor setting. This is the only setting with this precedence.

## Set a custom log namespace

By default, the ZBClient logs with namespace "ZBClient". If you have more than one ZBClient instance in your application, you can distinguish between them by setting a custom log namespace. Pass a string or array of strings to the ZBClient constructor as the `logNamespace` parameter.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  logNamespace: 'zbc'
})

const zbc1 = new ZBClient({
  logNamespace: 'zbc1'
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  logNamespace: 'zbc'
})

const zbc1 = new ZBClient({
  logNamespace: 'zbc1'
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Log to a custom stdout

You can redirect the log output to somewhere other than the console by passing in an object with an `info` method that takes a string parameter.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import { postMessage } from './my-http-log-sink'

// Use a custom log sink
const zbc = new ZBClient({
  loglevel: 'ERROR',
  stdio: {
    info: msg => postMessage(msg)
  }
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')
const { postMessage } = require('./my-http-log-sink')

// Use a custom log sink
const zbc = new ZBClient({
  loglevel: 'ERROR',
  stdio: {
    info: msg => postMessage(msg)
  }
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

For an example of a custom logger, see the implementation in the [Node-RED Zeebe package](https://github.com/pedesen/node-red-contrib-zeebe/blob/master/src/util/logger.js).