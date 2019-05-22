// 昵称的验证

// 过滤列表
const filterList = ["张净", "朱顺毅", "蒋嘉伦", "高小寓"];

// 验证的正则，有一个不匹配会返回false
const reg = [
  /^\d+(中心(总监|助理)-|-\d+)[\u4e00-\u9fa5]+$/,
  /^([房信]\d+|(房贷|信贷)外勤|(房贷|信贷|直贷)助理|直贷部)-[\u4e00-\u9fa5]+$/,
  /^(门店权证|人事部|行政部|培训部|财务部|技术部|品牌运营部|稽查部|门店)-[\u4e00-\u9fa5]+$/
];

const nameRegex = (name: string | null | undefined) => {
  if (!name) return false;
  if (filterList.some(filterName => name.includes(filterName))) return true;
  return !reg.every(reg => !reg.test(name));
};

export default nameRegex;
