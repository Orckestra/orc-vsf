// const express = require('express')
// const {Nuxt} = require('nuxt')
// const app = express()
// const host = process.env.HOST || '127.0.0.1'
// const port = process.env.PORT || 3000
// // Import and set Nuxt.js options
// let config = require('../nuxt.config.js')
// const nuxt = new Nuxt(config)
// // Give Nuxt middleware to express
// app.use(nuxt.render)
// // Listen the server
// app.listen(port, host);
// console.log('Server listening on ' + host + ':' + port);


// const { Nuxt } = require('nuxt-start')

// // Require nuxt config
// const config = require('../nuxt.config.js')

// console.log(123);

// // Create a new nuxt instance (config needs dev: false)
// const nuxt = new Nuxt(config)

// // Start nuxt server
// nuxt.listen(process.env.PORT)

// const express = require('express')
// const consola = require('consola')
// const { loadNuxt } = require('nuxt-start')
// const app = express()

// async function start () {
//   const nuxt = await loadNuxt( 'dev')
//   await nuxt.listen(process.env.PORT || 3000)
// }

// start()

const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();

const config = require('../nuxt.config.js');
config.dev = true;

async function start() {
  const nuxt = new Nuxt(config);
  const { host, port } = nuxt.options.server;

  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  app.use(nuxt.render);

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();