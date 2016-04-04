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
*   namespace: ('app'* | string)
*   output: ('array'* | 'object'),
*   stopFile: (null* | string),
*   mapper: (require* | function),
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
