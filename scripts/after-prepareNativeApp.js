var path = require("path");
var fs = require("fs");
const { mergePropertiesFiles, savePropertiesFile } = require("merge-properties-files");

module.exports = function ($logger, projectData, injector, hookArgs) {
    return new Promise(function (resolve, reject) {
        var platformName = ((hookArgs && hookArgs.platformData && hookArgs.platformData.normalizedPlatformName) ||
            (hookArgs.checkForChangesOpts && hookArgs.checkForChangesOpts.platform) ||
            '').toLowerCase();
        projectData =
            hookArgs && (hookArgs.projectData || (hookArgs.checkForChangesOpts && hookArgs.checkForChangesOpts.projectData));
        if (platformName === 'android') {
            const appResourcesPath = projectData.appResourcesDirectoryPath;
            const platformPropertiesFilePath = path.join(projectData.platformsDir, 'android', 'gradle.properties');
            const propertiesFilePath = path.join(appResourcesPath, 'Android', 'gradle.properties');
            if (fs.existsSync(propertiesFilePath)) {
                const merged = mergePropertiesFiles(platformPropertiesFilePath, propertiesFilePath);
                return savePropertiesFile(platformPropertiesFilePath, merged).then(resolve).catch(reject);
            }
        }
        resolve();
    });
};