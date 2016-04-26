# Node Autoloader
A simple autoloader for node modules.

## Install
Local:
```
npm install modload --save
```

Global:
```
npm install modload -g
```

## Examples
* Require all files in a given directory and store the results in an array:
  ```javascript
  const load = require('modload')

  const plugins = load.asArray({
    dir: path.join(__dirname, 'plugins')
  })

  server.register(plugins, (err) => {
    if (err) throw new Error(err)
  })
  ```

* Require all files in a given directory and store the results in an object whose structure matches the directory structure:
  ```javascript
  const load = require('modload')

  const app = load.asObject({
    dir: path.join(__dirname, 'app')
  })
  ```
  If the directory structure looks like:
  ```
  ./
  |- app
  |- |- routes
  |- |- |- home.js
  |- |- |- login.js
  |- |- plugins
  |- |- |- auth.js
  ```
  Then the resulting object will match this structure:
  ```javascript
  const app = {
    routes: {
      home: require('./app/routes/home.js'),
      login: require('./app/routes/login.js')
    },
    plugins: {
      auth: require('./app/routes/auth.js')
    }
  }
  ```
  This object can be attached to the `global` object via an optional argument.

## API
Modload provides two methods, which both take an options object to configure their behaviour.

<hr>

### `asArray(options)`
##### Return
Array of required modules.

##### Parameters
###### options
Options object with the following fields:
> ##### `dir`
> ###### ( String | required )
> Root directory of files to require
> ##### `include`
> ###### ( Array of RegExp | default: null )
> RegExp patterns of files to include. Patterns are combined into a single regex pattern with OR. Exclude patterns take precedence over include patterns.
> ##### `exclude`
> ###### ( Array of RegExp | default: null )
> RegExp patterns of files to exclude. Patterns are combined into a single regex pattern with OR. Exclude patterns take precedence over include patterns.
> ##### `stopfile`
> ###### ( String or RegExp | default: null )
> A file in the directory tree matching this pattern is interpreted as the entry point for it's parent directory. Only this file is required; all other files in the same directory, and in sub-directories, are skipped.
> ##### `es6modules`
> ###### ( Boolean | default: `false` )
> A flag to specify whether modules are exported with ES6 module syntax (i.e. using the `export` keyword). If `true`, modload will require the default value (i.e., whatever is exported by `export default`)

### `asObject(options)`
##### Return
Array of module objects

##### Parameters
###### options
Options object with exactly the same fields as for the `asArray` method, but with the following additional field:
> ##### `isglobal`
> ###### ( Boolean | default: false )
> If true, the returned object will also be attached to the `global` object under the key specified by the `namespace` parameter
> ##### `namespace`
> ###### ( String | default: 'app' )
> Specifies the key of the `global` object to which the object will be attached.
