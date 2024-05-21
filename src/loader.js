'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
// const common = require('../lib/common.js');

const loadDir = async (dir, sandbox) => {
  const files = await fsp.readdir(dir);
  const container = {};
  for (const fileName of files) {
    if (!fileName.endsWith('.js') || fileName.includes('private')) continue;
    const filePath = path.join(dir, fileName);
    const name = path.basename(fileName, '.js');
    container[name] = require(filePath)(sandbox);
  }
  return container;
};

const loadApplication = async (appPath) => {
  const sandbox = {};

  const configPath = path.join(appPath, './config.js');
  sandbox.config = require(configPath);

  const loggerPath = path.join(appPath, './lib/logger.js');
  sandbox.console = require(loggerPath);

  const solanaPath = path.join(appPath, './lib/solana');
  const solana = await loadDir(solanaPath, sandbox);
  sandbox.solana = Object.freeze(solana);

  const scriptsPath = path.join(appPath, './scripts');
  const scripts = await loadDir(scriptsPath, sandbox);
  sandbox.scripts = Object.freeze(scripts);

  return sandbox;
};

module.exports = {
  loadDir,
  loadApplication,
};
