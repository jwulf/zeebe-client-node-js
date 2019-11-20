---
title: 'Configuration Strategies'
date: 2019-10-26T16:59:15+10:00
draft: false
---

## Zero-conf constructor vs configuration in code

You can provide configuration to the ZBClient explicitly in your code - via the constructor - or via environment variables.

Explicit configuration in code is quick and easy, and makes sense when you are first experimenting with Zeebe.

We recommend, however, that ultimately you use the zero-conf constructor, and provide all the configuration via environment variables, `docker-compose.yml`, or a K8s config map. This environmentalizes your configuration, making your code portable. 

When you deploy your application to a test, staging, or production environment, no changes are required in your code: you will be testing the exact code you run in production, and you can use configuration management tools to handle the different environments.

Note that any explicit configuration in code overrides configuration from the environment - with one exception: the log level can be overridden from the environment.