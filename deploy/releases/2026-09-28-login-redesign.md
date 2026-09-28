# 登录页改版上线记录

发布日期：2026-09-28（Asia/Shanghai）。

## 发布版本

- 前端源码：`6be883c5ade0be33ec71d40b11d2d4cb0fa72377`，分支 `codex/frontend-integration`。
- 正式入口：<https://fusioncareer.fudan.edu.cn/#/login>。
- 服务器：`vmadmin@10.107.13.184`。
- 静态目录：`/home/vmadmin/fusioncareer/frontend/dist`。
- 发布目录：`/home/vmadmin/fusioncareer/releases/20260928-login-redesign-6be883c`。
- 本次只发布前端，未重启 Nginx、Java 或 Python 服务，未变更数据库和认证配置。

页面包含校园实景、校徽、吴晓波引言和银杏线描。点击任一身份按钮时两片叶子共同轻晃一次，动画不区分身份，支持减少动态效果。认证仍由复旦 UIS 完成。

## 构建与校验

- 本地 13 项测试通过，Vite 生产构建及 `git diff --check` 通过。
- `src`、`public` 无未提交修改；原有 `node_modules` 脏改动未提交。
- 入口 JS：`assets/index-BX9DchXZ.js`。
- 登录页 JS：`assets/LoginView-kLL2YfIi.js`。
- 登录页 CSS：`assets/LoginView-O8bLB23g.css`。
- `index.html` SHA-256：`cf540418c5c823e14ff7d8bfa69c5f7d23c624464a0eb913afdf988e5dcffb1f`。
- 发布包 SHA-256：`a1eeeea52c2448496986402379cadf1a920177b2d5c58a6b01b28583e9cd2a5e`。
- 19 个文件经源站 HTTP 和正式 HTTPS 逐一检查，内容 SHA-256 均与构建一致。
- `/api/sys/health` 返回 `UP`。
- `/fudan/login?target=user` 和 `?target=admin` 均返回 302，目标为复旦统一认证，回调地址保持 `https://fusioncareer.fudan.edu.cn/fudan/callback`。
- 正式 HTTPS 浏览器检查通过：引语与新布局正确，学生/管理切换及重复点击均触发两片叶子的单次动画，1.5 秒后停止；390px 手机无横向溢出，登录按钮位于首屏。无 JavaScript 或站内资源加载错误。
- 浏览器检查保留 TLS 校验，并仅在该独立 Chrome 会话使用临时域名映射；为避免外部字体网络延迟跳过 Google Fonts 样式请求，登录页仍使用系统字体。
- 未代替用户登录 UIS 或验证真实账号授权回调。

## 发布与回滚

先备份旧静态目录并校验备份中的旧入口，再上传新资源，最后通过同目录 rename 切换 `index.html`。旧版 hash 资源继续保留，避免已打开的页面加载旧 chunk 时遇到 404。

发布目录内保存 `release.json`、`files.sha256`、发布包、`deploy.sh` 和 `rollback.sh`；仅部署用户可访问。

- 备份：`/home/vmadmin/fusioncareer/releases/20260928-login-redesign-6be883c/frontend-before.tgz`。
- 备份 SHA-256：`b85d70d297d39005995d13b5893b98e8331970f0f8606ef2408a125203b7471b`。
- 旧版 `index.html` SHA-256：`c9d7b7536f5c5f7024905355b454549ae8fb157f69935c013a4fc7e89abf01b3`。

如需回滚，在 Python 网关服务器执行：

```sh
bash /home/vmadmin/fusioncareer/releases/20260928-login-redesign-6be883c/rollback.sh
```

回滚会恢复旧资源及入口，保留新增的版本化文件，不操作服务和数据库。

## 本机 DNS 差异

发布时本机将域名解析为源站 `10.107.13.184`（该机只监听 HTTP）；服务器解析为 HTTPS 网关 `175.186.248.2`。正式 HTTPS 通过服务器正常访问，并使用本机 `curl --resolve` 指向服务器解析得到的网关地址交叉验证，未跳过证书校验，也未修改本机 DNS 或 hosts。该地址是本次检查时的解析结果，不应硬编码为长期配置。
