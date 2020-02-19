const fs = require('fs')
const packageJson = require('./package.json')

const data = {
    "version": packageJson.version,
    "links": {
        "mac": "minesis-launcher-" + packageJson.version + ".dmg",
        "win": "minesis-launcher Setup " + packageJson.version + ".exe",
        "linux": "minesis-launcher-" + packageJson.version + ".AppImage"
    }
}

fs.writeFileSync('./dist/launcher.json', JSON.stringify(data, null, 4))
