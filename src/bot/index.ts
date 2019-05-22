import { Wechaty, Message, log, Room } from "wechaty";
import { generate } from "qrcode-terminal";

interface IMessageCb {
  (message: Message): void;
}

interface ILoginCb {
  (): void;
}

class WechatBot {
  readonly instance: Wechaty;
  private readonly onMessageCbList: IMessageCb[] = [];
  private readonly onLoginCbList: ILoginCb[] = [];
  constructor() {
    this.instance = Wechaty.instance();
    // logout,error
    this.instance
      .on("scan", qrcode => {
        generate(qrcode, { small: true });
        console.log("扫描二维码登录");
        console.log(
          [
            "https://api.qrserver.com/v1/create-qr-code/?data=",
            encodeURIComponent(qrcode),
            "&size=220x220&margin=20"
          ].join("")
        );
      })
      .on("logout", user => log.info("BOT", `"${user.name()}" 退出登录`))
      .on("error", e => log.info("BOT", "发生错误: %s", e));
    // onMessage
    this.instance.on("message", message => {
      if (message.self()) return;
      this.onMessageCbList.forEach(cb => cb(message));
    });
  }

  start = () => {
    return new Promise(async resolve => {
      // login
      this.instance.on("login", async user => {
        log.info("BOT", `"${user.name()}" 登录成功`);
        setTimeout(() => {
          this.onLoginCbList.forEach(cb => cb());
          resolve();
        }, 10000);
      });
      await this.instance.start();
    });
  };

  stop = async () => {
    await this.instance.stop();
  };

  onMessage = (cb: IMessageCb) => {
    this.onMessageCbList.push(cb.bind(this));
  };

  onLogin = (cb: ILoginCb) => {
    this.onLoginCbList.push(cb.bind(this));
  };

  getRoom = async (name: string): Promise<Room | void> => {
    const room = await this.instance.Room.find({ topic: name });
    if (!room) {
      log.warn("BOT", "没有找到该房间");
      return;
    }
    return room;
  };

  findRoomAndSay = async (room: string, text: string) => {
    const targetRoom = await this.getRoom(room);
    if (targetRoom) {
      await targetRoom.say(text);
    }
  };
}
export default WechatBot;
