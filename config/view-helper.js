const path = require('path');
const fs = require('fs');
const env = require('./environment.js');

module.exports = (app) => {

    app.locals.asset_path = function (filePath) {
        if(env.name == 'development'){
            return filePath;
        }
        else
            return JSON.parse(fs.readFileSync(path.join(__dirname,"../public/assets/rev-manifest.json")))[filePath];
    }
}