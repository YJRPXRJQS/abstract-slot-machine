# 🚀 Vercel 部署指南

## 方案：Vercel + 国内CDN加速

### 第一步：部署到 Vercel

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **创建 GitHub 仓库**
   ```bash
   # 在项目目录初始化git
   git init
   git add .
   git commit -m "Initial commit"
   
   # 创建GitHub仓库并推送
   git remote add origin https://github.com/你的用户名/赛博老虎机.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 登录 Vercel 控制台
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"
   - 框架选择 "Other"
   - 点击 "Deploy"

4. **等待部署完成**
   - Vercel 会自动识别 `vercel.json` 配置
   - 部署完成后会获得一个 `.vercel.app` 域名

### 第二步：配置国内CDN加速

#### 方案A：使用 Cloudflare CDN（免费）

1. **注册 Cloudflare 账号**
   - 访问 https://cloudflare.com
   - 添加你的 Vercel 域名

2. **修改 DNS 解析**
   - 在域名注册商处修改 NS 记录为 Cloudflare 提供的地址
   - 等待 DNS 生效（通常几分钟到几小时）

3. **开启 CDN 加速**
   - 在 Cloudflare 控制台开启橙色云朵（Proxied）
   - 开启 "Always Use HTTPS"

#### 方案B：使用国内CDN（推荐，速度更快）

**腾讯云CDN**：
1. 登录腾讯云控制台
2. 进入 CDN 服务
3. 添加域名，源站填写 Vercel 域名
4. 配置 CNAME 解析
5. 等待CDN生效

**阿里云CDN**：
1. 登录阿里云控制台
2. 进入 CDN 服务
3. 添加加速域名
4. 配置源站为 Vercel 地址
5. 修改 DNS CNAME 记录

### 第三步：绑定自定义域名（可选）

1. **购买域名**
   - 推荐：阿里云、腾讯云、Namecheap

2. **在 Vercel 添加域名**
   - 进入项目设置 → Domains
   - 输入你的域名
   - 按提示配置 DNS 解析

3. **配置国内CDN**
   - 将域名解析到 CDN 服务商
   - CDN 源站指向 Vercel

### 文件结构说明

```
抽象视频灵感捕捉器/
├── index.html          # 主页面
├── vercel.json         # Vercel 配置文件
├── api/                # API 路由目录
│   └── zhipu.js        # 智谱AI代理API
├── proxy-server.js     # 本地开发代理（可选）
└── DEPLOY.md           # 本部署文档
```

### 环境变量配置（可选）

如果需要隐藏API Key，可以在 Vercel 设置环境变量：

1. 进入 Vercel 项目设置
2. 选择 "Environment Variables"
3. 添加变量：
   - Name: `ZHIPU_API_KEY`
   - Value: 你的智谱API Key

然后修改 `api/zhipu.js` 读取环境变量。

### 国内访问优化建议

1. **使用国内CDN** - 大幅提升访问速度
2. **压缩图片资源** - 减少加载时间
3. **开启Gzip压缩** - Vercel 默认开启
4. **使用国内DNS** - 如 DNSPod

### 常见问题

**Q: Vercel在国内访问慢怎么办？**
A: 必须使用国内CDN加速，推荐腾讯云或阿里云CDN。

**Q: API请求失败？**
A: 检查API Key是否正确，以及Vercel Function是否部署成功。

**Q: 如何更新网站内容？**
A: 直接推送代码到GitHub，Vercel会自动重新部署。

### 费用说明

- **Vercel**: 免费额度足够个人项目使用
- **Cloudflare**: 免费版足够
- **国内CDN**: 按流量计费，约0.15-0.3元/GB
- **域名**: 约50-100元/年

---

部署完成后，你就可以通过自定义域名在国内访问了！
