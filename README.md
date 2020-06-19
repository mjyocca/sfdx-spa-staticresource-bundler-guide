# :cloud: [SFDX]() SPA StaticResource Bundler Guide :rocket:

**Guided tutorials/examples of how to implement SPA (Single Page Applications) w/ your [salesforce]() sfdx project.**

## :school_satchel: Outline

- [Introduction]()
  - [Toolchain Visualized]()
- [Quickstart Tutorial]()
- [:fire: Examples :fire:]()
  - [Vanilla Project w/ Webpack](./examples/vanilla-project-webpack)
  - [create-lwc-app](./examples/create-lwc-app)
  - [create-react-app](./examples/create-react-app)
  <div style="margin-left:25px;">
    <img height="40" alt="webpack" style="align-self:center;margin: 0 5px 0 5px;max-height:40px;" src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.svg" />
    <img height="40"  alt="lwc" style="max-height:40px;vertical-align:center;" src="./media/lwc.svg" />
         <img height="40" alt="react" style="max-height:40px;vertical-align:center;" src="./media/react.svg" />
  </div>

#### _Additional Docs_

- _Salesforce guide on getting your local machine setup with vscode, sfdx cli, etc. [here](https://developer.salesforce.com/tools/vscode/en/getting-started/install)_
- [What is salesforce sfdx?](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [What are staticresources?](https://trailhead.salesforce.com/en/content/learn/modules/visualforce_fundamentals/visualforce_static_resources)
- [What is a spa (single page application)?](https://en.wikipedia.org/wiki/Single-page_application)

## :wave: Introduction

**The point of this guide is showcase strategies across different tools/scaffolding/frameworks, how to bundle and deploy to salesforce. Additionally when possible automate this process :fire:**

When building SPA's on salesforce, our main objective is to:

1.  Build our applications in modern javascript/typescript etc.
2.  Run our build tooling to transpile (convert to old syntax), bundle and minify our source code to the `force-app/main/default/staticresource/` directory.
3.  Deploy our development/production builds to our salesforce orgs/or package them.

### :chart_with_upwards_trend: Toolchain Visualized

##### :wrench: Tooling

_There are several open source build-tooling options available out there but [webpack](https://webpack.js.org/) and [rollup](https://rollupjs.org/guide/en/) seem to be the most predominant/favorabale. If not possible w/ chosen scaffolding can always resort to scripting. In the examples we'll be using webpack but similar results can be accomplished with `rollup`._

#### :file_folder: Before our build runs

```txt
frontend-app
├── README.md
├── package.json
├── node_modules
├── src
|   ├── app.js
|   ├── components
|   └── library
```

**app.js** Example Source code (react)

```js
class Square extends React.Component {
  render() {
    return <button className="square">{this.props.value}</button>;
  }
}
```

#### :file_folder: After our build runs

```txt
frontend-app
├── README.md
├── package.json
├── node_modules
├── dist
│   ├── 0.bundle.js
│   ├── app.bundle.js
|   └── app.css
├── src
|   ├── app.js
|   ├── components
|   └── library
```

**app.bundle.js** Transpiled/Bundled code

```js
var Square = /*#__PURE__*/ function (_React$Component) {
  _inherits(Square, _React$Component);
  var _super = _createSuper(Square);
  function Square() {
    _classCallCheck(this, Square);
    return _super.apply(this, arguments);
  }
  _createClass(Square, [
    {
      key: "render",
      value: function render() {
        return /*#__PURE__*/ React.createElement(
          "button",
          {
            className: "square",
          },
          this.props.value
        );
      },
    },
  ]);
  return Square;
};
```

## :cloud: Quickstart - How to apply this to a Salesforce sfdx project

### Steps

- Create a sfdx project
- Create our frontend project in a new sub-directory
- Setup the project tooling where we'll point the build destination in our `staticresources` dir
- Create a `[foldername].resource-meta.xml` file for each direct child folder/file inside of our `staticresources` directory. (Either during the build process or post build)
- :fire: Finally deploy those files to your salesforce org :fire:

<!-- #### :file_folder: Basic Sfdx project structure:  -->

**Step 1: Create a sfdx project**

In the terminal type in

```bash
sfdx force:project:create --projectname salesforce-project
```

:file*folder: \_Sfdx project we just created*

```txt
salesforce-project
├── README.md
├── sfdx-project.json
├── .sfdx
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── force-app
|   └── main
|       └── default
|           ├── aura
|           ├── classes
|           ├── objects
|           └── staticresources
├── manifest
|   └── package.xml
```

In order to deploy later on you'll need to authorize your salesforce dev/hub org.

**Step 2: Create and setup our frontend project inside of our root `salesforce-project`**

```bash
mkdir src
```

_and then change into that new directory_

```bash
cd src
```

_This is when you can decide if you want to setup a scaffolding/framework of your choosing. For sake of demonstration we'll go w/ a vanilla :icecream: js example._

_Create our npm package.json to track our dependencies and add our scripts_

```bash
npm init -y
```

_Create a **index.js** file inside of the `src` directory_

```js
/* If want to include polyfills */
import "core-js/stable";
import "regenerator-runtime/runtime";

const app = () => {
  const root = document.createElement("div");
  root.innerHtml = `Hello World`;
  return root;
};
document.body.appendChild(app());
```

**Step 3: Setup our projects tooling with webpack**

_Install dev dependencies_

```bash
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env
```

_Install dependencies_

```bash
npm install --save core-js@3
```

```bash
# Inside of root directory
touch webpack.config.js
```

_Setup our webpack config, can copy and paste from below_

**webpack.config.js**

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].bundle.js",
    // will output all assets that run through webpack in our staticresources directory
    path: path.resolve(__dirname, "force-app/main/default/staticresources/app"),
  },
  /*
    When webpack runs, it'll read the contents of your files. When it encounters either a `import` or a `require` statement, it will run the regex test rule to determine to run each loader
    on the current file. So example below, all js files will run through babel so we can use the latest and greatest syntax features. However you will need add polyfills to work in older browsers
  */
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            {
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
        },
      },
    },
  ],
};
```

_Modify the package.json (in your `src` directory) file and add a script_

```json
"scripts": {
  "build": "webpack --config webpack.config.js"
}
```

**Step 4: Create our `[foldername].resource-meta.xml` file**

_We then place these files and assets in our local sfdx `staticresources` project directory along w/ a `[foldername].resource-meta.xml` file._

**app.resource-meta.xml**

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
  <cacheControl>Public</cacheControl>
  <contentType>application/zip</contentType>
</StaticResource>
```

