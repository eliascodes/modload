/*
* Autoloader
*
* API:
* const autoloader = require('autoloader')
*
* Default behaviour:
* const modulesArray = autoloader.load(__dirname, excludes)
* // or
* const modulesArray = autoloader.load({
*   dir: __dirname,
*   include: [...patterns],
*   exclude: [...patterns],
*   global: (false* | true),
*   output: ('array'* | 'object'),
* })
*
* Object output mirrors directory structure:
* ./
* |- app
* |- |- controllers
* |- |- |- IndexController
* |- |- |- |- index.js
* gives app.controllers.IndexController, while
* ./
* |- app
* |- |- controllers
* |- |- |- IndexController.js
* gives app.controllers.IndexController as well
*/
'use strict'

const fs = require('fs')
const path = require('path')

export default function (dirname, excludes) {
  console.log('[AUTOLOAD] Autoloading files from ' + dirname)

  return recRead(dirname, excludes, true)
          .filter((file) => typeof file !== 'undefined')
          .map((file) => require(file))
}

function recRead (dirname, excludes, isRoot) {
  return fs.readdirSync.map((file) => {
    if (file in excludes) {
      console.log('[AUTOLOAD] Excluding ' + file + ' from loading')
      return undefined
    } else if (file.indexOf('.js') > -1 && (isRoot || file === 'index.js')) {
      return path.join(dirname, file)
    } else if (fs.isdirSync(file)) { // ? double check
      return recRead(path.join(dirname, file), excludes, false)
    } else {
      return undefined
    }
  })
}
