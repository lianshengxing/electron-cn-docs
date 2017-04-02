# `sandbox` 选项

>创建一个渲染器可运行于 Chromium OS 沙盒中的浏览器窗口. 启用此选项后，渲染器必须通过IPC与主进程进行通信才能访问Node API。同时,为了使Chromium OS沙盒可运行,electron 必须使用 `--enable-sandbox`命令行参数运行。

Chromium主要的安全功能之一是所有Blink渲染或JavaScript都运行在沙盒中,该沙盒使用了特定于操作系统的功能以确保渲染器进程不会对系统造成危害.

也就是说,启用沙盒时,渲染器只能通过IPC将任务委托给主进程来对系统进行更改。详情仅参考[chromium沙盒文档](https://www.chromium.org/developers/design-documents/sandbox)      

因为Electron的主要特性是可在渲染器进程中运行node.js(以便使用web技术轻松开发应用),所以Electron默认禁用了沙盒,之所以这样,是因为大多数的node.js API都需要使用系统访问权限,比如 `require()`缺少了系统访问权限则无法使用, 但在沙盒环境中这样做是被禁止的.

 通常,引起这样的情况并不是由于桌面应用程序本身的问题,而是代码之间的可靠和依赖性使Electron在安全性上不如Chromium可显示不受信任的Web内容. 对于需要更安全性的应用程序, `sandbox`会将强制electron使用基础的chromium渲染器以便兼容沙盒.

沙盒渲染器即没有运行node.js环境也不会将node.js的JavaScript API公布到客户端代码中更不会修改任何默认的JavaScript API,但有个例外是预加载脚本可访问Electron渲染器API子集.

综上所述,诸如`window.open`之类的API是和chromium一样的运作方式(即它们不返回 `BrowserWindowProxy`)

## 例子

在`webPreferences`中设置`sandbox：true`即可创建一个沙盒窗口:

```js
let win
app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      sandbox: true
    }
  })
  w.loadURL('http://google.com')
})
```

In the above code the `BrowserWindow` that was created has node.js disabled and can communicate only via IPC. The use of this option stops electron from creating a node.js runtime in the renderer. Also,  within this new window `window.open` follows the native behaviour (by default electron creates a `BrowserWindow` and returns a proxy to this via `window.open`).

It is important to note that this option alone won't enable the OS-enforced sandbox. To enable this feature, the `--enable-sandbox` command-line argument must be passed to electron, which will force `sandbox: true` for all `BrowserWindow` instances.


```js
let win
app.on('ready', () => {
  // no need to pass `sandbox: true` since `--enable-sandbox` was enabled.
  win = new BrowserWindow()
  w.loadURL('http://google.com')
})
```

Note that it is not enough to call `app.commandLine.appendSwitch('--enable-sandbox')`, as electron/node startup code runs after it is possible to make changes to chromium sandbox settings. The switch must be passed to electron on the command-line:

```
electron --enable-sandbox app.js
```

It is not possible to have the OS sandbox active only for some renderers, if `--enable-sandbox` is enabled, normal electron windows cannot be created. If you need to mix sandboxed and non-sandboxed renderers in one application, simply omit the `--enable-sandbox` argument. Without this argument, windows created with `sandbox: true` will still have node.js disabled and communicate only via IPC, which by itself is already a gain from security POV.

## Preload

An app can make customizations to sandboxed renderers using a preload script. Here's an example:

```js
let win
app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      sandbox: true,
      preload: 'preload.js'
    }
  })
  w.loadURL('http://google.com')
})
```

and preload.js:

```js
// This file is loaded whenever a javascript context is created. It runs in a private scope that can access a subset of electron renderer APIs. We must be careful to not leak any objects into the global scope!
const fs = require('fs')
const {ipcRenderer} = require('electron')

// read a configuration file using the `fs` module
const buf = fs.readFileSync('allowed-popup-urls.json')
const allowedUrls = JSON.parse(buf.toString('utf8'))

const defaultWindowOpen = window.open

function customWindowOpen (url, ...args) {
  if (allowedUrls.indexOf(url) === -1) {
    ipcRenderer.sendSync('blocked-popup-notification', location.origin, url)
    return null
  }
  return defaultWindowOpen(url, ...args)
}

window.open = customWindowOpen
```

Important things to notice in the preload script:

- Even though the sandboxed renderer doesn't have node.js running, it still has access to a limited node-like environment: `Buffer`, `process`, `setImmediate` and `require` are available.
- The preload script can indirectly access all APIs from the main process through the `remote` and `ipcRenderer` modules. This is how `fs` (used above) and other modules are implemented: They are proxies to remote counterparts in the main process.
- The preload script must be contained in a single script, but it is possible to have complex preload code composed with multiple modules by using a tool like browserify, as explained below. In fact, browserify is already used by electron to provide a node-like environment to the preload script.

To create a browserify bundle and use it as a preload script, something like the following should be used:

    browserify preload/index.js \
      -x electron \
      -x fs \
      --insert-global-vars=__filename,__dirname -o preload.js

The `-x` flag should be used with any required module that is already exposed in the preload scope, and tells browserify to use the enclosing `require` function for it. `--insert-global-vars` will ensure that `process`, `Buffer` and `setImmediate` are also taken from the enclosing scope(normally browserify injects code for those).

Currently the `require` function provided in the preload scope exposes the following modules:

- `child_process`
- `electron` (crashReporter, remote and ipcRenderer)
- `fs`
- `os`
- `timers`
- `url`

More may be added as needed to expose more electron APIs in the sandbox, but any module in the main process can already be used through
`electron.remote.require`.

## Status

Please use the `sandbox` option with care, as it is still an experimental feature. We are still not aware of the security implications of exposing some electron renderer APIs to the preload script, but here are some things to consider before rendering untrusted content:

- A preload script can accidentaly leak privileged APIs to untrusted code.
- Some bug in V8 engine may allow malicious code to access the renderer preload APIs, effectively granting full access to the system through the `remote` module.

Since rendering untrusted content in electron is still uncharted territory, the APIs exposed to the sandbox preload script should be considered more unstable than the rest of electron APIs, and may have breaking changes to fix security issues.

One planned enhancement that should greatly increase security is to block IPC messages from sandboxed renderers by default, allowing the main process to explicitly define a set of messages the renderer is allowed to send.
