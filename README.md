## 前言:

本文采用官方electron翻译并提供相关教程与资源,较之官译本更加精简和本土化.

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

## 指南:

本文对应的是docs中的api文档全部翻译或精校,最后的版本时间为:2017-03-06.