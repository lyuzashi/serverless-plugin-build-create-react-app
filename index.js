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

  getStackOutputs() {
    const service = this.serverless.service;
    const provider = this.serverless.getProvider('aws');
    const stage = provider.getStage();
    const region = provider.getRegion();
    const serviceName = service.getServiceName();
    const StackName = serviceName + '-' + stage;

    const toUnderscoreCase = s =>
      s.replace(/\.?([A-Z]+)/g, (x,y) => ('_' + y)).replace(/^_/, '').toUpperCase();

    return provider.request('CloudFormation', 'describeStacks', { StackName }, stage, region)
      .then(({ Stacks: [stack] }) => stack.Outputs)
      .then(outputs =>
        outputs.reduce((env, output) =>
          Object.assign(env, { [toUnderscoreCase(output.OutputKey)]: output.OutputValue }),
        {})
      )
  }

  buildReactApp() {
    return this.getStackOutputs().then(outputs => {
      const command = [];
      const env = { ...process.env, ...outputs };
      const buildopts =
        this.serverless.service.custom &&
        this.serverless.service.custom['build-create-react-app'];

      if (buildopts) {
        command.push(require.resolve(buildopts.command + '/scripts/build'));
        if (buildopts.params) {
          command.push(...buildopts.params);
        }
      } else {
        command.push(require.resolve('react-scripts/scripts/build'));
      }

      const result = spawn.sync('node', command, {stdio: 'inherit', env});
      return Promise.resolve(result.status);
    });
  }
}

module.exports = BuildReactForSyncPlugin;
