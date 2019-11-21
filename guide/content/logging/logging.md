---
title: 'Logging'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Log format

The Node client logs its messages using a structured JSON format - [ndjson](http://ndjson.org/). These messages are designed to be easily parsed by scripts.

The messages are output to the console by default, and look like this:

```
{"context":"/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:382","level":50,"message":"14 UNAVAILABLE: failed to connect to all addresses","pollMode":"","taskType":"ZBClient","time":"2019 Nov-11 22:39:32PM","timestamp":"2019-11-11T12:39:32.155Z"}
{"context":"/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:374","level":50,"message":"gRPC connection is in failed state. Attempt 5. Retrying in 5s...","pollMode":"","taskType":"ZBClient","time":"2019 Nov-11 22:39:37PM","timestamp":"2019-11-11T12:39:37.159Z"}
```

To view log messages in a human-readable format, you can pipe your program's output through [`pino-pretty`](https://www.npmjs.com/package/pino-pretty). This results in output like this:

```
[2019 Nov-11 23:43:48PM] ERROR:
    context: "/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:382"
    message: "14 UNAVAILABLE: failed to connect to all addresses"
    pollMode: ""
    taskType: "ZBClient"
[2019 Nov-11 23:43:53PM] ERROR:
    context: "/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:374"
    message: "gRPC connection is in failed state. Attempt 10. Retrying in 5s..."
    pollMode: ""
    taskType: "ZBClient"
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