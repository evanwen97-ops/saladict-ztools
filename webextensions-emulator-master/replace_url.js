const replace = require('replace-in-file')
const options = [
  // === runtime.js 路径修复 ===
  // 修复 webpack 公共路径：绝对路径 → 相对路径
  {
    files: '../ext-saladic/assets/runtime*.js',
    from: /n\.p="\/"/g,
    to: 'n.p="./"'
  },
  // v7.21: runtime.js 中 n.p+"assets/" 保留（./assets/xxx.js 是正确的相对路径）
  // v7.19 旧版需要删除 assets/ 前缀，新版不需要

  // === background.js 路径修复 ===
  {
    files: '../ext-saladic/assets/background*.js',
    from: /\/options\.html/g,
    to: 'options.html'
  },

  // === JS 文件中的绝对路径修复 ===
  // antd CSS 加载路径
  {
    files: '../ext-saladic/assets/*.js',
    from: /a="\/assets\/"\+`antd/g,
    to: 'a="./assets/"+`antd'
  },
  // browser.runtime.getURL 中的绝对路径 → 去掉前导 /
  {
    files: '../ext-saladic/assets/*.js',
    from: /browser\.runtime\.getURL\("\/audio-control\.html"/g,
    to: 'browser.runtime.getURL("audio-control.html"'
  },
  // 通用：browser.runtime.getURL("/xxx") → browser.runtime.getURL("xxx")
  {
    files: '../ext-saladic/assets/*.js',
    from: /browser\.runtime\.getURL\("\/([^"]*)"\)/g,
    to: 'browser.runtime.getURL("$1")'
  },

  // === axios 替换 ===
  {
    files: '../ext-saladic/assets/*.js',
    from: /[\w]\(596\)/g,
    to: 'window.axios'
  },
  // responseType:"document" 返回值需要 DOM 解析
  {
    files: '../ext-saladic/assets/*.js',
    from: 'responseType:"document"}).then(({data:e})=>e)',
    to: 'responseType:"document"}).then(({data:e})=>new DOMParser().parseFromString(e,"text/html"))'
  },

  // === 快捷查词配置 ===
  // v7.21 可能不再有 qsAuto，保留容错
  {
    files: '../ext-saladic/assets/*.js',
    from: /qsAuto:!1/g,
    to: 'qsAuto:!0'
  },
  {
    files: '../ext-saladic/assets/*.js',
    from: /qsPreload:"selection"/g,
    to: 'qsPreload:"clipboard"'
  },

  // === HTML 文件路径修复 ===
  // 绝对路径 → 相对路径
  {
    files: '../ext-saladic/*.html',
    from: /src="\//g,
    to: 'src="./'
  },
  {
    files: '../ext-saladic/*.html',
    from: /href="\//g,
    to: 'href="./'
  },
  // browser-polyfill.min.js → webextensions-emulator background.js
  {
    files: '../ext-saladic/*.html',
    from: '<script src="./assets/browser-polyfill.min.js"></script>',
    to:
        '<script src="../webextensions-emulator-master/dist/background.js"></script>'
  },

  // === manifest.json 绝对路径修复 ===
  // content_scripts 和 background.scripts 中的 /assets/ → assets/
  {
    files: '../ext-saladic/manifest.json',
    from: /"\/assets\//g,
    to: '"assets/'
  }
]

function run (options) {
  try {
    const results = replace.sync(options)
    console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
options.forEach((it) => {
  //   it.dry = true
  it.numReplacements = true
  it.numMatches = true
  run(it)
})
