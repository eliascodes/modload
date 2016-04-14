'use strict'

require('chai').should()
const path = require('path')
const utils = require('../lib/utils.js')
const nutil = require('util')

describe('Testing `all`', () => {
  it('should return false if all false', (done) => {
    utils.all([false, false, false]).should.equal(false)
    done()
  })

  it('should return false if some false', (done) => {
    utils.all([false, true, true]).should.equal(false)
    done()
  })

  it('should return true if all true', (done) => {
    utils.all([true, true, true]).should.equal(true)
    done()
  })

  it('should return true if all truthy', (done) => {
    utils.all(['something', 1, {}]).should.equal(true)
    done()
  })

  it('should return false if some falsy', (done) => {
    utils.all(['something', null, []]).should.equal(false)
    done()
  })

  it('should return false if all falsy', (done) => {
    utils.all(['', null, undefined]).should.equal(false) // eslint-disable-line
    done()
  })

  it('should return false if any zeros', (done) => {
    utils.all([1, 0, 1]).should.equal(false)
    done()
  })
})

describe('Testing `any`', () => {
  it('should return false if all false', (done) => {
    utils.any([false, false, false]).should.equal(false)
    done()
  })

  it('should return true if some false', (done) => {
    utils.any([false, true, true]).should.equal(true)
    done()
  })

  it('should return true if all true', (done) => {
    utils.any([true, true, true]).should.equal(true)
    done()
  })

  it('should return true if all truthy', (done) => {
    utils.any(['something', 1, {}]).should.equal(true)
    done()
  })

  it('should return true if some falsy', (done) => {
    utils.any(['something', null, []]).should.equal(true)
    done()
  })

  it('should return false if all falsy', (done) => {
    utils.any(['', null, undefined]).should.equal(false) // eslint-disable-line
    done()
  })

  it('should return true if any zeros', (done) => {
    utils.any([1, 0, 1]).should.equal(true)
    done()
  })

  it('should return false if all zeros', (done) => {
    utils.any([0, 0, 0]).should.equal(false)
    done()
  })
})

describe('Testing `isdir`', () => {
  it('should return true for absolute path to directory', (done) => {
    utils.is.dir(__dirname).should.equal(true)
    done()
  })

  it('should return false for absolute path to file', (done) => {
    utils.is.dir(__filename).should.equal(false)
    done()
  })
})

describe('Testing `isPlainObject`', () => {
  it('should return true if object literal', (done) => {
    utils.is.plainObject({}).should.equal(true)
    done()
  })

  it('should return true if object constructed', (done) => {
    utils.is.plainObject(new Object()).should.equal(true) // eslint-disable-line
    done()
  })

  it('should return true if object created', (done) => {
    utils.is.plainObject(Object.create(null)).should.equal(true)
    done()
  })
})

describe('Testing `object.merge`', () => {
  it('should return original object if second is empty', (done) => {
    const o1 = {a: 1, b: 2}
    utils.object.merge(o1, {}).should.deep.equal(o1)
    done()
  })

  it('should overwrite attributes of first argument with second', (done) => {
    const o1 = {a: 1, b: 2}
    const o2 = {a: 2, b: 'b'}
    utils.object.merge(o1, o2).should.deep.equal(o2)
    done()
  })

  it('should add attributes not present in first argument', (done) => {
    const o1 = {a: 1, b: 2}
    const o2 = {c: 'c', b: 'b'}
    utils.object.merge(o1, o2).should.deep.equal({a: 1, b: 'b', c: 'c'})
    done()
  })

  it('should merge objects recursively if both keys are objects', (done) => {
    const o1 = {a: {a1: 1, a2: 2}, b: {b1: 0, b2: 'a'}}
    const o2 = {a: {a0: 0, a1: 'a'}, b: {b0: {}, b2: 'b'}}
    utils.object.merge(o1, o2).should.deep.equal({
      a: {a0: 0, a1: 'a', a2: 2},
      b: {b0: {}, b1: 0, b2: 'b'}
    })
    done()
  })

  it('should overwrite value if only first key corresponds to object', (done) => {
    const o1 = {a: {a1: 1, a2: 0}, b: 2}
    const o2 = {a: [1, 2, 3]}
    utils.object.merge(o1, o2).should.deep.equal({
      a: [1, 2, 3],
      b: 2
    })
    done()
  })

  it('should overwrite value if only second key corresponds to object', (done) => {
    const o1 = {a: [1, 2, 3]}
    const o2 = {a: {a1: 1, a2: 0}, b: 2}
    utils.object.merge(o1, o2).should.deep.equal({
      a: {a1: 1, a2: 0},
      b: 2
    })
    done()
  })

  it('should successfully merge 2 levels deep', (done) => {
    const o1 = {a: {a0: {a0A: 1, a0B: 2}, a1: 's'}, b: {b0: {b0A: 0}}}
    const o2 = {a: {a0: {a0A: 'a'}}, b: {b0: {b0A: 1, b0B: 'b'}}}
    utils.object.merge(o1, o2).should.deep.equal({
      a: {a0: {a0A: 'a', a0B: 2}, a1: 's'},
      b: {b0: {b0A: 1, b0B: 'b'}}
    })
    done()
  })
})

describe('Testing `createNested.fromString`', () => {
  it('should return empty object for empty filepath', (done) => {
    utils.object.createNested.fromString('').should.deep.equal({})
    done()
  })

  it('should parse string with no separator', () => {
    utils
      .object
      .createNested
      .fromString('index', path.sep, null).should.deep.equal({index: null})
  })

  it('should parse string with single separator', () => {
    utils
      .object
      .createNested
      .fromString('foo/index', path.sep, 1).should.deep.equal({foo: {index: 1}})
  })

  it('should parse string with two separators', () => {
    utils
      .object
      .createNested
      .fromString('foo/bar/index', path.sep, 1).should.deep.equal({foo: {bar: {index: 1}}})
  })
})

describe('Testing `parser`', () => {
  it('should merge defaults', (done) => {
    const defaults = {a: 1, b: 2}
    const parser = utils.object.parser(defaults, {})
    parser({}).should.deep.equal(defaults)
    done()
  })

  it('should throw if validation unsuccessful', (done) => {
    const defaults = {}
    const validators = {a: (x) => utils.is.a(x, 'string')}
    const parser = utils.object.parser(defaults, validators)

    const fn = () => parser({a: 1})
    fn.should.throw(Error)
    done()
  })

  it('should not throw if validation is successful', (done) => {
    const defaults = {}
    const validators = {a: nutil.isString}
    const parser = utils.object.parser(defaults, validators)

    const input = {a: 'hello'}

    const fn = () => parser(input)
    fn.should.not.throw(Error)
    fn().should.deep.equal(input)
    done()
  })
})

describe('Testing `combine`', () => {
  it('should wrap a single RegExp in brackets and return it', (done) => {
    utils.regex.combine(/hello/).should.deep.equal(/(hello)/)
    done()
  })

  it('should successfully combine several arguments', (done) => {
    utils.regex.combine(/hello/, /my/, /name/, /is/)
      .should.deep.equal(/(hello)|(my)|(name)|(is)/)
    done()
  })
})
