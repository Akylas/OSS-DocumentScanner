const fs = require('fs');
const plist = require('plist');

const licenseUrls = {
    'Apache 2.0': 'http://www.apache.org/licenses/LICENSE-2.0',
    MIT: 'http://www.apache.org/licenses/LICENSE-2.0',
    mit: 'http://www.apache.org/licenses/LICENSE-2.0',
    BSD: 'https://opensource.org/licenses/BSD-3-Clause'
};
const obj = plist.parse(fs.readFileSync('./platforms/ios/Pods/Pods-nsforecastie-metadata.plist', 'utf8'));
const result = {
    dependencies: obj.specs.map(spec => ({
        moduleName: spec.name,
        moduleDescription: spec.summary,
        moduleVersion: spec.version,
        moduleLicense: spec.licenseType,
        moduleUrl: spec.homepage,
        moduleLicenseUrl: licenseUrls[spec.licenseType]
    }))
};
fs.writeFileSync('./app/ios/licenses.json', JSON.stringify(result));
