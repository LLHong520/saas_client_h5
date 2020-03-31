function rand(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}

function getAvater() {
  var avaters = [
    "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3797481993,1929347741&fm=27&gp=0.jpg",
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541142108612&di=12f9cd1bcd2a8cdd9ac1c9f3cbf94902&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201411%2F09%2F20141109142633_ncKBY.thumb.700_0.jpeg",
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541142108611&di=6632000904dde657612990fb7bc125e8&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8c1001e93901213fce85790251e736d12e2e95bd.jpg",
    "http://img4.imgtn.bdimg.com/it/u=74334139,1293978723&fm=26&gp=0.jpg",
    "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3197537752,2095789724&fm=27&gp=0.jpg",
  ];
  return avaters[rand(0, 4)];
}

function getName() {
  var names = [
    "张三",
    "李四",
    "王五",
    "唐三藏",
    "孙悟空",
    "猪八戒",
    "观音菩萨"
  ];
  return names[rand(0, 6)];
}

function getTagType() {
  var names = [
    "反动",
    "危险",
    "伤害",
    "侵犯版权",
    "不利于大众",
    "有毒",
    "不好"
  ];
  return names[rand(0, 6)];
}

function getStatus() {
  var names = [
    "true",
    "false"
  ];
  return names[rand(0, 1)];
}

function getDocId() {
  var ids = [40, 139, 217, 63, 203, 68, 62, 162];
  return ids[this.rand(0, 7)];
}

function getDocDepart() {
  var departs = [
    "外科",
    "内科",
    "妇产科",
    "皮肤性病科",
    "口腔科",
    "中医科",
    "儿科"
  ];
  return departs[rand(0, 6)];
}
function getDocHospital() {
  var hospitals = [
    "深圳市南山医院",
    "华中科技大学附属协和医院",
    "首都医科大学附属北京中医医院",
    "复旦大学附属中山医院",
    "中江县人民医院",
    "福建医科大学附一闽南医院",
  ];
  return hospitals[rand(0, 5)];
}
function getDocTitle() {
  var titles = [
    "主任医师",
    "副主任医师",
    "主治医师",
    "住院医师",
    "助理医师",
  ];
  return titles[rand(0, 4)];
}

module.exports = {
  getTagType,
  getStatus,
  getName,
  getAvater,
  rand,
  getDocId,
  getDocDepart,
  getDocHospital,
  getDocTitle
};
