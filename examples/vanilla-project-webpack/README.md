# vanilla-project-webpack Example

### This project/example will complete the following:

1. Emit webpack assets to the staticresources directory.
2. Create a .gitignore and place it in `staticresources/[webpack entry]` folder so we don't track the build files.
3. Create any necessary `[name].resource-xml` files that are required to deploy staticresource files to salesforce.
4. Update configured visualforce component named, `AppBundles.component` to include js and css files from webpack.
5. Deploy webpack build files, and visualforce component to salesforce once webpack compilation is complete.

## Try it out

- Clone Repo
- cmd `npm install`
- Authorize/Setup your org
- cmd `npm run build`

<br/>

Sections below breakdown the config.
Final webpack config can be found w/ in `build-config` folder.

## Webpack Output files to staticresource directory

**webpack.config.js**

```js
const path = require("path");
// resolve fs path to baseline folder
const staticResourcePath = path.resolve(
  "./force-app/main/default/staticresources/"
);
module.exports = {
  // entry point of your front-end spa
  entry: path.resolve("./app/index.js"),
  // where your assets are emitted
  output: {
    // name defaults to => 'main'
    filename: "[name].bundle.js",
    // places your bundle ./force-app/main/default/staticresources/app/...
    path: `${staticResourcePath}/app/`
  }
};
```

## gitignore build contents but keep the staticresource folder(s)

Create `git-ignore-template.txt` file w/ contents:

```txt
# Ignore everything in this directory
*
# Except this file
!.gitignore
```

This will tell git to track the folder but not its contents by placing a `.gitignore` in the same directory as the build files. That way we don't clutter up git history from the build file(s) and assets.

**webpack.config.js**

```js
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const staticResourcePath = path.resolve(
  "./force-app/main/default/staticresources/"
);

module.exports = {
  entry: path.resolve("./app/index.js"),
  output: {
    filename: "[name].bundle.js",
    path: `${staticResourcePath}/app/`
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "git-ignore-template.txt"),
          to: `${staticResourcePath}/app/.gitignore`,
          toType: "template"
        }
      ]
    })
  ]
};
```

<br/><br/><br/>

## Optional Webpack Plugins

### static-resource-webpack-plugin

Creates any needed .resouce-xml files to deploy to salesforce. [More Info](https://github.com/mjyocca/static-resource-webpack-plugin#readme)

**webpack.config.js**

```js
const path = require("path");
const StaticResourceCreate = require("static-resource-webpack-plugin");

const staticResourcePath = path.resolve(
  "./force-app/main/default/staticresources/"
);

module.exports = {
  entry: path.resolve("./app/index.js"),
  output: {
    filename: "[name].bundle.js",
    path: `${staticResourcePath}/app/`
  },
  plugins: [
    new StaticResourceCreate({
      staticResPath: staticResourcePath
    })
  ]
};
```

<hr/>

### sfdx-deploy-webpack-plugin

Watches your project file system w/ in your force-app directory and deploys anything that has changed. The plugin also offers options to alter the default behavior and deploy specific files or entire project as well.s [More Info](https://github.com/mjyocca/sfdx-deploy-webpack-plugin)

**webpack.config.js**

```js
const path = require("path");
const SfdxDeploy = require("sfdx-deploy-webpack-plugin");
const staticResourcePath = path.resolve(
  "./force-app/main/default/staticresources/"
);

module.exports = {
  entry: path.resolve("./app/index.js"),
  output: {
    filename: "[name].bundle.js",
    path: `${staticResourcePath}/app/`
  },
  plugins: [new SfdxDeploy()]
};
```

<hr>

### visualforce-template-webpack-plugin

Updates your Visualforce page(s) or component(s) to include your js and css files [More Info](https://github.com/mjyocca/visualforce-template-webpack-plugin)

**webpack.config.js**

```js
const path = require("path");
const VisualforcePlugin = require("visualforce-template-webpack-plugin");
const staticResourcePath = path.resolve(
  "./force-app/main/default/staticresources/"
);

module.exports = {
  entry: path.resolve("./app/index.js"),
  output: {
    filename: "[name].bundle.js",
    path: `${staticResourcePath}/app/`
  },
  plugins: [
    new VisualforcePlugin({
      page: path.resolve(
        "./force-app/main/default/components/AppBundles.component"
      )
    })
  ]
};
```
