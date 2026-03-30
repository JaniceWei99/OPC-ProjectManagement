# SoloHelm

> **One Person Company** 的个人项目管理工具 — 从灵感到发布的完整管道。

SoloHelm 是一款为独立开发者 / 一人公司量身打造的轻量任务管理工具。零配置、自托管、完整数据所有权，用最少的技术负担覆盖灵感收集、任务看板、数据分析三大场景。

---

## 预览

| 深色主题 | 浅色主题 |
|:--------:|:--------:|
| 左侧固定深色侧边栏 + 看板视图 | 切换浅色后内容区变白 |

```
┌──────────┬──────────────────────────────────┐
│ SoloHelm │  [主题] [语言] [历史] [设置] [+] │
│          ├──────────────────────────────────┤
│  灵感    │                                  │
│  看板    │         Tab 内容区域              │
│  分析    │   Kanban / List / Timeline ...    │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

---

## 核心特性

### 灵感池 (Ideas)
- 快速记录灵感，支持实时搜索和语音输入（Web Speech API）
- 灵感可一键转为任务 (To Todo)，任务也可退回灵感池 (To Idea)
- 语音速记 — 不用打字，张口就录

### 看板 (Board)
- **5 阶段生命周期**：`backlog` → `todo` → `dev` → `done` → `publish`
- **三种视图**：Kanban 拖拽看板 / List 紧凑列表 / Timeline 时间线
- **4 列看板**：待办 · 进行中 · 开发完成 · 已发布
- 拖拽移动任务跨列，点击状态标记循环（空 → 进行中 → 阻塞）
- 子任务/Checklist 带进度条
- 周期性任务 — 完成时自动克隆为新 todo（daily / weekly / monthly）

### 分析 (Analytics)
- 4 张 Chart.js 图表：状态分布 / 优先级分布 / 周速率 / 燃尽图
- Hero 指标面板：今日任务、风险项、活跃数

### 其他亮点

| 功能 | 说明 |
|------|------|
| 侧边栏导航 | 左侧 200px 深色固定侧边栏，纵向切换 Tab |
| 中英文切换 | i18n 系统，~150 个翻译 key，一键切换 |
| 深色 / 浅色主题 | 侧边栏始终深色，内容区跟随主题 |
| 键盘快捷键 | `1` `2` `3` 切 Tab、`N` 新建、`/` 搜索、`?` 帮助、`Ctrl+Z` 撤销 |
| 数据导出/导入 | JSON / CSV 导出，JSON 导入 |
| Undo 撤销 | 删除和状态变更 5 秒内可撤销（Toast + Undo 按钮） |
| PWA 离线支持 | Service Worker 缓存，可安装到桌面/手机 |
| 活动日志 | 全量变更历史，支持按任务查看 |
| 响应式布局 | 桌面侧边栏，移动端（≤768px）底部 Tab 栏 |
| 前后端校验 | 枚举/长度校验，防止脏数据写入 |

---

## 快速开始

### 环境要求

- **Node.js** >= 16

### 安装 & 启动

```bash
git clone https://github.com/JaniceWei99/OPC-ProjectManagement.git
cd OPC-ProjectManagement
npm install
npm start
```

打开浏览器访问 **http://localhost:3000** 即可使用。首次启动会自动创建数据库并注入演示数据。

### 一行命令（已安装 Node.js）

```bash
git clone https://github.com/JaniceWei99/OPC-ProjectManagement.git && cd OPC-ProjectManagement && npm install && npm start
```

---

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 服务监听端口 |
| `NODE_ENV` | — | 设为 `production` 可关闭 Express 调试信息、启用缓存 |

数据库路径固定为 `<项目根>/data/board.db`（Docker 中为 `/app/data/board.db`），通过挂载 volume 实现持久化。

```bash
# 示例：更换端口
PORT=8080 npm start
```

---

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 后端 | Node.js + Express | RESTful API，~565 行 |
| 数据库 | SQLite (sql.js) | 内存运行，持久化到 `data/board.db` |
| 前端 | 纯 HTML/CSS/JS | 无框架、无构建步骤，单页应用 |
| 图表 | Chart.js 4.x (CDN) | 状态/优先级/速率/燃尽图 |
| 图标 | FontAwesome 6.5.1 (CDN) | 全站图标 |
| 字体 | Inter (Google Fonts) | UI 字体 |
| PWA | Service Worker + Manifest | 离线缓存 + 可安装 |

**零构建** — 没有 webpack、没有 TypeScript。`npm start` 一键运行，也支持 Docker 和 Kubernetes 部署。

---

## 项目结构

```
.
├── server.js                # Express 后端 (~565 行)
├── package.json
├── Dockerfile               # 多阶段 Docker 构建
├── .dockerignore
├── public/
│   ├── index.html           # 单页应用入口 (~337 行)
│   ├── app.js               # 前端逻辑 + i18n (~1620 行)
│   ├── style.css            # 全部样式 (~329 行)
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service Worker
├── helm/solohelm/           # Helm Chart (Kubernetes 部署)
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/           # K8s 资源模板
├── data/
│   └── board.db             # SQLite 数据库 (自动创建)
├── doc/
│   └── competitive-analysis.md  # 竞品分析 + 版本变更记录
└── openspec/                # OpenSpec 变更归档 (proposals, designs, specs, tasks)
```

---

## API 参考

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/tasks` | 获取全部任务 |
| `GET` | `/api/tasks/:id` | 获取单个任务 |
| `POST` | `/api/tasks` | 创建任务 |
| `PUT` | `/api/tasks/:id` | 更新任务 |
| `DELETE` | `/api/tasks/:id` | 删除任务 |
| `GET` | `/api/tasks/:id/history` | 任务变更历史 |
| `POST` | `/api/tasks/:id/clone` | 克隆任务（周期性） |
| `GET` | `/api/history` | 全局活动日志 |
| `GET` | `/api/analytics` | 分析数据 |
| `GET` | `/api/export` | 导出全部任务 (JSON) |
| `POST` | `/api/import` | 批量导入任务 (JSON) |

