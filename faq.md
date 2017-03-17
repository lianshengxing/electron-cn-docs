废弃了官方的faq.md ,直接集合了各种常见方法,适用于初学者和懒癌;
* asar文件常用命令,所在目录运行以下命令:
```
安装:$ npm install asar -g
压缩:$ asar pack app app.asar
解压:$ asar extract app.asar testpath
```

* 与Jquery等第三方js插件的兼容相关
```
<script src=`jquery.min.js`></script>
<script>if (typeof module === 'object') {window.jQuery = window.$ = module.exports;};</script>
```