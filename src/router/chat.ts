import Router from "koa-router";
import { wechatBot, WATCHING_ROOM, findContactsFitName } from "../../app";
import nameRegex from "../utils/nameRegex";

const router = new Router();

router.post("/say", async ctx => {
  const body = ctx.request.body;
  const { room = WATCHING_ROOM, text } = body;
  if (text !== undefined) {
    try {
      await wechatBot.findRoomAndSay(room, text);
      ctx.response.body = { state: true };
    } catch (e) {
      console.log("router/chat/say=>", e.message);
      ctx.response.body = {
        state: false,
        message: e.message
      };
    }
  } else
    ctx.response.body = {
      state: false,
      message: "text不能为空"
    };
});

router.post("/name", async ctx => {
  const { name } = ctx.request.body;
  ctx.response.body = nameRegex(name);
});

router.get("/verify", async ctx => {
  try {
    await findContactsFitName();
    ctx.response.body = { state: true };
  } catch (e) {
    ctx.response.body = { state: false, message: e.message };
  }
});

export default router.routes();
