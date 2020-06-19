const path = require('path');
const StaticResourcePlugin = require('static-resource-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const staticResourcePath = path.resolve(
    '../salesforce/force-app/main/default/staticresources/'
);
const SfdxDeploy = require('sfdx-deploy-webpack-plugin');

module.exports = {
    plugins: [
        new StaticResourcePlugin({
            staticResPath: staticResourcePath
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'git-ignore-template.txt',
                    to: `${staticResourcePath}/app/.gitignore`,
                    toType: 'template'
                },
                {
                    from: 'src/resources/',
                    to: `${staticResourcePath}/app/resources/`
                }
            ]
        }),
        new SfdxDeploy({
            projectPath: '../salesforce/force-app/main/default/'
        })
    ]
};
