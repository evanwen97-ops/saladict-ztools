# saladict-ztools

> 沙拉查词 - 聚合词典专业查词翻译（ZTools 版）

**作者：EvanW** ([evanwen97-ops](https://github.com/evanwen97-ops))

这是沙拉查词（Saladict）的 ZTools 适配版。项目的核心思路是：

1. 将 Saladict 的前端扩展页面直接作为插件主体运行；
2. 用 `webextensions-emulator-master` 模拟 `browser.*` / `chrome.*` API；
3. 通过 `preload.cjs` 补足 ZTools 环境下的 Node.js 能力与网络能力；
4. 让用户可以在 ZTools 中直接使用沙拉查词的查词、历史、生词本等能力。

## 项目架构

```text
.
├── index.html                    # ZTools 运行入口，负责加载模拟器和插件主逻辑
├── plugin.json                   # ZTools 插件元数据、入口、作者与触发配置
├── preload.cjs                   # Electron preload 注入脚本，提供 axios、cookie、外部链接能力
├── preload/
│   ├── services.js               # 注入到页面的工具服务（读写文件等）
│   └── package.json              # 标记 preload 目录的模块类型
├── ext-saladic/                  # Saladict 原始扩展内容
│   ├── manifest.json             # 扩展清单
│   ├── *.html                    # quick-search / notebook / history / options / word-editor 等页面
│   ├── assets/                   # 扩展打包后的 JS/CSS/图片资源
│   ├── _locales/                 # 国际化文案
│   └── _metadata/                # 扩展元数据
└── webextensions-emulator-master/ # WebExtensions 模拟器子工程
    ├── lib/                      # 模拟器源码
    └── dist/                     # 由该子工程构建出来的运行产物
```

### 各目录职责

- **`index.html`**
  - ZTools 插件真正加载的页面入口。
  - 它只负责载入 `webextensions-emulator-master/dist/core.js`，再由模拟器启动 Saladict。

- **`plugin.json`**
  - ZTools 插件描述文件。
  - 定义插件名称、标题、作者、版本、主入口和触发方式。

- **`preload.cjs`**
  - 在 Electron 渲染进程中注入 `window.axios`、`window.tough`、`window.openExternal` 等能力。
  - 负责处理 Saladict 在 ZTools 环境里依赖的网络请求、Cookie 与外部链接打开。

- **`preload/`**
  - 放置更小的辅助服务脚本。
  - 当前主要用于把文件读写等能力挂到 `window.services` 上，方便页面侧调用。

- **`ext-saladic/`**
  - Saladict 本体资源目录。
  - 这里包含扩展页面、脚本、样式、图片、词库面板、生词本、历史记录、设置页等全部静态资源。

- **`webextensions-emulator-master/`**
  - WebExtensions API 模拟器。
  - 它负责把 `browser.runtime`、`browser.tabs`、`browser.windows`、`browser.storage` 等浏览器扩展接口映射到 ZTools 能运行的环境中。

## 为什么 `dist` 在 `webextensions-emulator-master/` 里

`dist` 不在项目根目录下，是因为它不是主项目单独编译出来的公共产物，而是 **`webextensions-emulator-master` 这个子工程自身的构建输出**。

这个子工程的 `webpack.config.js` 里明确把输出路径写成了：

```js
output: {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist')
}
```

因此：

- 构建时产物会直接输出到 `webextensions-emulator-master/dist/`
- 根目录的 `index.html` 也是直接引用这个路径：
  - `webextensions-emulator-master/dist/core.js`
  - `webextensions-emulator-master/dist/background.js`

这是一种“子工程内构建、主工程引用”的结构，便于把模拟器源码与 Saladict 主体资源隔离管理。

## 安装与启动

### 1. 安装依赖

在项目根目录执行：

```bash
npm install
```

如果你使用的是 pnpm，也可以：

```bash
pnpm install
```

### 2. 构建模拟器

进入 `webextensions-emulator-master` 目录后执行：

```bash
npm run build
```

构建完成后会生成：

- `webextensions-emulator-master/dist/core.js`
- `webextensions-emulator-master/dist/background.js`

### 3. 启动 ZTools 插件

把整个 `ztools-saladic` 目录放到 ZTools 的插件目录后：

1. 重启 ZTools，或刷新插件列表
2. 输入「沙拉查词」或「saladict」触发插件
3. 也可以通过划词触发 `over` 模式

## 配置说明

### `plugin.json`

- `main: "index.html"`：ZTools 的入口页面
- `preload: "preload.cjs"`：渲染进程预加载脚本
- `features`：定义关键词触发与划词触发方式

### 资源加载关系

启动链路为：

```text
ZTools -> index.html -> webextensions-emulator-master/dist/core.js -> 加载 Saladict 页面
```

Saladict 页面再通过模拟器调用 `browser.runtime`、`browser.tabs`、`browser.windows` 等接口，从而实现原始浏览器扩展的运行效果。

## 资源清理说明

- 根目录 `logo.png` 当前未被 `plugin.json` 或运行代码引用。
- 插件实际图标使用的是 `ext-saladic/assets/icon-128.png`。
- 因此 `logo.png` 属于可删除的冗余资源。

## 致谢

本项目基于以下优秀的开源项目：

- **[Saladict 沙拉查词](https://github.com/crimx/ext-saladict)** — 由 [CRIMX](https://github.com/crimx) 开发的聚合词典浏览器扩展（v7.19.0）
- **[utools-saladict](https://github.com/anrgct/utools-saladict)** — uTools 版沙拉查词插件，为本项目的 ZTools 适配提供了参考
- **[ZTools](https://github.com/ZToolsCenter/ZTools)** — 桌面效率工具平台

感谢以上项目的作者和贡献者！

## 开源协议

MIT License
