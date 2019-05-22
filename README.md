# Wechaty-bot

在[wechaty](https://github.com/Chatie/wechaty)基础上进行简单封装的简易微信群管理助手，实例支持添加多个`onMessage`事件和`onLogin`事件

## 现有功能

1. 根据指定条件判断是否需要回复内容
2. 新人入群欢迎
3. 群昵称规范
4. koa 提供接口调用

##.env 文件
WATCHINGROOM=监测的群名

SERVER=是否开启 koa

PORT=端口

## WechatBot 实例

`src/bot/index.ts`

提供方法：

1. `start()`
2. `stop()`
3. `onMessage(/*message=>void*/)`
4. `onLogin(/*()=>void*/)`
5. `getRoom(name:string)` 获取群昵称的 room 实例
6. `findRoomAndSay({name:string,text:string})` 寻找群实例并发言

其中`onMessage`和`onLogin`可以多次添加事件

## koa接口

1. `POST /chat/say body:{name:string,text:string}` 指定群发言
2. `GET /chat/verify` 验证群昵称
