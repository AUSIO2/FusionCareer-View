/**
 * 与网关约定：浏览器请求 /api/**，开发环境 Vite 代理去掉 /api 前缀转发到 Java（与生产 Nginx 一致）。
 * 鉴权：Sa-Token header 名 Fusion-Token（见后端 application.yml）。
 */

import { useToast } from '@/composables/useToast'

const TOKEN_STORAGE_KEY = 'fusion-career-token'
const LOGIN_ERROR = '登录已过期，请重新登录'
const NETWORK_ERROR = '网络连接失败，请检查网络后重试'

/** 对外请求前缀（含 /api） */
export function getApiPrefix() {
  const base = import.meta.env.VITE_API_BASE
  if (base != null && String(base).trim() !== '') return String(base).replace(/\/$/, '')
  return '/api'
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
    else localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch { /* ignore */ }
}

export function clearToken() {
  setToken('')
}

/**
 * 注销服务端会话（Sa-Token），再清除本地 token 并完成页面跳转。
 */
export async function logoutSession() {
  let readUrl = ''
  try {
    const readLogout = await apiJson('/fudan/logout', { method: 'POST' })
    readUrl = readLogout?.redirectUrl || ''
  } catch (readError) {
    if (readError?.code !== 401) useToast().error('服务端退出失败，已在本地退出')
  } finally {
    clearToken()
    if (readUrl) window.location.assign(readUrl)
    else window.location.hash = '#/login'
  }
}

/**
 * 从 URL 读取 SSO 回跳 token 并持久化，再从地址栏移除（避免刷新泄露/重复）。
 * 支持 `?token=` 在 hash 之前，或 `#/path?token=`。
 */
export function consumeUrlToken() {
  const href = window.location.href
  const url = new URL(href)

  const searchToken = url.searchParams.get('token')
  if (searchToken) {
    setToken(searchToken)
    url.searchParams.delete('token')
    const qs = url.searchParams.toString()
    const next = url.pathname + (qs ? `?${qs}` : '') + url.hash
    window.history.replaceState({}, '', next)
    return true
  }

  const hash = url.hash
  const qm = hash.indexOf('?')
  if (qm === -1) return false
  const pathPart = hash.slice(0, qm)
  const qsPart = hash.slice(qm + 1)
  const hp = new URLSearchParams(qsPart)
  const ht = hp.get('token')
  if (!ht) return false
  setToken(ht)
  hp.delete('token')
  const rest = hp.toString()
  url.hash = pathPart + (rest ? `?${rest}` : '')
  window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  return true
}

function buildUrl(path) {
  const prefix = getApiPrefix()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${prefix}${p}`
}

function createApiError(readMessage, readCode = null, readStatus = 0, readCause = null) {
  const createError = new Error(readMessage)
  createError.name = 'ApiError'
  createError.code = readCode
  createError.status = readStatus
  if (readCause) createError.cause = readCause
  return createError
}

function expireLogin() {
  clearToken()
  useToast().error(LOGIN_ERROR)
  if (typeof window !== 'undefined' && !window.location.hash.startsWith('#/login')) {
    window.location.hash = '#/login'
  }
}

async function sendApi(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getToken()
  if (token) headers.set('Fusion-Token', token)
  if (options.body != null && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  try {
    return await fetch(buildUrl(path), { ...options, headers })
  } catch (readCause) {
    throw createApiError(NETWORK_ERROR, null, 0, readCause)
  }
}

async function parseApiResponse(readResponse) {
  let readText
  try {
    readText = await readResponse.text()
  } catch (readCause) {
    throw createApiError(NETWORK_ERROR, null, readResponse.status, readCause)
  }

  let readBody = null
  try {
    readBody = readText ? JSON.parse(readText) : null
  } catch {
    if (readResponse.status === 401) {
      expireLogin()
      throw createApiError(LOGIN_ERROR, 401, readResponse.status)
    }
    throw createApiError('服务响应格式异常，请稍后重试', readResponse.status, readResponse.status)
  }

  if (readResponse.status === 401 || readBody?.code === 401) {
    expireLogin()
    throw createApiError(LOGIN_ERROR, 401, readResponse.status)
  }
  if (!readResponse.ok) {
    throw createApiError(readBody?.message || `请求失败 (${readResponse.status})`,
      readBody?.code ?? readResponse.status, readResponse.status)
  }
  if (readBody == null || typeof readBody !== 'object'
      || Array.isArray(readBody) || readBody.code == null) {
    throw createApiError('服务响应格式异常，请稍后重试', readResponse.status, readResponse.status)
  }
  if (readBody.code !== 200) {
    throw createApiError(readBody.message || `请求失败 (${readBody.code})`,
      readBody.code, readResponse.status)
  }
  return readBody
}

/**
 * @param {string} path 不含 /api 前缀，如 `/job/list?page=1`
 * @param {RequestInit} options
 */
export async function apiFetch(path, options = {}) {
  const res = await sendApi(path, options)
  const data = await parseApiResponse(res)
  return { res, data }
}

/** 解析统一 R 包装；成功返回 data，失败 throw Error(message) */
export function unwrapR(data) {
  if (data == null) throw new Error('空响应')
  if (data.code === 200) return data.data
  throw new Error(data.message || `请求失败 (${data.code})`)
}

export async function apiJson(path, options = {}) {
  const { data } = await apiFetch(path, options)
  return unwrapR(data)
}

/** multipart POST，不要设置 Content-Type（浏览器自动带 boundary） */
export async function apiForm(path, formData) {
  const { data } = await apiFetch(path, { method: 'POST', body: formData })
  return unwrapR(data)
}

/** 带 Fusion-Token 下载二进制（简历文件等） */
export async function apiDownloadBlob(path) {
  const res = await sendApi(path, { method: 'GET' })
  const readType = res.headers.get('Content-Type') || ''
  if (!res.ok || readType.includes('json')) {
    await parseApiResponse(res)
    throw createApiError('下载响应格式异常，请稍后重试', res.status, res.status)
  }
  try {
    return await res.blob()
  } catch (readCause) {
    throw createApiError(NETWORK_ERROR, null, res.status, readCause)
  }
}
