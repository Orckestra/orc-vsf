const path = require('path');
const globby = require('globby');
const rimraf = require('rimraf');
const fse = require('fs-extra');
const { inheritTheme } = require('@vue-storefront/cli/dist/domains/theme');

const run = async () => {
  const integrationPath = path.join(__dirname, '../packages/theme/');
  const projectPath = path.join(__dirname, '../../orc-vsf-template-output/');
  const templateRepoPath = path.join(__dirname, '../../orc-vsf-template');

  await inheritTheme({
    projectPath,
    integrationPath
  });

  // remove old files, except .git and yarn.lock
  await globby([`${templateRepoPath}/**/*`, `${templateRepoPath}/**/.*`, `!${templateRepoPath}/yarn.lock`, `!${templateRepoPath}/.git`]).then(
    function then(paths) {
      paths.map(function map(item) {
        rimraf.sync(item);
      });
    }
  );

  await fse.copy(projectPath, templateRepoPath, { overwrite: true });
};

run();
