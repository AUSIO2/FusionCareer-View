import assert from 'node:assert/strict'
import test from 'node:test'
import { finishLogoutNavigation } from '../src/lib/logout.mjs'

test('returns the app to login while SSO logout continues in a hidden frame', () => {
  const frames = []
  const appUrls = []
  const readWindow = {
    document: {
      createElement: tag => ({ tag, addEventListener() {} }),
      body: { appendChild: frame => frames.push(frame) },
    },
    location: {
      origin: 'https://fusioncareer.fudan.edu.cn',
      pathname: '/',
      replace: url => appUrls.push(url),
    },
  }

  finishLogoutNavigation(readWindow, 'https://id.fudan.edu.cn/idp/authCenter/GLO')

  assert.equal(frames.length, 1)
  assert.equal(frames[0].hidden, true)
  assert.equal(frames[0].src, 'https://id.fudan.edu.cn/idp/authCenter/GLO')
  assert.deepEqual(appUrls, ['https://fusioncareer.fudan.edu.cn/#/login'])
})
