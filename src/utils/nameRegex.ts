// 昵称的验证

// 过滤列表
const filterList = ["刘德华", "周杰伦"];

// 验证的正则，有一个不匹配会返回false
const reg = [/^[\u4e00-\u9fa5]+$/];

const nameRegex = (name: string | null | undefined) => {
  if (!name) return false;
  if (filterList.some(filterName => name.includes(filterName))) return true;
  return !reg.every(reg => !reg.test(name));
};

export default nameRegex;
