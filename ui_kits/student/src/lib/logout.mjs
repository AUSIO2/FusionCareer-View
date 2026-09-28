function startHiddenSsoLogout(readDocument, readSsoUrl) {
  if (!readSsoUrl || !readDocument?.body || typeof readDocument.createElement !== 'function') return
  const readFrame = readDocument.createElement('iframe')
  readFrame.hidden = true
  readFrame.title = '统一认证退出'
  readFrame.referrerPolicy = 'no-referrer'
  readFrame.src = readSsoUrl
  readFrame.addEventListener?.('load', () => {
    setTimeout(() => readFrame.remove?.(), 1000)
  }, { once: true })
  readDocument.body.appendChild(readFrame)
}

export function finishLogoutNavigation(readWindow, readSsoUrl) {
  startHiddenSsoLogout(readWindow?.document, readSsoUrl)
  if (readWindow) {
    readWindow.location.replace(`${readWindow.location.origin}${readWindow.location.pathname}#/login`)
  }
}
