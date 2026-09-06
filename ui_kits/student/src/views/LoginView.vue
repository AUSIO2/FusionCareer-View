<template>
  <div class="login-page">
    <div class="login-top-bar" />
    <div class="grid-bg" />

    <div class="login-center">
      <!-- Brand -->
      <div class="login-brand fade-up">
        <div class="login-zh">复新生涯</div>
        <div class="login-en">FusionCareer</div>
        <div class="login-school">复旦大学新闻学院 · 就业与职业发展平台</div>
      </div>

      <!-- 登录卡片（UIS 主体） -->
      <div class="login-card fade-up" style="animation-delay:.1s">
        <div class="uis-illust">
          <div class="uis-logo">
            <i class="ti ti-shield-check" />
          </div>
          <div class="uis-text">
            <div class="uis-line1">Fudan UIS</div>
            <div class="uis-line2">复旦大学统一身份认证 · 安全跳转</div>
          </div>
        </div>

        <button class="btn-primary btn-red" @click="loginUIS">
          <i class="ti ti-external-link" />
          <span>前往 UIS 登录</span>
        </button>

        <div class="helper-text">
          <i class="ti ti-info-circle" />
          将跳转至复旦大学统一身份认证页面，认证后自动返回
        </div>
      </div>
    </div>

    <!-- 管理员入口（左下角） -->
    <button class="admin-corner" @click="loginAdmin">
      <i class="ti ti-shield-lock" />
      进入管理端
    </button>
  </div>
</template>

<script setup>
const beginLogin = (target) => {
  window.location.assign(`/fudan/login?target=${target}`)
}

const loginUIS = () => beginLogin('user')
const loginAdmin = () => beginLogin('admin')
</script>

<style scoped>
/* ── 页面骨架 ── */
.login-page {
  min-height: 100vh; background: var(--bg);
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}
.login-top-bar { height: 4px; background: var(--red); flex-shrink: 0; position: relative; z-index: 10; }

.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(0,0,0,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.025) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%);
}

/* ── 主体 ── */
.login-center {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2.5rem 1rem; position: relative; z-index: 1;
}

/* ── Brand ── */
.login-brand  { text-align: center; margin-bottom: 2.25rem; display: flex; flex-direction: column; align-items: center; }
.login-zh     { font-family: var(--font-serif); font-size: 2.4rem; font-weight: 900; color: var(--red); letter-spacing: -.01em; line-height: 1.15; text-align: center; }
.login-en     { font-family: var(--font-sans); font-size: .82rem; font-weight: 600; color: var(--gold); letter-spacing: .24em; text-transform: uppercase; margin-top: .45rem; text-align: center; }
.login-school { font-size: .9rem; color: var(--ink-2); margin-top: .7rem; letter-spacing: .02em; text-align: center; }

/* ── 登录卡片 ── */
.login-card {
  width: 100%; max-width: 520px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 2.25rem 2.25rem 2rem;
  box-shadow: var(--shadow-md), 0 24px 60px -20px rgba(140,21,27,.18), 0 8px 24px -8px rgba(0,0,0,.08);
}

/* ── UIS 区块 ── */
.uis-illust {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.25rem 1.3rem;
  background: linear-gradient(135deg, var(--red-light) 0%, rgba(255,255,255,0) 100%);
  border: 1px solid var(--red-border); border-radius: 14px;
  margin-bottom: 1.4rem;
}
.uis-logo {
  width: 52px; height: 52px; border-radius: 13px;
  background: var(--red); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; flex-shrink: 0;
  box-shadow: 0 6px 14px rgba(140,21,27,.28);
}
.uis-line1 { font-weight: 700; font-size: 1.05rem; color: var(--ink); letter-spacing: .02em; }
.uis-line2 { font-size: .78rem; color: var(--ink-2); margin-top: .2rem; }

.helper-text {
  margin-top: 1rem; font-size: .76rem; color: var(--ink-3);
  display: flex; align-items: center; gap: .4rem; justify-content: center;
}
.helper-text i { font-size: .95rem; }

/* ── 管理员角落入口 ── */
.admin-corner {
  position: fixed; left: 1.5rem; bottom: 1.5rem; z-index: 50;
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .45rem .9rem; border-radius: var(--r-full);
  font-size: .75rem; font-weight: 500; font-family: var(--font-sans);
  color: var(--ink-3); background: var(--bg-card);
  border: 1px solid var(--border); cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--t);
}
.admin-corner:hover { color: var(--gold); border-color: rgba(184,135,30,.35); background: var(--gold-light); }
.admin-corner i { font-size: .85rem; }

/* ── 按钮 ── */
.btn-primary {
  width: 100%; padding: .95rem; border-radius: 12px; border: none;
  font-family: var(--font-sans); font-size: .98rem; font-weight: 600; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: .55rem;
  transition: all var(--t); position: relative; overflow: hidden; letter-spacing: .02em;
}
.btn-primary i { font-size: 1.15rem; }
.btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.25) 50%, transparent 70%);
  transform: translateX(-100%); transition: transform .6s;
}
.btn-primary:hover::after { transform: translateX(100%); }
.btn-red  { background: var(--red);  box-shadow: 0 8px 18px rgba(140,21,27,.25); }
.btn-red:hover  { background: var(--red-hover); transform: translateY(-1px); box-shadow: 0 10px 22px rgba(140,21,27,.32); }

/* ── 动画 ── */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-up { animation: fadeUp .45s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }

@media (max-width: 560px) {
  .login-card { padding: 1.5rem 1.4rem 1.4rem; }
  .login-zh { font-size: 2rem; }
  .admin-corner { left: 1rem; bottom: 1rem; }
}
</style>
