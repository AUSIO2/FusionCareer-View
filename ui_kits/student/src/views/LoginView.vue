<template>
  <div class="login-page">
    <header class="login-header">
      <div class="college-brand">
        <img src="/brand/fudan-seal.svg" alt="复旦大学校徽" width="46" height="46" />
        <span>复旦大学新闻学院</span>
      </div>
      <a class="college-link" href="https://xwxy.fudan.edu.cn/" target="_blank" rel="noopener noreferrer">
        学院官网
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </a>
    </header>

    <main class="login-layout">
      <div class="campus-photo" role="img" aria-label="秋日阳光下的复旦大学新闻学院，银杏树与校园小径" />

      <section class="login-panel" aria-labelledby="login-title">
        <div class="login-content">
          <h1 id="login-title">复新生涯</h1>

          <div class="login-targets" role="group" aria-label="选择登录身份">
            <button
              type="button"
              :class="{ selected: !isAdminTarget }"
              :aria-pressed="!isAdminTarget"
              :disabled="loggingIn"
              @click="setTarget('user')"
            >学生登录</button>
            <button
              type="button"
              :class="{ selected: isAdminTarget }"
              :aria-pressed="isAdminTarget"
              :disabled="loggingIn"
              @click="setTarget('admin')"
            >管理登录</button>
          </div>

          <div v-if="errorMessage" class="login-alert" role="alert">
            <p>{{ errorMessage }}</p>
            <button v-if="loginError === 'admin_forbidden'" type="button" @click="setTarget('user')">
              切换到学生登录
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <button
            class="uis-button"
            type="button"
            :disabled="loggingIn"
            :aria-busy="loggingIn"
            @click="loginCurrentTarget"
          >
            <svg class="login-symbol" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
            </svg>
            <span>{{ loggingIn ? '正在前往统一认证…' : '复旦 UIS 登录' }}</span>
            <svg v-if="!loggingIn" class="login-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
            <span v-else class="login-spinner" aria-hidden="true" />
          </button>

          <details class="login-help">
            <summary>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.8 9a2.3 2.3 0 0 1 4.5.6c0 1.8-2.3 1.9-2.3 3.4M12 16h.01" />
              </svg>
              <span>登录遇到问题？</span>
              <svg class="help-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </summary>
            <div class="help-content">
              <p>使用复旦大学统一身份认证账号，账号和密码在学校认证页面填写。</p>
              <p v-if="isAdminTarget">管理登录仅对已开通管理权限的账号开放。学生请切换至「学生登录」。</p>
              <p v-else>登录后可查看岗位、投递简历，并在个人中心查看投递进度。</p>
              <p>若认证未完成，可返回此页重新登录。</p>
            </div>
          </details>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loggingIn = ref(false)
const loginError = computed(() => route.query.error || route.query.notice || '')
const isAdminTarget = computed(() => route.query.target === 'admin')
const errorMessages = {
  sso_login_failed: '统一身份认证未完成，请重新登录。',
  admin_forbidden: '此账号尚未开通管理权限，请使用学生登录。',
}
const errorMessage = computed(() => Object.hasOwn(errorMessages, loginError.value)
  ? errorMessages[loginError.value]
  : '')

function loginCurrentTarget() {
  if (loggingIn.value) return
  loggingIn.value = true
  window.location.assign(`/fudan/login?target=${isAdminTarget.value ? 'admin' : 'user'}`)
}

function setTarget(target) {
  if (loggingIn.value) return
  router.replace({ path: '/login', query: target === 'admin' ? { target: 'admin' } : {} })
}

function restoreLoginButton() {
  loggingIn.value = false
}

onMounted(() => window.addEventListener('pageshow', restoreLoginButton))
onUnmounted(() => window.removeEventListener('pageshow', restoreLoginButton))
</script>

