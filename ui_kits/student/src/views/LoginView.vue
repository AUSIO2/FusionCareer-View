<template>
  <div class="login-page">
    <section class="campus-cover" aria-labelledby="platform-title">
      <div class="campus-photo" role="img" aria-label="复旦大学新闻学院秋景，银杏树下的小径通向教学楼" />
      <header class="cover-header">
        <a class="college-brand" href="https://xwxy.fudan.edu.cn/" target="_blank" rel="noopener noreferrer">
          <img src="/brand/fudan-seal.svg" alt="复旦大学校徽" width="48" height="48" />
          <span>复旦大学新闻学院</span>
        </a>
        <a class="college-link" href="https://xwxy.fudan.edu.cn/" target="_blank" rel="noopener noreferrer">
          学院官网
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
        </a>
      </header>

      <div class="cover-content">
        <div class="cover-title">
          <p>实习 · 就业 · 职业发展</p>
          <h1 id="platform-title">复新生涯</h1>
        </div>
        <a
          class="college-motto"
          href="https://xwxy.fudan.edu.cn/xygk/list.htm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="好学力行，了解新闻学院院铭"
        ><span>好学</span><span>力行</span></a>
      </div>

      <div class="cover-caption">
        <span class="caption-rule" aria-hidden="true" />
        <span>新闻学院 · 银杏时节</span>
      </div>
    </section>

    <main class="entry-desk" aria-labelledby="entry-title">
      <div class="entry-controls">
        <div class="entry-heading">
          <span class="entry-mark" aria-hidden="true" />
          <h2 id="entry-title">进入平台</h2>
        </div>

        <div class="login-targets" role="group" aria-label="选择登录身份">
          <button
            type="button"
            :class="{ selected: !isAdminTarget }"
            :aria-pressed="!isAdminTarget"
            :disabled="loggingIn"
            @click="setTarget('user')"
          >学生端</button>
          <button
            type="button"
            :class="{ selected: isAdminTarget }"
            :aria-pressed="isAdminTarget"
            :disabled="loggingIn"
            @click="setTarget('admin')"
          >管理端</button>
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
        </button>
      </div>

      <div v-if="errorMessage" class="login-alert" role="alert">
        <p>{{ errorMessage }}</p>
        <button v-if="loginError === 'admin_forbidden'" type="button" @click="setTarget('user')">
          切换到学生端 <span aria-hidden="true">→</span>
        </button>
      </div>

      <div v-show="helpOpen" id="login-help" class="login-help">
        <p>使用复旦大学统一身份认证账号，账号和密码在学校认证页面填写。</p>
        <p>管理端仅对已开通管理权限的账号开放；若认证未完成，可返回本页重新登录。</p>
      </div>

      <div class="platform-guide">
        <div class="guide-heading">
          <span>{{ isAdminTarget ? '管理工作' : '在这里，你可以' }}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h10a5 5 0 0 1 5 5v5m-4-4 4 4 4-4" /></svg>
        </div>
        <ul class="feature-list" aria-label="登录后的平台功能">
          <li v-for="feature in currentFeatures" :key="feature.title">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </li>
        </ul>
      </div>
    </main>

    <footer class="page-footer">
      <a href="https://xwxy.fudan.edu.cn/b6/a6/c41268a636582/page.htm" target="_blank" rel="noopener noreferrer">
        校园影像 / 复旦大学新闻学院
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
      </a>
    </footer>
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
const currentFeatures = computed(() => isAdminTarget.value ? [
  { title: '发布岗位', description: '维护招聘信息与岗位问卷' },
  { title: '审核投递', description: '查看申请与学生提交材料' },
  { title: '导出简历', description: '按需整理投递数据与简历' },
] : [
  { title: '寻找机会', description: '浏览实习与就业岗位' },
  { title: '准备投递', description: '上传简历，填写岗位申请' },
  { title: '回看申请', description: '查看投递记录与已提交内容' },
])
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
  background: #ede8dd;
  color: var(--ink);
  font-family: var(--login-font);
}
.login-page button { font-family: inherit; cursor: pointer; }
.login-page button, .login-page a { -webkit-tap-highlight-color: transparent; }
.login-page svg { stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.login-page :is(button, a):focus-visible { outline: 3px solid #245697; outline-offset: 5px; }
.campus-cover {
  position: relative;
  min-height: clamp(490px, 68svh, 800px);
  display: flex;
  flex-direction: column;
  padding: 0 clamp(32px, 5vw, 96px) 108px;
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
  width: 100%;
  max-width: 1536px;
  min-height: 104px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid rgba(255,250,240,.25);
}
.college-brand { display: inline-flex; align-items: center; gap: 16px; }
.college-brand img { flex-shrink: 0; filter: grayscale(1) brightness(0) invert(1); opacity: .94; }
.college-brand span { font-size: 19px; font-weight: 500; letter-spacing: .04em; }
.college-link { min-height: 44px; display: inline-flex; align-items: center; gap: 10px; font-size: 14px; }
.college-link svg { width: 18px; height: 18px; }
.college-link:hover { text-decoration: underline; text-underline-offset: 6px; }
.campus-cover a:focus-visible { outline-color: #fffaf0; }
.cover-content {
  width: 100%;
  max-width: 1536px;
  flex: 1;
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.cover-title p { margin-bottom: 20px; font-size: 16px; font-weight: 400; letter-spacing: .16em; }
.cover-title h1 {
  font-family: inherit;
  font-size: clamp(54px, 5.6vw, 84px);
  font-weight: 400;
  letter-spacing: .075em;
  line-height: 1.2;
  text-shadow: 0 2px 24px rgba(27,32,21,.12);
}
.college-motto {
  display: flex;
  flex-direction: row-reverse;
  gap: 14px;
  align-self: flex-start;
  margin-top: 4px;
  padding: 14px 5px 16px 22px;
  border-left: 1px solid rgba(255,250,240,.5);
  font-family: 'Songti SC', 'STSong', 'SimSun', serif;
  font-size: 31px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: .25em;
}
.college-motto span { writing-mode: vertical-rl; }
.college-motto:hover { color: #fff; }
.cover-caption {
  width: 100%;
  max-width: 1536px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
  font-size: 13px;
  letter-spacing: .07em;
}
.caption-rule { width: 26px; height: 1px; background: currentColor; opacity: .7; }
.entry-desk {
  position: relative;
  z-index: 1;
  width: calc(100% - clamp(64px, 10vw, 192px));
  max-width: 1536px;
  margin: -64px auto 0;
  padding: 38px 40px 32px;
  border-top: 3px solid var(--wine);
  border-radius: 2px;
  background: var(--paper);
  box-shadow: 0 15px 40px rgba(50,43,31,.08);
}
.entry-controls {
  display: grid;
  grid-template-columns: minmax(125px, .75fr) minmax(200px, 1fr) minmax(260px, 1.6fr) auto;
  align-items: center;
  gap: 30px;
}
.entry-heading { display: flex; align-items: center; gap: 12px; }
.entry-mark { width: 4px; height: 24px; background: var(--wine); }
.entry-heading h2 { font-family: inherit; font-size: 21px; font-weight: 500; white-space: nowrap; }
.login-targets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-width: 0;
  padding: 4px;
  border: 1px solid #d7d0c3;
  border-radius: 4px;
  background: #eeeadf;
}
.login-targets button {
  min-height: 42px;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  color: #69645a;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  transition: background .15s ease, color .15s ease;
}
.login-targets button.selected { border-color: #ddd5c6; background: #fffdf8; color: var(--wine); box-shadow: 0 1px 3px rgba(44,35,19,.06); font-weight: 600; }
.login-targets button:hover:not(:disabled) { color: var(--wine); }
.login-targets button:disabled { cursor: wait; opacity: .65; }
.uis-button {
  min-height: 54px;
  width: 100%;
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
.help-toggle { min-height: 44px; display: inline-flex; align-items: center; gap: 7px; padding: 0; border: 0; background: transparent; color: #656056; font-size: 14px; white-space: nowrap; }
.help-toggle svg { width: 17px; height: 17px; flex-shrink: 0; }
.help-toggle:hover { color: var(--wine); }
.platform-guide {
  display: grid;
  grid-template-columns: minmax(125px, .75fr) minmax(0, 3.3fr);
  gap: 30px;
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid #ded8cb;
}
.guide-heading { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; color: #767062; font-size: 13px; }
.guide-heading svg { width: 24px; height: 24px; }
.feature-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; list-style: none; }
.feature-list li + li { padding-left: 26px; border-left: 1px solid #e1dbcf; }
.feature-list h3 { margin: 0 0 9px; font-family: inherit; font-size: 17px; font-weight: 500; line-height: 1.5; }
.feature-list p { margin: 0; color: #70695e; font-size: 13px; line-height: 1.75; }
.login-alert { margin-top: 22px; padding: 12px 16px; border-left: 3px solid var(--wine); background: #f3e5e3; color: #722b32; font-size: 14px; line-height: 1.7; }
.login-alert button { min-height: 36px; display: inline-flex; align-items: center; gap: 8px; margin-top: 4px; padding: 0; border: 0; background: transparent; color: inherit; font-size: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.login-help { margin-top: 24px; padding: 16px 18px; border: 1px solid #e0d9cd; background: #f0ece2; color: #5e594f; font-size: 14px; line-height: 1.8; }
.login-help p + p { margin-top: 6px; }
.login-spinner { flex: 0 0 18px; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: login-spin .8s linear infinite; }
@keyframes login-spin { to { transform: rotate(360deg); } }
.page-footer { width: calc(100% - clamp(64px, 10vw, 192px)); max-width: 1536px; margin: 0 auto; padding: 20px 0 24px; display: flex; justify-content: flex-end; }
.page-footer a { min-height: 32px; display: inline-flex; align-items: center; gap: 8px; color: #746d60; font-size: 12px; }
.page-footer svg { width: 14px; height: 14px; }
.page-footer a:hover { color: var(--wine); }

@media (max-width: 1150px) {
  .entry-desk { padding: 30px; }
  .entry-controls { grid-template-columns: 1fr 1.45fr auto; gap: 24px; }
  .entry-heading { grid-column: 1 / -1; }
  .platform-guide { grid-template-columns: 1fr; gap: 18px; margin-top: 28px; padding-top: 24px; }
  .guide-heading { flex-direction: row; align-items: center; }
  .guide-heading svg { width: 18px; height: 18px; }
}
@media (max-width: 700px) {
  .campus-cover { min-height: 370px; padding: 0 24px 82px; }
  .cover-header { min-height: 82px; gap: 12px; }
  .college-brand { gap: 10px; }
  .college-brand img { width: 36px; height: 36px; }
  .college-brand span { font-size: 16px; letter-spacing: 0; }
  .college-link { font-size: 12px; gap: 4px; white-space: nowrap; }
  .college-link svg { width: 14px; height: 14px; }
  .cover-content { padding: 54px 0 32px; gap: 16px; }
  .cover-title p { margin-bottom: 14px; font-size: 12px; letter-spacing: .08em; }
  .cover-title h1 { font-size: clamp(40px, 9vw, 56px); letter-spacing: .045em; }
  .college-motto { gap: 4px; margin-top: -8px; padding: 7px 0 7px 12px; font-size: 23px; }
  .cover-caption { font-size: 11px; }
  .campus-photo::before { background-position: 46% center; }
  .entry-desk { width: calc(100% - 32px); margin-top: -46px; padding: 24px; }
  .entry-controls { grid-template-columns: 1fr auto; gap: 18px; }
  .entry-heading { grid-column: 1 / -1; }
  .entry-heading h2 { font-size: 20px; }
  .entry-mark { height: 21px; width: 3px; }
  .help-toggle { grid-column: 1 / -1; justify-self: end; min-height: 36px; margin-top: -8px; font-size: 12px; gap: 5px; }
  .login-targets { grid-column: 1 / -1; }
  .uis-button { grid-column: 1 / -1; min-height: 54px; }
  .platform-guide { margin-top: 16px; padding-top: 22px; gap: 18px; }
  .guide-heading { font-size: 12px; }
  .feature-list { grid-template-columns: 1fr; gap: 16px; }
  .feature-list li { display: grid; grid-template-columns: 75px 1fr; gap: 12px; align-items: baseline; }
  .feature-list li + li { padding: 0; border: 0; }
  .feature-list h3 { margin: 0; font-size: 15px; }
  .feature-list p { font-size: 12px; line-height: 1.6; }
  .page-footer { width: calc(100% - 48px); padding: 14px 0 20px; justify-content: flex-start; }
  .page-footer a { font-size: 11px; }
}
@media (max-width: 360px) {
  .campus-cover { padding-left: 20px; padding-right: 20px; }
  .college-brand span { font-size: 14px; }
  .college-brand img { width: 32px; height: 32px; }
  .college-link { font-size: 11px; }
  .entry-desk { padding: 22px 18px; }
  .help-toggle { font-size: 11px; }
  .feature-list li { grid-template-columns: 64px 1fr; gap: 8px; }
  .feature-list h3 { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .uis-button, .login-targets button { transition: none; }
  .login-spinner { animation: none; }
}
</style>
