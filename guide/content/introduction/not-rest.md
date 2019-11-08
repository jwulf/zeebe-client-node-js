---
title: 'Zeebe client applications'
date: 2019-10-28T16:59:15+10:00
draft: false
---

Zeebe is a highly-scalable, cloud-native microservices orchestration engine that uses BPMN to orchestrate microservices.

## Polling model

Zeebe clients communicate with a Zeebe broker cluster through a gateway. Communication between the JavaScript client code and the gateway is over gRPC. That means that _your client applications poll the gateway for available tasks_. The Zeebe broker does not invoke your microservices over REST. If you come from a REST architecture background, or have an existing REST microservices architecture that you want to orchestrate, you should take the time to understand the Zeebe model as it is, _before_ trying to figure out how to use it with RESTful services. It is definitely possible, but you need to wire it up to work.

Think of it like this: your Zeebe worker, written in JavaScript, subscribes to a task type on the gateway. It then runs in a loop, polling the gateway for that task type. When jobs of that task type are available, the gateway returns them to the worker. If you have an existing RESTful microservice that you want to invoke for jobs of that task type, then your Zeebe worker can invoke it. And that's how you wire up Zeebe with existing RESTful microservices.

You could do something like create a worker that subscribes to many task types and has a map for the task type to the REST endpoint that should be invoked for it.

The important thing to understand is that workers subscribe to a task type, and poll for jobs of that task type. So it is a pull model, rather than the push model of REST, where the broker would invoke a REST service.

The pull model means that you can scale the workers without configuring routing or load-balancing, as you would need to do if it were a push model.

If you are writing a system from scratch, then you can put your business logic directly in a polling worker - or you can put the business logic in a REST endpoint if you need to reuse it from other places, and wrap the REST call in a Zeebe worker.
