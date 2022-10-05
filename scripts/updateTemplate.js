const path = require('path');
const { inheritTheme } = require('../node_modules/@vue-storefront/cli/dist/domains/theme/index.js');

const run = async () => {
  const integrationPath = path.join(__dirname, '../packages/theme/');
  const projectPath = path.join(__dirname, '../../orc-vsf-template/');

  await inheritTheme({
    projectPath,
    integrationPath
  });
};

run();
