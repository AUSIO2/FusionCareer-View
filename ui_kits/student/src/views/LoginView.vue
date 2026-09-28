<template>
  <div class="login-page">
    <section class="campus-cover" aria-labelledby="platform-title">
      <div class="campus-photo" role="img" aria-label="复旦大学新闻学院秋景，银杏树下的小径通向教学楼" />
      <header class="cover-header">
        <div class="college-brand">
          <img src="/brand/fudan-seal.svg" alt="复旦大学校徽" width="48" height="48" />
          <span>复旦大学新闻学院</span>
        </div>
      </header>

      <div class="cover-content">
        <div class="cover-title">
          <p>实习 · 就业 · 职业发展</p>
          <h1 id="platform-title">复新生涯</h1>
        </div>
        <div
          class="college-motto"
          aria-label="新闻学院院铭：好学力行"
        ><span>好学</span><span>力行</span></div>
      </div>

      <p class="cover-caption">
        <span class="caption-rule" aria-hidden="true" />
        <span>校园里的一个秋日。</span>
      </p>
    </section>

    <main class="login-panel" aria-labelledby="entry-title">
      <div class="login-content">
        <div class="login-heading">
          <div class="heading-identity">
            <img class="card-seal" src="/brand/fudan-seal.svg" alt="" aria-hidden="true" width="42" height="42" />
            <h2 id="entry-title">登录</h2>
          </div>
          <svg class="ginkgo-drawing" viewBox="0 0 260 190" fill="none" aria-hidden="true">
            <g class="ginkgo-stems">
              <path d="M142 188c13-29 19-50 22-67M148 176c-18-12-30-22-43-39" />
            </g>
            <g class="ginkgo-small">
              <path class="leaf-shape" d="M105 138c-23 2-50-6-63-20-9-10-11-24-4-28 6-4 12 0 16-5 5-7 11-11 17-7 7 5 11 13 15 23 5-12 11-20 18-20 7 0 9 8 14 10 6 2 12-2 15 6 6 14-9 33-28 41Z" />
              <path class="leaf-veins" d="M105 138C76 131 52 112 42 96m63 42c-19-15-34-35-38-52m38 52c-10-12-17-26-19-37m19 37c-3-19-2-35 2-48m-2 48c10-15 18-28 21-39" />
            </g>
            <g class="ginkgo-large">
              <path class="leaf-shape" d="M164 121c-24-4-56-22-70-42-10-13-10-31 0-37 8-5 13 2 19-3 6-5 8-14 18-13 13 1 22 11 32 24 11-15 22-28 35-26 9 1 12 11 18 15 7 4 13-2 20 4 11 9 7 26-4 40-19 21-48 36-68 38Z" />
              <path class="leaf-veins" d="M164 121c-34-25-54-48-64-72m64 72c-21-31-35-57-34-86m34 86c-9-26-10-50-1-71m1 71c9-34 22-62 33-87m-33 87c26-28 44-52 51-74m-51 74c33-18 57-41 69-68" />
            </g>
          </svg>
        </div>

        <div class="login-form">
          <div class="login-targets" role="group" aria-label="选择登录身份">
            <button
              type="button"
              :class="{ selected: !isAdminTarget }"
              :aria-pressed="!isAdminTarget"
              :disabled="loggingIn"
              @click="setTarget('user')"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
              </svg>
              <span>学生端</span>
              <svg v-if="!isAdminTarget" class="choice-check" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 8 2.5 2.5L12 5" /></svg>
            </button>
            <button
              type="button"
              :class="{ selected: isAdminTarget }"
              :aria-pressed="isAdminTarget"
              :disabled="loggingIn"
              @click="setTarget('admin')"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="7" width="16" height="14" rx="2" />
                <path d="M9 7V4h6v3M4 12h16M10 12v3h4v-3" />
              </svg>
              <span>管理端</span>
              <svg v-if="isAdminTarget" class="choice-check" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 8 2.5 2.5L12 5" /></svg>
            </button>
          </div>

          <div v-if="errorMessage" class="login-alert" role="alert">
            <p>{{ errorMessage }}</p>
            <button v-if="loginError === 'admin_forbidden'" type="button" @click="setTarget('user')">
              切换到学生端 <span aria-hidden="true">→</span>
            </button>
          </div>

          <button
            class="uis-button"
            type="button"
            :disabled="loggingIn"
            :aria-busy="loggingIn"
            @click="loginCurrentTarget"
          >
            <span>{{ loggingIn ? '正在前往统一认证…' : '复旦 UIS 登录' }}</span>
            <svg v-if="!loggingIn" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
            <span v-else class="login-spinner" aria-hidden="true" />
          </button>

          <button
            class="help-toggle"
            type="button"
            :aria-expanded="helpOpen"
            aria-controls="login-help"
            @click="helpOpen = !helpOpen"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.8 9a2.3 2.3 0 0 1 4.5.6c0 1.8-2.3 1.9-2.3 3.4M12 16h.01" />
            </svg>
            <span>{{ helpOpen ? '收起帮助' : '登录帮助' }}</span>
            <svg class="help-chevron" :class="{ expanded: helpOpen }" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </button>

          <div v-show="helpOpen" id="login-help" class="login-help">
            <p>使用复旦大学统一身份认证账号，账号和密码在学校认证页面填写。</p>
            <p>管理端仅对已开通管理权限的账号开放；若认证未完成，可返回本页重新登录。</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loggingIn = ref(false)
