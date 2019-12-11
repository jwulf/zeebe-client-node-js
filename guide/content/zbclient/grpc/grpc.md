---
title: 'gRPC'
date: 2019-10-28T17:01:15+10:00
draft: false
---

## gRPC

Communication between your application and the Zeebe broker gateway uses [gRPC](https://grpc.io/), a Remote Procedure Call framework that uses a highly efficient binary protocol that multiplexes requests over a persistent HTTP/2 connection.

gRPC was originally developed at Google for use in their data centers, and is growing in popularity. Its main attractive features are its strong type safety and explicit interface definition through the `.proto` file, efficiency, and language agnosticism - an important factor in a large polyglot environment like Google, where services written in Go, Java, and C++ all need to talk to each other.

Zeebe was designed to be language agnostic, so gRPC was chosen as the protocol.

JavaScript doesn't have the same JSON-serialization penalty that these other languages do, so most JavaScript client applications talk JSON over REST, and you may be encountering gRPC for the first time with Zeebe.

Most of the gRPC nature of the communication with the broker is abstracted away in the Node client, and you will be interacting with idiomatic JavaScript objects.

Where the gRPC implementation detail leaks, in our experience, is when the transport layer fails. Using the Node client directly against the broker, this is not noticeable - but in production environments with proxies and load-balancers, you are more likely to become aware that gRPC is the medium.

For example: your reverse proxy in production may terminate "idle" connections at a limit that is shorter than your application's configured polling interval - in which case you will see errors in production that never show up when running directly against an unproxied broker in development.

The best advice we can give you is to configure your development environment as close as possible to your production environment - including any reverse proxy configuration - and surface these issues as far forward as you can.

## The gRPC module

The Node client uses the C-based [grpc](https://www.npmjs.com/package/grpc) module. There is a pure JavaScript module that we may switch to in the future, but what this means for now is that your `node_modules` need to be installed in or rebuilt for your run-time environment. 

For example: you cannot install the Node client on a Windows machine, then mount your working directory into an Ubuntu-based Docker container to run it. The grpc module will need to be rebuilt for Ubuntu in the container using:

```bash
npm rebuild
```


