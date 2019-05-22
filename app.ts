import dotenv from "dotenv";
import { filter } from "./src/utils/messageFilter";
import { Contact, Message, Room } from "wechaty";
import WechatBot from "./src/bot";

import app from "./src/server";
import writeLog from "./src/utils/writeLog";
import nameRegex from "./src/utils/nameRegex";

dotenv.config();

// bot
const wechatBot = new WechatBot();

// 监听放假
const WATCHING_ROOM = process.env.WATHINGROOM || "测试";
// koa服务
const SERVER = process.env.SERVER || false;
// 端口号
const PROT = process.env.port || 3000;

// 接收消息回调
const onMessage = async (message: Message) => {
  const contact = message.from();
  const text = message.text();
  const room = message.room();
  if (!contact) return new Error("contact is undefined");
  // 如果消息来自房间
  if (room) {
    // 获取房间名
    const topic = await room.topic();
    if (topic !== WATCHING_ROOM) return;
    const msg = `群聊:${topic}-><${contact.name()}>说:${text}`;
    console.log(msg);
    writeLog(msg).catch(e => console.log(e));
    const issue = filter(text);
    if (issue) {
      await room.say("有问题吗?", contact);
      // const file = FileBox.fromFile("./src/test.zip");
      // await room.say(file);
    }
  } else {
    // 消息来自其他（公众号也算）
    // await contact.say("回复");
  }
};

// 寻找指定群聊，当有新成员加入的时候
const onRoomJoin = async function(this: WechatBot) {
  const room = await this.getRoom(WATCHING_ROOM);
  if (room) {
    room.on("join", async function(this: Room, inviteeList: Contact[]) {
      await this.sync();
      const topic = await this.topic();
      console.log(
        `群聊:${topic}-><${inviteeList
          .map(contact => contact.name())
          .join(",")}>加入房间`
      );
      await this.say(`欢迎${inviteeList.map(contact => "@" + contact.name())}`);
    });
  }
};

interface IcontactList {
  name: string;
  isFit: boolean;
}

// 验证群昵称
const findContactsFitName = async (roomName = WATCHING_ROOM) => {
  const room = await wechatBot.getRoom(roomName);
  if (room) {
    await room.sync();
    const contactList: Promise<IcontactList>[] = (await room.memberAll())
      .filter(contact => !contact.self())
      .map(contact => {
        const temp: IcontactList = {
          name: contact.name(),
          isFit: false
        };
        return new Promise(async resolve => {
          const alias = await room.alias(contact);
          if (alias) temp.name = alias;
          temp.isFit = nameRegex(temp.name);
          resolve(temp);
        });
      });
    try {
      const fitList = await Promise.all(contactList);
      const msg =
        fitList
          .filter(contact => !contact.isFit)
          .map(contact => `@${contact.name}`)
          .join("、") + " 群名片名称不符合规范，请及时修改~";
      await room.say(msg);
    } catch (e) {
      console.log("findContactsFitName=>:" + e.message);
    }
  }
};

// 但有人@机器人的时候
const onAt = async (message: Message) => {
  const contact = message.from();
  const text = message.text();
  const room = message.room();
  if (!contact) return new Error("contact is undefined");
  if (room) {
    const topic = await room.topic();
    if (topic !== WATCHING_ROOM) return;
    if (text.includes("@机器人")) {
      await room.say("干啥", contact);
    }
  }
};

const run = async () => {
  wechatBot.onMessage(onMessage);
  wechatBot.onMessage(onAt);
  wechatBot.onMessage(async message => {
    const text = message.text();
    const room = message.room();
    if (room) {
      // 获取房间名
      const topic = await room.topic();
      if (topic !== WATCHING_ROOM) return;
      if (text.includes("验证")) {
        await findContactsFitName();
      }
    }
  });
  wechatBot.onLogin(onRoomJoin);
  if (SERVER) await app.listen(PROT);
  await wechatBot.start();
};

run();

export { wechatBot, WATCHING_ROOM, findContactsFitName };