### 示例

```bash
# 创建任务
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title": "设计新 Logo", "priority": "P1", "status": "todo"}'

# 获取全部任务
curl http://localhost:3000/api/tasks

# 导出数据
curl http://localhost:3000/api/export -o backup.json
```

---

## 键盘快捷键

| 按键 | 功能 |
|------|------|
| `1` | 切换到灵感 Tab |
| `2` | 切换到看板 Tab |
| `3` | 切换到分析 Tab |
| `N` | 新建任务/灵感 |
| `/` | 聚焦搜索框 |
| `Esc` | 关闭弹窗/面板 |
| `?` | 显示快捷键帮助 |
| `Ctrl+Z` | 撤销上一个操作 |

---

## 与竞品对比

| 功能 | SoloHelm | Trello | Linear | Todoist |
|------|----------|--------|--------|---------|
| 自托管/数据所有权 | **完全自有** | 厂商托管 | 厂商托管 | 厂商托管 |
| 价格 | **免费** | 免费/付费 | $8/月起 | 免费/付费 |
| 灵感池 + 看板管道 | **原生支持** | 无 | 无 | 无 |
| 5 阶段发布流程 | **有** | 自定义 | 自定义 | 无 |
| 子任务/Checklist | **有** | 有 | 有 | 有 |
| 数据可视化 | **4 图表** | 插件 | 有 | 无 |
| 时间线视图 | **有** | 插件 | 有 | 无 |
| 离线支持 | **PWA** | 部分 | 完整 | 部分 |
| 周期性任务 | **有** | 插件 | 无 | 有 |
| 多语言 | **中/英** | 多语言 | 多语言 | 多语言 |
| 零配置启动 | **npm start** | 需注册 | 需注册 | 需注册 |

---

## 数据备份与迁移

