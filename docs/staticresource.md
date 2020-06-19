# Staticresources

:mega: _Important note, this guide is intended for sfdx's source format and not the older metadata format_

Staticresources provide developers a platform CDN (content distribution network) where we can store our web assets to use w/ in our apps.

##### Additional Links:

- [Trailheads excellent writeup on Staticresources](https://trailhead.salesforce.com/en/content/learn/modules/visualforce_fundamentals/visualforce_static_resources)

_Prior to [SFDX](https://developer.salesforce.com/tools/sfdxcli) and Source Format, the salesforce dev community used tools such as [Mavensmate](https://github.com/joeferraro/MavensMate-SublimeText) to automate the deployment process of your staticresource files by zipping/compressing them prior to deploying. Since SFDX/Source format project structure handles the auto-expanding or compressing of your staticresource folders, we no longer have to worry about this step in the build/deploy process_

##### _Quick Background_

_For traditional web development, we rely on open source tooling and scaffolding that converts our framework/library code to code the browser can understand and run. These build processes generate a `build` or `dist` folder containing the shipping code generated from our source. We then deploy those assets to one of several hosting solutions._

### Project Filesystem strategies

- Place the entire frontend/spa project inside of the staticresource directory (Easiest)
  ```txt
  ├── README.md
  ├── sfdx-project.json
  ├── force-app
  |   └── main
  |       └── default
  |           └── staticresources
  |                └── app
  |                    ├── package.json
  |                    ├── src
  |                    └── dist
  ```
- Place the project at the root of the main project directory and output the production build files in the staticresource directory.

  ```txt
  ├── README.md
  ├── sfdx-project.json
  ├── app
  |   ├── package.json
  |   └── src
  ├── force-app
  |   └── main
  |       └── default
  |           └── staticresources
  |                └── app ** [Only placing the build output here] **
  |                    └── dist
  ```

_Personally I prefer keeping the project at the root of the directory. There's a few advantages to this tactic. One of them being not hitting the standard 5mb limit of uploading a staticresource folder to salesforce. Another is being able to build a frontend spa that can be hosted w/ on a cloud service as well as being used w/ in salesforce_

If you were just to include your frontend project source files along w/ your build/dist (code your ship to the browser) w/ in the staticresource uncompressed folder, then you might eventually hit the 5mb size limit.
