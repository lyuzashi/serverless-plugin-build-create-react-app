# Serverless Plugin for Create React App

Use this plugin with [serverless](https://serverless.com) and [Create React App](https://www.npmjs.com/package/create-react-app) to build a React app at deployment time.

Designed for use with [S3 Sync plugin](https://www.npmjs.com/package/serverless-s3bucket-sync), but deployment of the build to a server can be handled any way.

## Usage

Add the plugin package to your project from [NPM](https://www.npmjs.com/package/serverless-plugin-build-create-react-app):

```bash
# With yarn
$ yarn add serverless-plugin-build-create-react-app

# With npm
$ npm install serverless-plugin-build-create-react-app --save
```

Add the plugin to the project's `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-build-create-react-app
```

Note, Create React App and Serverless can coexist in a single project. 

## Hooks

* On running `serverless deploy`, Create React App will spawn the build process and generate a static site in the `build` directory
* This directory can be synced to an S3 bucket with `s3bucket-sync`
* This plugin also hooks into `serverless sync` for fast deployments of the React App

Example config for `s3bucket-sync` to sync the build directory:

```yaml
custom:
  s3-sync:
    - folder: build
      bucket: my-s3-website-bucket
```

## License

This plugin is released under the [MIT license](LICENSE.md).

## Contribution

Issues and pull requests are open.

