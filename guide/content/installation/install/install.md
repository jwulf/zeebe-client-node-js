---
title: 'Install'
date: 2019-11-07T01:44:25+10:00
---

The Zeebe Node client is available via [npm](https://www.npmjs.com/package/zeebe-node).

## Add to an existing project

```bash
npm i zeebe-node
```

## Create a new Node.js project

```bash
mkdir myproject
cd myproject
npm init -y
npm i zeebe-node
```

## Make it a TypeScript project

```bash
npm i -g typescript
tsc --init
```

## Optional: zbctl

The `zbctl` binary is a command-line client that you can use to send commands to a Zeebe broker cluster. It is useful for debugging and testing.

To install `zbctl`:

```bash
npm i -g zbctl
```

After installation, you can run `zbctl` and see the available options with:

```bash
zbctl
```