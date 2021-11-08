const express = require('express');
const process = require('process');
const { connector } = require('swagger-routes-express');
const YAML = require('yamljs');
const { resolveRefs } = require('json-refs');
const swaggerUI = require('swagger-ui-express');
const app = express();
const path = require('path');
const controllers = require('./controllers');

const args = process.argv.slice(2);
const port = args[0] || 3000;

startServer(app);

async function startServer(app) {
  // Handle swagger loading and docs
  const swaggerDocument = YAML.load(path.join('src', 'swagger', 'swagger.yaml'));
  try {
    const resolveRefResults = await resolveRefs(swaggerDocument, {
      // Resolve all remote references
      includeInvalid: true,
      filter: ['relative', 'remote'],
      loaderOptions: {
        processContent: (res, callback) => {
          return callback(YAML.load(res.location));
        }
      }
    });
    const connect = connector(controllers, resolveRefResults.resolved);
    connect(app);
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(resolveRefResults.resolved));

    app.listen(port, () => console.log(`Swagger docs running on http://localhost:${port}/docs`));
  } catch(err) {
    console.error(err);
  }
}
