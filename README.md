# saladict-ztools

> 沙拉查词 - 聚合词典专业查词翻译（ZTools 版）

**作者：EvanW** ([evanwen97-ops](https://github.com/evanwen97-ops))

这是沙拉查词的 ZTools 插件版本，将 Chrome 浏览器扩展 [Saladict](https://saladict.crimx.com/) 适配到 ZTools 桌面效率工具中运行。

## 项目结构

```
.
├── plugin.json                    # ZTools 插件配置文件
├── package.json                   # 项目依赖配置
├── preload.cjs                    # Preload 脚本（axios + cookie 支持）
├── preload/
│   ├── services.js                # 辅助服务（文件读写等）
│   └── package.json               # CommonJS 标记
├── ext-saladic/                   # 沙拉查词浏览器扩展文件
│   ├── quick-search.html          # 主入口页面
│   ├── assets/                    # 静态资源（JS/CSS/图标等）
│   └── ...
├── webextensions-emulator-master/ # 浏览器扩展 API 模拟器
│   ├── dist/                      # 模拟器构建产物
│   └── lib/                       # 模拟器源码
├── logo.png                       # 插件图标
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 使用插件

1. 将本项目目录复制到 ZTools 插件目录
2. 重启 ZTools 或刷新插件列表
3. 输入「沙拉查词」或「saladict」触发插件

### 触发方式

- **关键词触发** - 输入「沙拉查词」或「saladict」
- **划词翻译** - 选中文本后触发（over 模式）

## 技术架构

本插件通过以下方式将 Chrome 扩展适配到 ZTools 中：

- **ext-saladic/** - 沙拉查词 v7.19.0 的完整浏览器扩展文件
- **webextensions-emulator-master/** - 模拟 `chrome.*` / `browser.*` API，使扩展在非浏览器环境中运行
- **preload.cjs** - 提供 Node.js 层的 axios HTTP 客户端（带 cookie 管理），解决跨域请求问题

## 致谢

本项目基于以下优秀的开源项目：

- **[Saladict 沙拉查词](https://github.com/crimx/ext-saladict)** — 由 [CRIMX](https://github.com/crimx) 开发的聚合词典浏览器扩展（v7.19.0），提供专业的多词典查词翻译能力
- **[utools-saladict](https://github.com/anrgct/utools-saladict)** — 由 [anrgct](https://github.com/anrgct) 开发的 uTools 版沙拉查词插件，本项目在此基础上进行 ZTools 平台适配
- **[ZTools](https://github.com/nicercode/ztools)** — 桌面效率工具平台，提供插件运行环境

感谢以上项目的作者和贡献者！

## 开源协议

MIT License
