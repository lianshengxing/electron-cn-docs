## 前言:
本翻译均为本人逐字逐句的精心校对翻译,并进行了重新排版,当用途或属性及触发说明结尾有括号时即返回的类型.
本次与官方文档实时更新时间:2017-03-12
水平有限,不当之处,欢迎指正.

## 初学者入门指导(Win为例):

* 1.设置环境变量:
```
方法:计算机右键-属性-高级系统设置-环境变量-新建
变量名:ELECTRON_MIRROR,变量值:http://npm.taobao.org/mirrors/electron/
```

* 2.[Node.js安装](https://nodejs.org/en/download/)
* 3.[git安装](https://git-for-windows.github.io/)
* 4.[Electron安装](http://electron.atom.io/)


下文的安装方法适合WIN小白用户,其他系统请参考上行链接所在页面

安装electron:

运行cmd,cd c:/或者在指定文件夹(本文假定为c:/)安装shift右键在此处打开命令

```
如electron官网所示,依次贴入以下三行代码:
git clone https://github.com/electron/electron-quick-start
cd electron-quick-start
npm install && npm start
安装好了之后,你可以用c:/electron-quick-start/>electron .(空格点号别忘了)
如果打开了个hello world窗口就是成功了
```
## WIN小秘诀:
有时,我们需要不断更改代码并预览应用,那么您仅需在项目文件夹如c:/electron-quick-start/
中创建.cmd格式文档,内容为:

```
electron .
```
这样每次双击即可弹出应用.
在默认demo中文件很多,但你只需要package.json,main.js,index.html,node_modules即可.


## 常见:

提交issue前,请详读以下常见问题:
* [Electron 常见问题](faq.md)        

## 特别注意:

* 与Jquery等第三方js插件的兼容相关
```
<script src=`jquery.min.js`></script>
<script>if (typeof module === 'object') {window.jQuery = window.$ = module.exports;};</script>
```

## API接口目录:

* [快捷键字符串](accelerator.md)
* [整体控制](app.md)
* [自动更新](auto-updater.md)
* [窗口](browser-window.md)
* [子窗口](browser-window-proxy.md)
* [命令行](chrome-command-line-switches.md)
* [客户端请求](client-request.md)
* [剪贴板](clipboard.md)
* [性能数据收集](content-tracing.md)
* [会话](cookies.md)
* [奔溃报告](crash-reporter.md)
* [调试工具](debugger.md)
* [捕获桌面资源](desktop-capturer.md)
* [对话框](dialog.md)
* [下载项管理](download-item.md)
* [环境变量](environment-variables.md)
* [文件操作](file-object.md)
* [无框窗口](frameless-window.md)
* [全局快捷键](global-shortcut.md)
* [HTTP/HTTPS请求处理](incoming-message.md)
* [从主进程到渲染进程的异步通信](ipc-main.md)
* [从渲染进程到主进程的异步通信](ipc-renderer.md)
* [应用语言](locales.md)
* [菜单](menu.md)
* [菜单项](menu-item.md)
* [图标创建与应用](native-image.md)
* [Chromium原生网络库](net.md)
* [电源状态](power-monitor.md)
* [节能管理](power-save-blocker.md)
* [进程控制](process.md)
* [协议的注册和处理](protocol.md)
* [渲染进程与主进程通信](remote.md)
* [屏幕](screen.md)
* [会话,缓存和代理等控制](session.md)
* [使用系统默认应用程序管理文件或URL](shell.md)
* [开发概要](synopsis.md)
* [获取系统首选项](system-preferences.md)
* [TouchBar触摸条](touch-bar.md)
* [TouchBar触摸条按钮](touch-bar-button.md)
* [TouchBar触摸条拾色器](touch-bar-color-picker.md)
* [TouchBar触摸条分组](touch-bar-group.md)
* [TouchBar触摸条label标签](touch-bar-label.md)
* [TouchBar触摸条弹出框](touch-bar-popover.md)
* [TouchBar触摸条滑块](touch-bar-slider.md)
* [TouchBar触摸条间隔符](touch-bar-spacer.md)
* [系统托盘](tray.md)
* [网页内容](web-contents.md)
* [页面渲染](web-frame.md)
* [页面请求](web-request.md)
* [页面标签](webview-tag.md)
* [打开新窗口或打开时传递消息](window-open.md)










