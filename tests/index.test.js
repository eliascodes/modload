'use strict'

require('chai').should()
const path = require('path')
const auto = require('../index.js')

const DIR_DUMMY = path.join(__dirname, 'dummy')

function prependDummyPath (files) {
  return files.map((file) => path.join(DIR_DUMMY, file))
}

describe('Test .asArray', () => {
  it('should return array of all .js files dy default', (done) => {
    const results = auto.asArray({dir: DIR_DUMMY})

    const expected = prependDummyPath([
      'file.dummy.1.js',
      'file.dummy.2.js',
      path.join('dir_dummy_1', 'file.dummy.1.js'),
      path.join('dir_dummy_2', 'dir_dummy_3', 'file.dummy.1.js'),
      path.join('dir_dummy_2', 'dir_dummy_3', 'index.js'),
      path.join('dir_dummy_2', 'dir_dummy_3', 'dir_dummy_4', 'file.dummy.1.js'),
    ])

    results.should.deep.equal(expected)
    done()
  })

  it('should cope with serial calls, where exclude in first is include in other', (done) => {
    const results = {
      one: auto.asArray({dir: DIR_DUMMY, exclude: /dir_dummy_3/}),
      two: auto.asArray({dir: DIR_DUMMY, include: /dir_dummy_3/})
    }

    const expected = {
      one: prependDummyPath([
        'file.dummy.1.js',
        'file.dummy.2.js',
        path.join('dir_dummy_1', 'file.dummy.1.js'),
      ]),
      two: prependDummyPath([
        path.join('dir_dummy_2', 'dir_dummy_3', 'file.dummy.1.js'),
        path.join('dir_dummy_2', 'dir_dummy_3', 'index.js'),
        path.join('dir_dummy_2', 'dir_dummy_3', 'dir_dummy_4', 'file.dummy.1.js'),
      ])
    }

    results.one.should.deep.equal(expected.one)
    results.two.should.deep.equal(expected.two)
    done()
  })

  it('should handle arrays of regex in include and exclude', (done) => {
    const results = auto.asArray({
      dir: DIR_DUMMY,
      exclude: [/dir_dummy_3/, /dir_dummy_1/]
    })

    const expected = prependDummyPath([
      'file.dummy.1.js',
      'file.dummy.2.js',
    ])

    results.should.deep.equal(expected)
    done()
  })
})

describe('Test .asObject', () => {
  it('should return object of all .js files by default', (done) => {
    const results = auto.asObject({dir: DIR_DUMMY})

    const expected = {
      'file.dummy.1': path.join(DIR_DUMMY, 'file.dummy.1.js'),
      'file.dummy.2': path.join(DIR_DUMMY, 'file.dummy.2.js'),
      'dir_dummy_1': {
        'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_1', 'file.dummy.1.js')
      },
      'dir_dummy_2': {
        'dir_dummy_3': {
          'index': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js'),
          'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'file.dummy.1.js'),
          'dir_dummy_4': {
            'file.dummy.1': path.join(
              DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'dir_dummy_4', 'file.dummy.1.js'
            )
          }
        }
      }
    }

    results.should.deep.equal(expected)
    done()
  })

  it('should require stopfile under directory name', (done) => {
    const results = auto.asObject({dir: DIR_DUMMY, stopfile: /index.js$/})

    const expected = {
      'file.dummy.1': path.join(DIR_DUMMY, 'file.dummy.1.js'),
      'file.dummy.2': path.join(DIR_DUMMY, 'file.dummy.2.js'),
      'dir_dummy_1': {
        'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_1', 'file.dummy.1.js')
      },
      'dir_dummy_2': {
        'dir_dummy_3': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js')
      }
    }

    results.should.deep.equal(expected)
    done()
  })

  it('should attach to the global object', (done) => {
    auto.asObject({
      dir: DIR_DUMMY,
      stopfile: /index.js$/,
      isglobal: true,
    })

    const expected = {
      'file.dummy.1': path.join(DIR_DUMMY, 'file.dummy.1.js'),
      'file.dummy.2': path.join(DIR_DUMMY, 'file.dummy.2.js'),
      'dir_dummy_1': {
        'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_1', 'file.dummy.1.js')
      },
      'dir_dummy_2': {
        'dir_dummy_3': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js')
      }
    }

    global.app.should.deep.equal(expected)

    delete global.app

    done()
  })
})
