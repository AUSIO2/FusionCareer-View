# FusionCareer-View 部署脚本

前端独立仓库；网关与 Java API 见 [FusionCareer-Backend](https://github.com/AUSIO2/FusionCareer-Backend) 的 `deploy/`。

## 流程

```text
Mac:                  mac-build-frontend.sh --no-serve → dist.tgz
堡垒机入口资产:       上传一次
Python ↔ Java 通道:   从当前入口转到 Python
Python 机:            解压到 ~/fusioncareer/frontend/dist
```

统一入口规则：Mac 不直接 SSH 到 Python/Java，也不让云机回连 Mac HTTP。先经堡垒机进入任意一台可达资产，再通过 Python↔Java 双向 SSH 通道进入目标机或传包。

## Mac

```bash
cd /path/to/FusionCareer-View
cp deploy/env.frontend.example .env.frontend   # 可选

chmod +x deploy/scripts/*.sh
./deploy/scripts/mac-build-frontend.sh --no-serve
```

| 参数 | 说明 |
|------|------|
| `--no-serve` | 只 build + 打 tar |
| `--serve-only` | `/tmp` 已有包，只启 HTTP |
| `--rsync` | build 后 rsync（需 `.env.frontend` 里 PYTHON_HOST） |

## 上传并部署到 Python 机

将 `/tmp/fc-frontend-serve/fusioncareer-frontend-dist.tgz` 上传到当前堡垒机入口资产的 `/tmp/`。

如果入口是 Java，通过 Java → Python 通道传包并进入 Python：

```bash
scp -i /root/.ssh/id_ed25519_py \
  /tmp/fusioncareer-frontend-dist.tgz \
  vmadmin@10.107.13.184:/tmp/
ssh -i /root/.ssh/id_ed25519_py vmadmin@10.107.13.184
```

在 Python 机替换静态文件：

```bash
DIST_DIR="$HOME/fusioncareer/frontend/dist"
RELEASE_DIR="${DIST_DIR}.release-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RELEASE_DIR" "$DIST_DIR"
tar xzf /tmp/fusioncareer-frontend-dist.tgz -C "$RELEASE_DIR"
test -f "$RELEASE_DIR/index.html"
cp -a "$RELEASE_DIR/." "$DIST_DIR/"
```

## 本地开发

```bash
cd ui_kits/student
npm ci && npm run dev
```

API 代理见 `ui_kits/student/vite.config.js`（默认 `/api`、`/fudan` → localhost:9100）。
