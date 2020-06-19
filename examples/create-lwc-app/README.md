# create-lwc-app Example

_Quick note, the way I structured this app was so both create-lwc-app and sfdx project directory's could have their own tracked package.json. I also created a package.json at root of the directory for convenience to run the scripts w/ in lwc generated app._

_One thing I would change would be to either use [yarn workspaces](https://classic.yarnpkg.com/en/docs/cli/workspace#search) or setup [lerna](https://lerna.js.org/)_

Can clone or set this example from scratch if you'd like.

If cloning, `npm install` in each directory w/ package.json and authenticate your salesforce org/hub.

## Commands

**This project supports targeting both hosting your lwc app on the web as well as deploying to salesforce**

### Build

```bash
## only for web hosted target
npm run build:web

## only for salefsorce
npm run build:sf

## for both
npm run build
```

### Serve

```bash
## for builidng and running web target
npm run serve:web

## for building and serving build assets from staticresources dir
npm run serve:sf
```

## Project Setup From Scratch

### Salesforce project setup

```bash
mkdir [your-app-name]
```

```bash
cd [your-app-name]
```

```bash
sfdx force:project:create --projectname salesforce
```

Then move the following files to the root of the directory so that the salesforce
provided extensions work.

- .forceignore
- sfdx-project.json
- .vscode/

Inside of sfdx-project.json, update your path to point to the root of the new project directory.

Then w/ vscode plugins or cli, authenticate your salesforce hub/org. **Make sure the `.sfdx/` generated cache folder remains in the root of the project.**

### LWC OSS Project Setup

To setup lwc project is very simple. Learn more about [create-lwc-app](https://github.com/muenzpraeger/create-lwc-app).

```bash
npx create-lwc-app [your lwc project folder name]
```
