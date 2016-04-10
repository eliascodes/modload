# Node Autoloader
A simple autoloader for node modules.

## Examples
* Require all files in a given directory and store the results in an array:
  ```javascript
  const autoload = require('autoloader')

  const plugins = autoload.asArray({
    dir: path.join(__dirname, 'plugins')
  })

  server.register(plugins, (err) => {
    if (err) throw new Error(err)
  })
  ```

* Require all files in a given directory and store the results in an object whose structure matches the directory structure:
  ```javascript
  const autoload = require('autoloader')

  const app = autoload.asObject({
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
      home: require('app/routes/home.js'),
      login: require('app/routes/login.js')
    },
    plugins: {
      auth: require('app/routes/auth.js')
    }
  }
  ```
  This object can be attached to the `global` object via an options object.

## API
The autoloader module provides two methods, which both take an options object to configure their behaviour.

<hr>

### `asArray(options)`
##### Return
Array of module objects

##### Parameters
###### options
Options object with the following fields:
> ##### `dir`
> ###### ( String | required )
> Root directory of files to require
> ##### `include`
> ###### ( Array of RegExp | default: null )
> RegExp patterns of files to require. Patterns are sequentially applied. Exclude patterns take precedence over include patterns.
> ##### `exclude`
> ###### ( Array of RegExp | default: null )
> RegExp patterns of files to require. Patterns are sequentially applied. Exclude patterns take precedence over include patterns.
> ##### `stopfile`
> ###### ( String or RegExp | default: null )
> A file in the directory tree matching this pattern is interpreted as the entry point for it's parent directory. Only this file is required; all other files in the same directory, and in sub-directories, are skipped.

### `asObject(options)`
##### Return
Array of module objects

##### Parameters
###### options
Options object with the following fields:
> ##### `dir`
> ###### ( String | required )
> Root directory of files to require
> ##### `include`
> ###### ( Array of RegExp | default: null )
> RegExp patterns of files to require. Patterns are sequentially applied. Exclude patterns take precedence over include patterns.
> ##### `exclude`
> ###### ( Array of RegExp | default: null )
> RegExp patterns of files to require. Patterns are sequentially applied. Exclude patterns take precedence over include patterns.
> ##### `stopfile`
> ###### ( String or RegExp | default: null )
> A file in the directory tree matching this pattern is interpreted as the entry point for it's parent directory. Only this file is required; all other files in the same directory, and in sub-directories, are skipped.
> ##### `namespace`
> ###### ( String | default: null )
> If set to a non-null string, specifies the key of the `global` object to which the object will be attached.
