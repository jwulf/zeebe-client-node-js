---
title: 'Worker Overview'
date: 2019-10-27T17:01:15+10:00
draft: false
---

_This section contains conceptual background and reference material that may be overwhelming initially. Feel free to continually refer back to this section as you need to._

The ZBClient method `createWorker` creates a new ZBWorker to service jobs.

A _job_ is a specific, concrete instance of a task from a running workflow.

A ZBWorker is created for a specific task type, and continuously polls the broker for jobs of that task type.

It does this, under the hood, by sending an `ActivateJobs` gRPC command to the gateway.

If jobs of the worker's task type are available in the cluster, the gateway streams them back to the worker. If no jobs are available, the poll is held open - it is a long poll. If jobs appear at any time during the life-time of the poll, the gateway sends them back. The worker repolls when the current poll expires, or as soon as it has capacity for more work.

## Long polling

The lifetime of the worker's long poll is configurable, and you would configure this to be as long as possible, to reduce the load on the gateway (see this <a href="https://zeebe.io/blog/2019/08/long-polling/">blog post</a>). At the same time, you will need to make it as short as it needs to be - we've seen 10-minute long polling perform flawlessly in development environments, and anything over 60 seconds throw errors in environments where an intermediate proxy terminated "idle" connections at that time limit. By default, the client sets this to 30 seconds.

## Maximum (Concurrent) Active Jobs

The maximum number of jobs that the worker can handle concurrently is configurable. By default, this is 32. Depending on the resource intensity of the actual execution of the job, you can configure the worker capacity to be more or less.

## Job Timeout

When the worker requests jobs, it lets the gateway know the duration of time that the job should be allocated to the worker. During that time, the job is marked active, and will not be allocated to any other worker. By default, in the Node client this is 60 seconds. You should be aware that the task that checks for worker job timeouts on the broker runs every 30 seconds, so if you configure a job timeout of _n_ seconds, the effective timeout will be somewhere in the range of _n_ to (_n_ + 29s).

## Completing a job after the activation timeout expires

The Node client does no management of the job timeout.

If a worker completes a job after the timeout, as long as no other worker has completed the job already, the job will be successfully completed by the gateway. If it has already been completed, the attempt to complete it will throw. This means that your worker can receive a job, and then throw when it tries to complete it because another worker ('worker 1') previously activated it, the activation timed out and the job was streamed to worker 2, then worker 1 came through and completed it before worker 2 did.

If this seems a little chaotic to you, I'm not surprised!

Here is why it works this way - imagine that your worker activates a job and specifies a 60s timeout (which gives it 60s - 89s to complete it). Now imagine that it actually takes 95s to complete the job due to computational complexity, dependent services, or anything else you want to make up.

Now, no worker will ever be able to complete the job in time - even though any of them could...eventually.

This way, another worker can start work on it, but the first worker can still complete it.

So the job activation timeout is more a statement of "_how long should we wait before deciding 'this worker may have died, better try another one'_" than a statement of "_this is how long I think this job will take_".

## Eventual consistency and idempotency

The system is eventually consistent. That's the nature of a distributed system - the broker doesn't know what is happening in the worker until it reports back.

Since multiple workers may receive the same job (it is _at-least-once_), you should make sure the side-effects of your workers are idempotent - for example, upserting records instead of inserting them.

## Failing a job after the activation timeout expires

Although workers can complete jobs after the activation timeout, they cannot fail them after the activation timeout has expired. This will throw.