<style scoped>
.login-page {
  --login-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --login-accent: #852b36;
  min-height: 100vh;
  min-height: 100svh;
  padding: 0 32px 32px;
  background: #faf9f6;
  color: #252b30;
  font-family: var(--login-font);
}
.login-page button,
.login-page a { -webkit-tap-highlight-color: transparent; }
.login-page button { font-family: inherit; }
.login-page svg { stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
.login-page :is(button, a, summary):focus-visible { outline: 3px solid #245697; outline-offset: 5px; }
.login-header {
  max-width: 1664px;
  min-height: 100px;
  margin: 0 auto;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.college-brand { display: flex; align-items: center; gap: 16px; }
.college-brand img { display: block; flex-shrink: 0; }
.college-brand span { font-size: 18px; font-weight: 600; letter-spacing: .02em; }
.college-link {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #60676b;
  font-size: 14px;
  white-space: nowrap;
}
.college-link svg { width: 17px; height: 17px; }
.college-link:hover { color: var(--login-accent); }
.login-layout {
  max-width: 1664px;
  min-height: max(560px, calc(100svh - 132px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(400px, 1fr);
}
.campus-photo {
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border-radius: 5px;
  background: #b7a078;
  isolation: isolate;
}
.campus-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/images/login-journalism-autumn.webp') center center / cover no-repeat;
  transform: scale(1.16);
  transform-origin: center top;
  filter: saturate(.77) contrast(.94) brightness(1.02);
}
.campus-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(140deg, rgba(247,223,178,.12), rgba(94,58,22,.08));
}
.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 48px;
}
.login-content { width: 100%; max-width: 360px; }
.login-content h1 {
  margin: 0 0 38px;
  font-family: inherit;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: .025em;
  line-height: 1.35;
}
.login-targets { display: flex; gap: 32px; margin-bottom: 32px; border-bottom: 1px solid #dddfdc; }
.login-targets button {
  position: relative;
  min-height: 48px;
  padding: 0 0 15px;
  border: 0;
  background: transparent;
  color: #697076;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  cursor: pointer;
}
.login-targets button::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
}
.login-targets button.selected { color: var(--login-accent); font-weight: 600; }
.login-targets button.selected::after { background: var(--login-accent); }
.login-targets button:hover:not(:disabled) { color: var(--login-accent); }
.login-targets button:disabled { cursor: wait; opacity: .6; }
.login-alert {
  margin: -8px 0 24px;
  padding: 12px 14px;
  border-left: 2px solid var(--login-accent);
  background: #f5e9e9;
  color: #76232e;
  font-size: 14px;
  line-height: 1.7;
}
.login-alert button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.uis-button {
  width: 100%;
  min-height: 56px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--login-accent);
  border-radius: 5px;
  background: var(--login-accent);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease;
}
.uis-button svg { flex: 0 0 20px; width: 20px; height: 20px; }
.uis-button .login-symbol { width: 19px; height: 19px; flex-basis: 19px; opacity: .85; }
.login-arrow, .login-spinner { margin-left: auto; }
.uis-button:hover:not(:disabled) { border-color: #6d202a; background: #6d202a; }
.uis-button:disabled { cursor: wait; opacity: .75; }
.login-spinner {
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: login-spin .8s linear infinite;
}
@keyframes login-spin { to { transform: rotate(360deg); } }
.login-help { margin-top: 30px; }
.login-help summary {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #62696f;
  font-size: 14px;
  cursor: pointer;
  list-style: none;
}
.login-help summary::-webkit-details-marker { display: none; }
.login-help summary:hover { color: #252b30; }
.login-help summary svg { width: 17px; height: 17px; flex-shrink: 0; }
.login-help .help-chevron { margin-left: auto; transition: transform .18s ease; }
.login-help[open] .help-chevron { transform: rotate(180deg); }
.help-content { padding: 10px 0 0 25px; color: #555f65; font-size: 14px; line-height: 1.8; }
.help-content p + p { margin-top: 12px; }

@media (min-width: 1800px) {
  .login-layout { min-height: 780px; }
}
@media (max-width: 1000px) {
  .login-page { padding: 0 24px 24px; }
  .login-layout { grid-template-columns: minmax(0, 1fr) minmax(360px, 1fr); }
  .login-panel { padding: 40px 30px; }
  .login-content h1 { font-size: 32px; }
}
@media (max-width: 900px) {
  .login-page { padding: 0 16px 24px; }
  .login-header { min-height: 82px; padding: 0 4px; gap: 12px; }
  .college-brand { gap: 10px; }
  .college-brand img { width: 38px; height: 38px; }
  .college-brand span { font-size: 16px; letter-spacing: 0; }
  .college-link { gap: 4px; font-size: 13px; }
  .college-link svg { width: 15px; height: 15px; }
  .login-layout { display: block; min-height: 0; }
  .campus-photo { min-height: 0; height: clamp(176px, 28svh, 280px); }
  .campus-photo::before { background-position: center 57%; }
  .login-panel { padding: 36px 12px 8px; }
  .login-content { max-width: 420px; }
  .login-content h1 { margin-bottom: 20px; font-size: 30px; }
  .login-targets { margin-bottom: 24px; }
  .login-help { margin-top: 20px; }
}
@media (max-width: 360px) {
  .college-brand span { font-size: 14px; }
  .college-link { font-size: 12px; }
  .college-brand img { width: 34px; height: 34px; }
  .login-panel { padding-left: 6px; padding-right: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .uis-button, .help-chevron { transition: none; }
  .login-spinner { animation: none; }
}
</style>
