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

> **Note** Create React App and Serverless can coexist in a single project. 

## Variables

AWS stack outputs are loaded into the build environment, converted to uppercase with underscores.

This allows references and attributes from resources such as an API endpoint, for example, to be injected into index.html via InterpolateHtmlPlugin.

> **Note** Create React App whitelists `PUBLIC_URL` and environment variables that start with `REACT_APP_`. All other environment variables are ignored in the template.

```yaml
# serverless.yml
  Outputs:
    ReactAppEndpoint:
      Description: API Gateway endpoint for serverless function calls
      Value: 
        Fn::Join:
          - ''
          - - Ref: ApiGatewayRestApi
            - .execute-api.${self:provider.region}.amazonaws.com
```

```html
<!-- index.html -->
<script id="global_settings" type="application/json">
  {
    "public_url": "%PUBLIC_URL%",
    "files_url": "%REACT_APP_FILES_URL%"
  }
</script>
```
## Configuration
If you're using a custom script to build the project you can supply the build parameters in the custom settings of serverless.yml. For example, if you're using Typescript with react-app-rewired and the build script in package.json is `"react-app-rewired build --scripts-version react-scripts-ts"` you can configure the plugin to use this command like this:

```yaml
# serverless.yml
custom:
  build-create-react-app:
    command: react-app-rewired
    params:
      - --scripts-version
      - react-scripts-ts
```
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