_This file is needed so salesforce knows how to compress and store them in the salesforce provided cdn to use throughout your visualforce pages and lightning components._

<br/>

_Run the script, either through the terminal or if using vscode can click on npm scripts button_

```bash
npm run build
```

:file_folder: What the current project should look like

```txt
salesforce-project
├── README.md
├── sfdx-project.json
├── .sfdx
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── force-app
|   └── main
|       └── default
|           ├── aura
|           ├── classes
|           ├── objects
|           └── staticresources
|               ├── app ** WHERE our Bundled Assets Will Go
|               └── app.resource-meta.xml
├── src
|   ├── node_modules
|   ├── package.json
|   └── index.js
├── manifest
|   └── package.xml
```

**Step 5: Deploy to your salesforce Org (make sure you authenticated an org)**

_run in your terminal_

```bash
sfdx force:source:deploy -p force-app/main/default/staticresources/app
```

If you wish to automate the above tutorial, take a look at the [Vanilla Project Webpack](./examples/vanilla-project-webpack) example.

_quick note_

**Staticresources have a 5mb limit per folder and a 250mb limit org wide. With this limitation and to avoid issues down the line, the examples/guides are strutured to only include production/shipping code in the staticresource folders.** Read more [here]().

## :fire: Examples :fire:

<h3 style="display:flex;align-items:center;">
  <img height="40" alt="webpack" style="align-self:center;margin: 0 5px 0 5px;max-height:40px;" src="https://raw.githubusercontent.com/webpack/media/master/logo/icon.svg" />
  <a style="margin-left:5px;" href="./examples/vanilla-project-webpack">Vanilla Project w/ Webpack</a>
</h3>

_If you prefer to set up your own JavaScript toolchain from scratch._

<h3 style="display:flex;align-items:center;">
    <img height="40"  alt="lwc" style="max-height:40px;vertical-align:center;" src="./media/lwc.svg" />
    <a href="./examples/create-lwc-app">create-lwc-app</a>
</h3>

_If you prefer `lightning-web-components (Open Source)` as your frontend framework of choice and `create-lwc-app` for your project scaffolding :fire:_

<h3 style="display:flex;align-items:center;">
     <img height="40" alt="react" style="max-height:40px;vertical-align:center;" src="./media/react.svg" />
    <a href="./examples/create-react-app">create-react-app</a>
</h3>

_`Coming Soon` - Can create a similar scaffolding to create-react-app starting from the vanilla project example. [Guide on creating your own project tooling](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)_

<br>

## :beers: Cheers!

Submit a pull request to contribute

or

Submit a issue if you would like to see more examples or update current ones
