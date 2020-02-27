import makeTestSuite from '@zoroaster/mask'
import { deepEqual } from '@zoroaster/assert'
import Context from '../../context'
import { getProps } from '../../../src/lib'

/** @type {import('@zoroaster/mask').MaskConfig} */
const logic = {
  mapActual: ({ obj }) => {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      acc[k] = v.replace(/\r\n/g, '\n')
      return acc
    }, {})
  },
  assertResults({ whitespace }, { expectedWhitespace }) {
    if (expectedWhitespace) deepEqual(whitespace, expectedWhitespace)
  },
  propStartRe: /```json/,
  propEndRe: /```/,
  jsonProps: ['expected', 'expectedWhitespace'],
}

export
const GetProps = makeTestSuite('test/result/components/get-props/default', {
  getResults() {
    const { obj, whitespace } = getProps(this.input)
    return { obj, whitespace }
  },
  ...logic,
})

export
const withClass = makeTestSuite('test/result/components/get-props/prop2class', {
  getResults() {
    const { obj, whitespace } = getProps(this.input, {
      withClass: true,
    })
    return { obj, whitespace }
  },
  ...logic,
})

export
const classNames = makeTestSuite('test/result/components/get-props/class-names', {
  getResults() {
    const { obj, whitespace } = getProps(this.input, {
      classNames: this.preamble,
    })
    return { obj, whitespace }
  },
  ...logic,
  jsonProps: ['expected', 'preamble'],
})

export
const propWithClass = makeTestSuite('test/result/components/get-props/2', {
  getResults() {
    const { obj, whitespace } = getProps(this.input, {
      withClass: true,
      classNames: this.classNames || this.preamble,
    })
    return { obj, whitespace }
  },
  ...logic,
  jsonProps: ['expected', 'preamble', 'classNames'],
})

export
const renameMap = makeTestSuite('test/result/components/get-props/rename-map', {
  getResults() {
    const { obj, whitespace } = getProps(this.input, {
      withClass: true,
      classNames: this.preamble,
      renameMap: this.renameMap,
    })
    return { obj, whitespace }
  },
  ...logic,
  jsonProps: ['expected', 'preamble', 'renameMap'],
})