const fs = require('fs');
const path = require('path');
const buildToolsPath = path.join('platforms', 'android', 'build-tools');
const whitelist = fs.readFileSync(path.join(buildToolsPath, 'whitelist.mdg'), { encoding: 'utf-8' });
const whitelistfilteredLines = [...new Set(whitelist.split('\n'))].filter((l) => l.length > 0 && !l.startsWith('//'));
const blacklist = fs.readFileSync(path.join(buildToolsPath, 'blacklist.mdg'), { encoding: 'utf-8' });
const blacklistfilteredLines = [...new Set(blacklist.split('\n'))].filter((l) => l.length > 0 && !l.startsWith('//'));
const proguard_blacklist = require(path.join('../App_Resources','Android', 'native-api-usage.json')).proguard_blacklist;

function getIdentifier(l) {
    let identifier = l;
    let suffix = '';
        if (identifier.endsWith('*:*')) {
            suffix =  '.**'
            identifier = identifier.slice(0, -3);
        }
        return identifier.replace(':', '.').replace(/\*/g, '**') + suffix;
    }

// const KEEP_PARAMS = '-keep,includedescriptorclasses,allowoptimization public class';
const KEEP_PARAMS = '-keep,allowoptimization public class';
let data = `#-dontobfuscate
-dontwarn **
#-keepattributes *Annotation*, EnclosingMethod, Exceptions, InnerClasses
-keepattributes EnclosingMethod, InnerClasses

-keep,includedescriptorclasses        class     com.tns.** { *; }
-keep,includedescriptorclasses public interface com.tns.** { *; }

${whitelistfilteredLines
    .map((l) => {
        let identifier = l;
        if (identifier.endsWith('*:*')) {
            identifier = identifier.slice(0, -3).replace(':', '.');
            const toBlacklist = proguard_blacklist.filter((l2) => l2.startsWith(identifier));
            // console.log('test', identifier, toBlacklist.length)
            if (toBlacklist.length) {
                return `${KEEP_PARAMS} ${toBlacklist.map((l2) => '!' + getIdentifier(l2).replace(':', '.')).join(',')},${identifier}.** { public protected *; }`;
            }
            return `${KEEP_PARAMS} ${identifier}.** { public protected *; }`;
        }
        if (identifier.endsWith('*')) {
            identifier = identifier.slice(0, -1).replace(':', '.');

        } else {
            identifier = identifier.replace(':', '.');

        }
        return `${KEEP_PARAMS} ${identifier}** { public  *; }`;
    })
    .join('\n')}
`;

const appProguard = path.join('App_Resources', 'Android', 'proguard-rules.pro');
if (fs.existsSync(appProguard)) {
    data += '\n' + fs.readFileSync(appProguard, 'utf-8');
}

fs.writeFileSync(path.join(buildToolsPath, 'proguard-rules.pro'), data);

console.log('updated proguard file!');
