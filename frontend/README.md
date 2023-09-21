# jsonVee

An efficient front-end integration framework，Based on Node.js, Vue, Webpack.

fork from: uct8086/jsonVee



# File Description

```shell
.
├── README.md
├── app.js
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── client
│   ├── assets
│   ├── common
│   ├── components
│   ├── font
│   └── modules
├── config
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── dist
│   ├── index.html
│   └── static
├── index.html
├── nodemon.json
├── package-lock.json
├── package.json
├── server
│   ├── config
│   ├── handler
│   ├── middleware
│   ├── mock
│   ├── model
│   ├── router
│   ├── service
│   └── utils
└── test
    └── testAes.js
```

**./client** comprises the visual designs.

Most configuration of Vue should be in **./config/index.js**.