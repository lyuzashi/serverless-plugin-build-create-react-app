const spawn = require('react-dev-utils/crossSpawn');

class BuildReactForSyncPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'before:sync:buckets': this.buildReactApp.bind(this),
      'after:deploy:deploy': this.buildReactApp.bind(this)
    };
  }

  buildReactApp() {
    console.log('building react app');
    const result = spawn.sync(
      'node',
      [require.resolve('react-scripts/scripts/build')],
      { stdio: 'inherit' }
    );
    return Promise.resolve(result.status);

  }
}

module.exports = BuildReactForSyncPlugin;