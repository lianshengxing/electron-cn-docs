//## 定义
const {app, BrowserWindow, ipcMain,Tray,Menu} = require('electron')

//## 防止被垃圾回收
let onlineStatusWindow,tray


//## 未登录前创建离线图标


//## ready
app.on('ready', () => {
//隐藏窗口载入渲染进程,以便获取通信状态
  onlineStatusWindow = new BrowserWindow({ width: 0, height: 0, show: false })
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`)
})


//## 登录后创建在线图标



//## 监听网络
ipcMain.on('online-status-changed', (event, status) => {
  console.log(status)
})