```bash
# 备份数据库
cp data/board.db data/board-backup-$(date +%Y%m%d).db

# 导出为 JSON
curl http://localhost:3000/api/export > tasks-backup.json

# 导入 JSON
curl -X POST http://localhost:3000/api/import \
  -H 'Content-Type: application/json' \
  -d @tasks-backup.json
```

---

## Docker 部署

```bash
# 构建镜像
docker build -t solohelm:latest .

# 运行（数据持久化到本地 data 目录）
docker run -d \
  --name solohelm \
  -p 3000:3000 \
  -v solohelm-data:/app/data \
  solohelm:latest
```

打开 http://localhost:3000 即可使用。

### 自定义端口

```bash
docker run -d \
  --name solohelm \
  -p 8080:8080 \
  -e PORT=8080 \
  -v solohelm-data:/app/data \
  solohelm:latest
```

### 推送到镜像仓库

```bash
# Docker Hub
docker tag solohelm:latest <your-dockerhub-user>/solohelm:latest
docker push <your-dockerhub-user>/solohelm:latest

# GitHub Container Registry (GHCR)
docker tag solohelm:latest ghcr.io/<your-github-user>/solohelm:latest
docker push ghcr.io/<your-github-user>/solohelm:latest
```

> Helm / Kubernetes 部署前需要先将镜像推到集群可访问的 registry，然后在 `values.yaml` 中配置 `image.repository`。

### Docker Compose（可选）

```yaml
# docker-compose.yml
version: "3.8"
services:
  solohelm:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - solohelm-data:/app/data
    restart: unless-stopped

volumes:
  solohelm-data:
```

```bash
docker compose up -d
```

### 常用 Docker 运维命令

```bash
# 查看日志
docker logs -f solohelm

# 停止 / 启动 / 重启
docker stop solohelm
docker start solohelm
docker restart solohelm

# 删除容器（数据在 volume 中不会丢失）
docker rm -f solohelm

# 更新镜像
docker build -t solohelm:latest . && docker rm -f solohelm
docker run -d --name solohelm -p 3000:3000 -v solohelm-data:/app/data solohelm:latest
```

---

## Kubernetes 部署 (Helm)

项目自带 Helm Chart，可一键部署到任意 Kubernetes 集群。

### 快速部署

```bash
# 安装
helm install solohelm ./helm/solohelm

# 查看状态
kubectl get pods -l app.kubernetes.io/name=solohelm

# 端口转发访问
kubectl port-forward svc/solohelm 3000:80
```

### 自定义配置

```bash
# 使用 Ingress 暴露服务
helm install solohelm ./helm/solohelm \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=solohelm.example.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=Prefix

# 自定义存储大小
helm install solohelm ./helm/solohelm \
  --set persistence.size=5Gi

# 禁用持久化（用于测试）
helm install solohelm ./helm/solohelm \
  --set persistence.enabled=false
```

### 升级 / 回滚 / 卸载

```bash
# 升级（修改代码或配置后重新部署）
helm upgrade solohelm ./helm/solohelm

# 升级并同时修改配置
helm upgrade solohelm ./helm/solohelm --set image.tag=v1.1.0

# 查看历史版本
helm history solohelm

# 回滚到上一个版本
helm rollback solohelm

# 回滚到指定版本（如第 2 次部署）
helm rollback solohelm 2

# 卸载（PVC 默认保留数据）
helm uninstall solohelm
```

### 通过 env 注入自定义环境变量

`values.yaml` 中的 `env` 字段会注入到容器中，可在安装/升级时传入：

```bash
helm install solohelm ./helm/solohelm \
  --set env.PORT=8080 \
  --set env.NODE_ENV=production
```

或在 `values.yaml` 中直接配置：

```yaml
env:
  NODE_ENV: production
```

### Helm Chart 特性