const helpOpen = ref(false)
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
  --wine: #7a3039;
  --ink: #302e29;
  --paper: #faf7f0;
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(400px, 1fr);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--login-font);
}
.login-page button { font-family: inherit; cursor: pointer; }
.login-page button, .login-page a { -webkit-tap-highlight-color: transparent; }
.login-page svg { stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.login-page :is(button, a):focus-visible { outline: 3px solid #245697; outline-offset: 5px; }
.campus-cover {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding: 0 clamp(32px, 4vw, 72px) 36px;
  overflow: hidden;
  isolation: isolate;
  color: #fffaf0;
  background: #504d36;
}
.campus-photo { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
.campus-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  /* Photo source: https://xwxy.fudan.edu.cn/b6/a6/c41268a636582/page.htm */
  background: url('/images/login-journalism-autumn.webp') center 51% / cover no-repeat;
  transform: scale(1.16);
  transform-origin: center top;
  filter: saturate(.7) contrast(.94) brightness(.9);
}
.campus-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(26,36,25,.46), transparent 30%, rgba(28,32,22,.12) 58%, rgba(26,29,21,.48)),
    linear-gradient(90deg, rgba(22,35,27,.55), rgba(29,36,25,.08) 67%, rgba(28,32,23,.24));
}
.cover-header {
  min-height: 104px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid rgba(255,250,240,.25);
}
.college-brand { display: inline-flex; align-items: center; gap: 14px; }
.college-brand img { flex-shrink: 0; filter: grayscale(1) brightness(0) invert(1); opacity: .94; }
.college-brand span { font-size: 18px; font-weight: 500; letter-spacing: .02em; white-space: nowrap; }
.cover-content {
  flex: 1;
  padding: 60px 0 58px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}
