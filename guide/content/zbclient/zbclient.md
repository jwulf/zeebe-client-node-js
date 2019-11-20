---
title: 'ZBClient class'
date: 2019-10-27T17:01:15+10:00
draft: false
---

The ZBClient is the main class in the Node client. It is used to connect to the broker, deploy workflow definitions, start workflow instances, publish messages, and to create workers (ZBWorker) that will service Zeebe tasks.

The workers created from the Zeebe client inherit the client's settings, allowing you to consolidate your configuration. At the same time, you can override those settings for any worker - so you have convenience and flexibility.