| 特性 | 说明 |
|------|------|
| PersistentVolumeClaim | 默认 1Gi，SQLite 数据持久化 |
| Health Check | liveness + readiness 探针 |
| SecurityContext | 非 root 用户运行，drop ALL capabilities |
| Ingress | 可选，支持 TLS |
| HPA | 可选，CPU 自动扩缩 |
| ServiceAccount | 自动创建 |

> **注意**：由于 SQLite 不支持并发写入，HPA 扩缩仅适用于只读场景。生产环境建议保持 `replicaCount: 1`。

---

## 生产部署

对于裸机 / 云主机的直接部署，建议使用进程管理器 + 反向代理来保证服务稳定和 HTTPS 支持。

### 使用 PM2 进程管理

```bash
# 全局安装 pm2
npm install -g pm2

# 启动应用（自动重启 + 日志管理）
pm2 start server.js --name solohelm

# 设置开机自启
pm2 startup
pm2 save

# 常用命令
pm2 status          # 查看状态
pm2 logs solohelm   # 查看日志
pm2 restart solohelm
pm2 stop solohelm
```

### 使用 systemd（Linux 服务器）

创建 `/etc/systemd/system/solohelm.service`：

```ini
[Unit]
Description=SoloHelm Task Board
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/solohelm
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable solohelm
sudo systemctl start solohelm
sudo systemctl status solohelm
```

### Nginx 反向代理 + HTTPS

```nginx
server {
    listen 80;
    server_name solohelm.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name solohelm.example.com;

    ssl_certificate     /etc/letsencrypt/live/solohelm.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/solohelm.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

使用 [Certbot](https://certbot.eff.org/) 自动获取 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d solohelm.example.com
```

---

## 开发说明

- 修改前端文件后刷新浏览器即可，无需重启服务
- 修改 `server.js` 后需重启 Node 进程
- 数据库会自动迁移（新增列、导入旧 JSON 数据）
- 使用 `sql.js`（纯 JS SQLite），无需安装原生编译工具

---

## 版本历史

| 版本 | 日期 | 主要变更 |
|------|------|----------|
| **v1.0.0** | 2026-03-25 | 单页应用重构 + 侧边栏导航 + 中英文 i18n + 完整功能 |

详细变更记录见 [doc/competitive-analysis.md](doc/competitive-analysis.md)。

---

## 常见问题排查

### 端口被占用

```
Error: listen EADDRINUSE: address already in use :::3000
```

```bash
# 查找占用端口的进程
lsof -i :3000
# 或使用其他端口启动
PORT=3001 npm start
```

### 数据库锁定 / 损坏

```bash
# 备份当前数据库
cp data/board.db data/board.db.bak

# 删除后重启，会自动创建新数据库
rm data/board.db
npm start

# 如需恢复数据，用之前导出的 JSON 导入
curl -X POST http://localhost:3000/api/import \
  -H 'Content-Type: application/json' \
  -d @tasks-backup.json
```

### Docker 容器内数据丢失

确保使用了 volume 挂载：

```bash
# 错误 — 容器删除后数据丢失
docker run -d -p 3000:3000 solohelm:latest

# 正确 — 数据持久化到 volume
docker run -d -p 3000:3000 -v solohelm-data:/app/data solohelm:latest
```

### Helm 部署后无法访问

```bash
# 检查 Pod 状态
kubectl get pods -l app.kubernetes.io/name=solohelm
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# 使用端口转发临时访问
kubectl port-forward svc/solohelm 3000:80
```

### npm install 失败

```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install

# 如果网络问题，使用镜像源
npm install --registry=https://registry.npmmirror.com
```

### 页面白屏 / 静态资源 404

- 确认 `public/` 目录下文件完整（index.html、app.js、style.css、sw.js、manifest.json）
- 确认从项目根目录启动 `node server.js`，而非从子目录
- 清除浏览器缓存和 Service Worker（DevTools → Application → Service Workers → Unregister）

---

## 许可证

MIT

---

<p align="center">
  <b>SoloHelm</b> — 专为一人公司打造的项目管理工具<br>
  如果觉得有用，欢迎 Star!
</p>
