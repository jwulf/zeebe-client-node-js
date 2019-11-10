# Website

## Deploy changes

Configuration from [here](https://gohugo.io/hosting-and-deployment/hosting-on-github/).

Run:

```bash
./deploy.sh "commit message"
```

This will commit a build to [https://github.com/jwulf/zeebe-node-guide](https://github.com/jwulf/zeebe-node-guide).

GitHub pages serves it at [https://jwulf.github.io/zeebe-node-guide/](https://jwulf.github.io/zeebe-node-guide/) from there. AWS S3 points [zeebe.joshwulf.com](https://zeebe.joshwulf.com) to a Cloudfront distro that points to [https://jwulf.github.io/zeebe-node-guide/](https://jwulf.github.io/zeebe-node-guide/).
