---
title: 'ZBClient gRPC channel events'
date: 2019-10-25T17:01:15+10:00
draft: false
---

## ZBClient gRPC channel events

The ZBClient notifies on gRPC channel connection failure and reconnection. In addition to wrapping every single operation, you can use this feature to write alerting or custom behavior based on the underlying connection status.

One thing to bear in mind is that ZBClient operations will throw if they encounter an error. However, there is no opportunity to be alerted to a network failure until you try an operation.

The ZBClient gRPC channel events allow you to detect and react to network disruption independent of operations.

There are two interfaces to the ZBClient gRPC events: callbacks and events.

## onReady and onConnectionError callbacks

The `onReady` callback is called when the ZBClient gRPC connection is initially established, and every time it is re-established after it is disconnected.

Note that the ZBClient constructor immediately issues a `topology` command to the broker to provoke an error or prove the connection. Without this, the channel status is unknown until the first command is issued.

The `onConnectionError` callback is called when the gRPC channel is disconnected.

Pass in callbacks to the ZBClient constructor to react on these events:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  onReady: () => console.log('Ready for action!'),
  onConnectionError: () => console.log('Boo! The gRPC connection failed!')
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  onReady: () => console.log('Ready for action!'),
  onConnectionError: () => console.log('Boo! The gRPC connection failed!')
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

## 'ready' and 'connectionError' events

The ZBClient class extends [`EventEmitter`](https://nodejs.org/docs/latest-v12.x/api/events.html#events_class_eventemitter). As well as invoking any callback handlers passed to the constructor, the ZBClient emits the `ready` and `connectionError` events.

This means that you can do things like attach [one-time listeners](https://nodejs.org/docs/latest-v12.x/api/events.html#events_emitter_once_eventname_listener), or write a module that contains reusable connection logic and wraps a ZBClient instance. For an example of this, see the [zeebe-canaryize](https://www.npmjs.com/package/zeebe-canaryize) package.

## gRPC status jitter and connectionTolerance

When the gRPC connection fails, as the gRPC channel tries to reconnect, it rapidly cycles between connected / disconnected before settling on disconnected. To avoid calling the onReady and onConnectionError callbacks rapidly in multiple succession and emitting a stream of events, the client debounces the channel status transitions, and requires the channel to be in the new state for 3 seconds before calling it.

The default window of three seconds is based on observation of production systems using specific proxies. You might find that you need a different window for connection tolerance, in which case you can pass in another value for `connectionTolerance` in the ZBClient constructor:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient({
  connectionTolerance: 3000
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient({
  connectionTolerance: 3000
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}