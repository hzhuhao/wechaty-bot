// 消息过滤
const filterList = [
  // 先匹配main，在判断是否包含text
  {
    main: "问题",
    text: ["系统", "电话", "电脑"]
  },
  {
    main: ["电脑", "电话"],
    text: ["打不开"]
  },
  // 只匹配text
  {
    main: "",
    text: ["断网", "蓝屏"]
  }
];

// 消息符合列表返回true
export const filter = (message: string): boolean => {
  for (const word of filterList) {
    const isExist = Array.isArray(word.main)
      ? word.main.some(text => message.includes(text))
      : message.includes(word.main);
    if (isExist) {
      return word.text.some(text => message.includes(text));
    }
  }
  return false;
};
