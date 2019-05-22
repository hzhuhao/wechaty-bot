import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";

import chat from "./router/chat";

const app = new Koa();
const router = new Router();

router.use("/chat", chat);

app
  .use(bodyParser())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
