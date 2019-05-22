import fs from "fs";
import path from "path";
import dayjs from "dayjs";

const writeLog = (text: string) => {
  const time = dayjs().format("YYYY-MM-DD");
  const targetPath = path.resolve(__dirname, `../../log/${time}.log`);
  return new Promise((resolve, reject) => {
    fs.writeFile(targetPath, text + "\n", { flag: "a" }, err => {
      if (err) {
        reject();
        throw new Error(err.message);
      }
      resolve();
    });
  });
};

export default writeLog;