.cover-title p { margin-bottom: 20px; font-size: 14px; font-weight: 400; letter-spacing: .14em; }
.cover-title h1 {
  font-family: inherit;
  font-size: clamp(48px, 4.9vw, 76px);
  font-weight: 400;
  letter-spacing: .06em;
  line-height: 1.2;
  white-space: nowrap;
  text-shadow: 0 2px 24px rgba(27,32,21,.12);
}
.college-motto {
  display: flex;
  flex-direction: row-reverse;
  flex-shrink: 0;
  gap: 12px;
  align-self: flex-start;
  padding: 12px 0 14px 20px;
  border-left: 1px solid rgba(255,250,240,.5);
  font-family: 'Songti SC', 'STSong', 'SimSun', serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: .25em;
}
.college-motto span { writing-mode: vertical-rl; }
.cover-caption {
  min-height: 32px;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: .06em;
}
.caption-rule { width: 26px; height: 1px; background: currentColor; opacity: .7; }
.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px clamp(32px, 3.4vw, 64px);
  border-left: 1px solid rgba(55,40,25,.08);
  background:
    repeating-linear-gradient(105deg, rgba(102,83,57,.018) 0 1px, transparent 1px 5px),
    linear-gradient(135deg, #f2eee5 0%, #e8e0d3 100%);
}
.login-content {
  position: relative;
  width: 100%;
  max-width: 460px;
  border: 1px solid #d9d0c1;
  border-radius: 3px;
  background: #fffcf5;
  box-shadow: 0 18px 48px rgba(67,48,25,.09), 0 2px 5px rgba(67,48,25,.025);
}
.login-content::before {
  content: '';
  position: absolute;
  z-index: 2;
  left: 34px;
  top: -1px;
  width: 48px;
  height: 3px;
  background: var(--wine);
}
.login-heading {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 148px;
  padding: 30px 34px;
  overflow: hidden;
  border-bottom: 1px solid #e4ddcf;
  background: #f4f0e5;
}
.heading-identity { position: relative; z-index: 1; display: flex; align-items: center; gap: 15px; }
.login-heading h2 { margin: 0; font-family: inherit; font-size: 30px; font-weight: 500; line-height: 1.3; }
.card-seal { display: block; flex-shrink: 0; filter: grayscale(1) sepia(.7); opacity: .72; }
.ginkgo-drawing { position: absolute; right: -4px; bottom: -24px; width: 205px; height: 162px; pointer-events: none; }
.ginkgo-drawing .leaf-shape { fill: #d1bd79; fill-opacity: .24; stroke: #ad985c; stroke-width: 1; }
.ginkgo-drawing .leaf-veins { stroke: #ad985c; stroke-width: .75; opacity: .62; }
.ginkgo-drawing .ginkgo-stems { stroke: #9c8a5d; stroke-width: 1.2; }
.ginkgo-small { opacity: .75; }
.login-form { padding: 32px 34px 28px; }
.login-targets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.login-targets button {
  position: relative;
  min-height: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px;
  border: 1px solid #dfd8ca;
  border-radius: 3px;
  background: #fcfaf5;
  color: #69645a;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
}
.login-targets svg { width: 18px; height: 18px; flex-shrink: 0; }
.login-targets .choice-check { position: absolute; top: 7px; right: 7px; width: 14px; height: 14px; border-radius: 50%; background: var(--wine); color: #fffaf4; }
.login-targets button.selected { border-color: #a37a7b; background: #f6eeea; color: var(--wine); font-weight: 600; }
.login-targets button:hover:not(:disabled) { border-color: #a37a7b; color: var(--wine); }
.login-targets button:disabled { cursor: wait; opacity: .65; }
.uis-button {
  min-height: 56px;
  width: 100%;
  margin-top: 24px;
  padding: 14px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--wine);
  border-radius: 3px;
  background: var(--wine);
  color: #fffaf4;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  text-align: left;
  transition: background .18s ease;
}
.uis-button svg { width: 22px; height: 22px; flex-shrink: 0; }
.uis-button:hover:not(:disabled) { background: #64242d; }
.uis-button:disabled { cursor: wait; opacity: .72; }
.help-toggle { min-height: 58px; width: 100%; display: flex; align-items: center; gap: 8px; margin-top: 26px; padding: 14px 0 0; border: 0; border-top: 1px solid #e4ddcf; background: transparent; color: #656056; font-size: 14px; white-space: nowrap; }
.help-toggle svg { width: 17px; height: 17px; flex-shrink: 0; }
.help-chevron { margin-left: auto; transition: transform .18s ease; }
.help-chevron.expanded { transform: rotate(180deg); }
.help-toggle:hover { color: var(--wine); }
.login-alert { margin-top: 22px; padding: 12px 16px; border-left: 3px solid var(--wine); background: #f3e5e3; color: #722b32; font-size: 14px; line-height: 1.7; }
.login-alert button { min-height: 36px; display: inline-flex; align-items: center; gap: 8px; margin-top: 4px; padding: 0; border: 0; background: transparent; color: inherit; font-size: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.login-help { margin-top: 12px; padding: 16px 18px; border: 1px solid #e0d9cd; background: #f0ece2; color: #5e594f; font-size: 14px; line-height: 1.8; }
.login-help p + p { margin-top: 6px; }
.login-spinner { flex: 0 0 18px; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: login-spin .8s linear infinite; }
@keyframes login-spin { to { transform: rotate(360deg); } }

@media (max-width: 1100px) {
  .campus-cover { padding-left: 28px; padding-right: 28px; }
  .college-brand img { width: 40px; height: 40px; }
  .college-brand { gap: 10px; }
  .college-brand span { font-size: 16px; }
  .cover-content { gap: 16px; }
  .cover-title h1 { font-size: 48px; }
  .college-motto { font-size: 24px; gap: 8px; padding-left: 14px; }
  .login-panel { padding-left: 32px; padding-right: 32px; }
  .login-heading { min-height: 132px; padding: 26px; }
  .heading-identity { gap: 12px; }
  .card-seal { width: 38px; height: 38px; }
  .ginkgo-drawing { width: 180px; height: 142px; }
  .login-form { padding: 28px 26px 24px; }
  .login-content::before { left: 26px; }
}
@media (max-width: 900px) {
  .login-page { display: flex; flex-direction: column; }
  .campus-cover { min-height: 340px; padding: 0 28px 22px; }
  .cover-header { min-height: 82px; }
  .college-brand img { width: 36px; height: 36px; }
  .cover-content { min-height: 208px; padding: 26px 0; align-items: flex-end; }
  .cover-title p { margin-bottom: 14px; font-size: 12px; letter-spacing: .08em; }
  .cover-title h1 { font-size: 44px; }
  .college-motto { font-size: 23px; padding-top: 6px; padding-bottom: 8px; }
  .cover-caption { font-size: 11px; }
  .campus-photo::before { background-position: center 55%; }
  .login-panel { flex: 1; align-items: flex-start; padding: 28px; border-left: 0; }
  .login-content { max-width: 440px; }
  .login-heading { min-height: 104px; padding: 24px; }
  .login-heading h2 { font-size: 28px; }
  .ginkgo-drawing { width: 160px; height: 128px; bottom: -24px; }
  .login-form { padding: 24px; }
  .login-targets button { min-height: 62px; }
  .help-toggle { margin-top: 22px; }
}
@media (max-width: 400px) {
  .campus-cover { min-height: 306px; padding-left: 22px; padding-right: 22px; }
  .cover-header { min-height: 76px; gap: 12px; }
  .college-brand span { font-size: 14px; }
  .college-brand img { width: 32px; height: 32px; }
  .cover-content { min-height: 176px; }
  .cover-title h1 { font-size: 38px; }
  .college-motto { font-size: 20px; gap: 5px; padding-left: 10px; }
  .login-panel { padding: 22px 16px; }
  .login-content::before { left: 22px; }
  .login-heading { min-height: 84px; padding: 20px 22px; }
  .login-heading h2 { font-size: 26px; }
  .card-seal { width: 32px; height: 32px; }
  .ginkgo-drawing { width: 138px; height: 112px; bottom: -23px; }
  .login-form { padding: 20px 22px; }
  .login-targets { gap: 10px; }
  .login-targets button { min-height: 60px; padding: 10px; font-size: 14px; gap: 7px; }
  .login-targets .choice-check { top: 5px; right: 5px; width: 12px; height: 12px; }
  .uis-button { min-height: 54px; margin-top: 18px; padding-left: 18px; padding-right: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .uis-button, .login-targets button, .help-chevron { transition: none; }
  .login-spinner { animation: none; }
}
</style>
