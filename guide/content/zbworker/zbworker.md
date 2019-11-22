---
title: 'ZBWorker class'
date: 2019-10-27T17:01:15+10:00
draft: false
---

The ZBWorker is the class used to create Zeebe Job workers.

Your Workflow Definitions contain _tasks_. A task has a _task type_. 

When you create a workflow instance, the broker will create a _job_ for a task. A job is a specific concrete instance of a task. 

An ZBWorker subscribes to the gateway for jobs of a specific task type, and continually polls the gateway for available jobs. When there is work for the worker to do, the gateway responds to the poll with a stream of jobs, and the worker's job handler is invoked for each job.

ZBWorkers are created via the ZBClient method `createWorker`. More information on configuring and using ZBWorkers can be found in the chapter <a href="{{< ref "/create-worker" >}}">Create a ZBWorker</a>.