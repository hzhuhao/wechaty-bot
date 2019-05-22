// 消息过滤
const filterList = [
  {
    main: "问题",
    text: ["系统", "电话", "电脑", "合同", "订单", "单子", "网管"]
  },
  {
    main: ["电话", "电脑"],
    text: ["打不起", "卡", "死机", "坏", "出大事"]
  },
  {
    main: "用不起",
    text: ["键盘", "鼠标", "耳机"]
  },
  {
    main: "系统",
    text: [
      "没得网",
      "没有网",
      "没的网",
      "断网",
      "卡",
      "慢",
      "出大事",
      "不得行",
      "不行",
      "崩",
      "转圈",
      "错误",
      "登不上去",
      "打不开",
      "有病",
      "点不开",
      "瘫痪",
      "用不起"
    ]
  },
  {
    main: "",
    text: ["开不了机", "没网", "没有网", "上不起网", "上不了网", "断网", "蓝屏"]
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
