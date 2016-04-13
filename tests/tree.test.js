'use strict'

require('chai').should()
const fs = require('fs')
const path = require('path')
const tree = require('../lib/tree.js')

const DIR_DUMMY = path.join(__dirname, 'dummy')

function assertNumFilesInResults (n, dir, array) {
  array.length.should.equal(n)

  array.forEach((el) => {
    el.search(dir).should.equal(0)
    fs.statSync(el).isFile().should.equal(true)
  })
}

describe('Walking with default options', () => {
  it('should return all files when using default options', (done) => {
    const result = tree.walk(DIR_DUMMY)

    assertNumFilesInResults(11, DIR_DUMMY, result)

    done()
  })
})

describe('Walking with exclusions', () => {
  it('should exclude single file specified', (done) => {
    const exc = /file.dummy.2.js/

    const result = tree.walk(DIR_DUMMY, null, exc)

    assertNumFilesInResults(10, DIR_DUMMY, result)

    done()
  })

  it('should exclude many files matching pattern', (done) => {
    const exc = /.js/

    const result = tree.walk(DIR_DUMMY, null, exc)

    assertNumFilesInResults(5, DIR_DUMMY, result)

    done()
  })

  it('should exclude array of patterns', (done) => {
    const exc = [/\.md/, /\.txt/, /\.css/, /\.scss/, /\.html/]

    const result = tree.walk(DIR_DUMMY, null, exc)

    assertNumFilesInResults(6, DIR_DUMMY, result)

    done()
  })
})

describe('Walking with includes', () => {
  it('should return only file matching include pattern', (done) => {
    const inc = /dir_dummy_4/

    const result = tree.walk(DIR_DUMMY, null, null, inc)

    assertNumFilesInResults(1, DIR_DUMMY, result)

    done()
  })

  it('should return all files matching include pattern', (done) => {
    const name = 'file.dummy.1.js'
    const inc = new RegExp(name + '$')

    const result = tree.walk(DIR_DUMMY, null, null, inc)

    assertNumFilesInResults(4, DIR_DUMMY, result)

    result.forEach((file) => {
      file.search(name).should.equal(file.length - name.length)
    })

    done()
  })

  it('should include array of patterns', (done) => {
    const exc = [/\.md/, /\.txt/, /\.css/, /\.scss/, /\.html/]

    const result = tree.walk(DIR_DUMMY, null, null, exc)

    assertNumFilesInResults(5, DIR_DUMMY, result)

    done()
  })
})

describe('Walking with includes and excludes', () => {
  it('should return all include files for non-overlapping include/exclude patterns', (done) => {
    const exc = /dir_dummy_/
    const inc = /\.md/

    const result = tree.walk(DIR_DUMMY, null, exc, inc)

    assertNumFilesInResults(1, DIR_DUMMY, result)

    result[0].should.equal(path.join(DIR_DUMMY, 'file.dummy.3.md'))

    done()
  })

  it('should return only non-overlapping files for overlapping inc/exc patterns', (done) => {
    const exc = /dir_dummy_/
    const inc = /file.dummy.1.js$/

    const result = tree.walk(DIR_DUMMY, null, exc, inc)

    assertNumFilesInResults(1, DIR_DUMMY, result)

    result[0].should.equal(path.join(DIR_DUMMY, 'file.dummy.1.js'))

    done()
  })

  it('should return no files for identical include/exclude patterns', (done) => {
    const exc = /dir_dummy_1/
    const inc = exc

    const result = tree.walk(DIR_DUMMY, null, exc, inc)

    assertNumFilesInResults(0, DIR_DUMMY, result)

    done()
  })
})

describe('Walking with stopfile', () => {
  it('should only return the stopfile from a directory', (done) => {
    const stopfile = /file.dummy.1.js/

    const result = tree.walk(DIR_DUMMY, null, null, null, stopfile)

    assertNumFilesInResults(1, DIR_DUMMY, result)

    result[0].should.equal(path.join(DIR_DUMMY, 'file.dummy.1.js'))

    done()
  })

  it('should only return the stopfile from an included directory', (done) => {
    const stopfile = /index.js/
    const inc = /dir_dummy_3/

    const result = tree.walk(DIR_DUMMY, null, null, inc, stopfile)

    assertNumFilesInResults(1, DIR_DUMMY, result)

    result[0].should.equal(
      path.join(
        DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js'
      )
    )

    done()
  })
})
