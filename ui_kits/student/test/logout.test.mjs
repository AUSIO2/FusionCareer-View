import assert from 'node:assert/strict'
import test from 'node:test'
import { finishLogoutNavigation, openLogoutWindow } from '../src/lib/logout.mjs'

test('returns the app to login while SSO logout continues in a popup', () => {
  const popupUrls = []
  const appUrls = []
  const readPopup = {
    close() {},
    document: { title: '', body: { textContent: '' } },
    location: { replace: url => popupUrls.push(url) },
    opener: {},
  }
  const readWindow = {
    open: () => readPopup,
    location: {
      origin: 'https://fusioncareer.fudan.edu.cn',
      pathname: '/',
      replace: url => appUrls.push(url),
    },
  }

  const opened = openLogoutWindow(readWindow)
  finishLogoutNavigation(readWindow, opened, 'https://id.fudan.edu.cn/idp/authCenter/GLO')

  assert.equal(opened, readPopup)
  assert.equal(readPopup.opener, null)
  assert.deepEqual(popupUrls, ['https://id.fudan.edu.cn/idp/authCenter/GLO'])
  assert.deepEqual(appUrls, ['https://fusioncareer.fudan.edu.cn/#/login'])
})
