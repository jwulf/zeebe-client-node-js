---
title: 'Prerequisites'
date: 2019-11-06T21:52:52+10:00
weight: 0
---

## Intended Audience

This guide is intended for Node.js developers who want to develop Zeebe client applications in JavaScript or TypeScript.

Familiarity with ES6 JavaScript or the [TypeScript](https://www.typescriptlang.org/) programming language, [Node.js](https://nodejs.org/en/download/), and a working development environment are assumed.

## What this guide covers

This guide walks you through using the JavaScript client for Zeebe, giving you the practical steps to write a fully-fledged Zeebe client application using either ES6 JavaScript or TypeScript.

If you want to:

-   Evaluate whether Zeebe is a good fit as a solution to your business problem.
-   Build a POC using Zeebe and Node.js.
-   Go to production with a Zeebe solution written in JavaScript / TypeScript.

You've come to the right place.

## Zeebe Broker

You will need a running Zeebe broker during development. For instructions on installing a broker for local development and testing, consult the [Zeebe broker documentation](https://docs.zeebe.io/).

## Code language

Code samples are presented in both JavaScript (ES6) and TypeScript, in tabs:

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
