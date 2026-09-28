export function openLogoutWindow(readWindow) {
  if (!readWindow || typeof readWindow.open !== 'function') return null
  const readPopup = readWindow.open(
    'about:blank', 'fusioncareer-sso-logout', 'popup,width=520,height=640')
  if (readPopup) {
    try {
      readPopup.document.title = '正在退出'
      readPopup.document.body.textContent = '正在退出复旦统一认证…'
    } catch { /* popup may already be navigating */ }
  }
  return readPopup
}

export function finishLogoutNavigation(readWindow, readPopup, readSsoUrl) {
  if (readPopup) {
    if (readSsoUrl) {
      readPopup.opener = null
      readPopup.location.replace(readSsoUrl)
    } else {
      readPopup.close()
    }
  }
  if (readWindow) {
    readWindow.location.replace(`${readWindow.location.origin}${readWindow.location.pathname}#/login`)
  }
}
