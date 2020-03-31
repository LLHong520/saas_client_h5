const showPostBar = {
  showPostBar(id) {
    // 对个别社区不要贴吧
    let comtyId = id;
    let arr = [
      "5cad5f933b3af500087bf8b5",// 正式
      // "5c0489e68a1e0e0008118bf1",// 测试
      // "5c0489e68a1e0e0008118bf1",// 测试
    ];

    return arr.indexOf(comtyId) < 0;
  }
};

export default showPostBar;
