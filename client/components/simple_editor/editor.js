function vEditor(el, options) {
  this.editor = null;
  this.needsClicked = false;
  this.lastSelection = null;
  this.lastEditRange = null;
  this.__init(el, options);
}

/**
 * 编辑器初始化
 * @param  {[type]} selector 编辑器的domid
 */
vEditor.prototype.__init = function (selector, options) {
  var This = this;
  if (options) {
    this.instance = options.instance;
  }
  this.selector = selector;
  this.editor = selector;
  this.editor.style.minHeight = "200px";
  this.editor.style.padding = "0px";
  this.editor.setAttribute("contenteditable", true);
  This.__init_content();

  //键盘弹起就记录当前的光标位置
  this.addEvent(this.editor, "keydown", function (e) {
    var ev = window.event || e;
    //保存光标位置
    This.saveLastEditRange();

    if (ev.keyCode === 13) {
      //给所有的元素添加 needsclick 样式 避免被 fastclick 处理
      for (var i = 0; i < This.editor.childNodes.length; i++) {
        var el = This.editor.childNodes[i];
        if (!/needsclick/.test(el.className)) {
          This.editor.childNodes[i].className += " needsclick";
        }
      }
      This.saveLastEditRange();
    }
    if (ev.keyCode === 8) {
      // console.log("点击了删除按钮");
    }
  });

  /**
   * 编辑器被点击则记录光标位置
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  this.addEvent(this.editor, "click", function (e) {
    This.saveLastEditRange();
  });
  this.addEvent(this.editor, "DOMSubtreeModified", function (e) {
    This.__init_content();
  });
};
/**
 * 编辑器初始化
 * @param  {[type]} selector 编辑器的domid
 */
vEditor.prototype.__init_content = function (selector, options) {
  //给所有的元素添加 needsclick 样式 避免被 fastclick 处理
  if (!this.needsClicked) {
    console.log("初始化needsclick");
    var children = this.editor.querySelectorAll("*");
    console.log(children.length);
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (!/needsclick/.test(el.className)) {
        el.className += " needsclick";
      }
    }
    var This = this;
    setTimeout(() => {
      var editorImgs = This.editor.querySelectorAll(".editor-img");
      console.log("editorImgs");
      console.log(editorImgs);

      for (var i = 0; i < editorImgs.length; i++) {
        var imgWrapper = editorImgs[i];
        var imgNode = editorImgs[i].querySelectorAll("img")[0];
        var delDom = editorImgs[i].querySelectorAll(".del-icon")[0];
        var scaleDom = editorImgs[i].querySelectorAll(".scale-icon")[0];
        imgNode.onclick = function () {
          if (this.className == "showing") {
            this.className = "";
            this.parentNode.style.width = "100px";
          } else {
            this.className = "showing";
            this.parentNode.style.width = "100%";
          }
        };

        This.addEvent(delDom, "click", function (e) {
          imgWrapper.parentNode.removeChild(imgWrapper);
          //回調刪除圖片 通知客戶端
          This.instance.imgDelCall(imgWrapper.picId);
        });
        This.addEvent(scaleDom, "click", function (e) {
          if (this.nextSibling.className == "showing") {
            this.nextSibling.className = "";
            this.parentNode.style.width = "100px";
          } else {
            this.nextSibling.className = "showing";
            this.parentNode.style.width = "100%";
          }
        });
      }
    }, 500);
    this.needsClicked = true;
  }
};

//
/**
 * 获取编辑器文本内容
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
vEditor.prototype.getContent = function () {
  return this.trim(this.editor.textContent);
};
/**
 * 设置编辑器html内容
 * @param  {[text]} html [description]
 * @return {[type]}          [description]
 */
vEditor.prototype.setContent = function (html) {
  return this.editor.innerHTML = this.trim(html);
};
/**
 * 获取编辑器html内容
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
vEditor.prototype.getHtml = function () {
  return this.trim(this.editor.innerHTML.replace("<!---->", ""));
};
/**
 * 编辑器获取元素用id
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
vEditor.prototype.getById = function (selector) {
  return document.getElementById(selector);
};
/**
 * 编辑器获取html内图片数量
 */
vEditor.prototype.getImgNum = function () {
  var num = this.editor.querySelectorAll("img").length;
  return num;
};

/**
 * 存储光标位置
 */
vEditor.prototype.saveLastEditRange = function () {
  // 获取选定对象
  var selection = window.getSelection();
  console.log("===================");
  console.log(selection);
  console.log(selection.rangeCount);
  console.log("===================");
  // 设置最后光标对象
  if (selection.rangeCount > 0) {
    this.lastSelection = selection;
    this.lastEditRange = selection.getRangeAt(0);
  }
};
/**
 * 图片上传完成后更新图片的链接
 */
vEditor.prototype.updateImgUrl = function (imgObj) {
  // var editor = this.editor;
  document.getElementById(imgObj.id).src = imgObj.url;
};
/**
 * 编辑器插入图片到尾部
 * @param  {[type]} imgUrl 图片的链接地址
 */
vEditor.prototype.appendImg = function (imgObj) {
  console.log("插入图片");

  //if(!this.lastEditRange) return;
  var imgWrapper = document.createElement("div");
  imgWrapper.setAttribute("contenteditable", "false");
  imgWrapper.className = "editor-img needsclick";
  imgWrapper.picId = imgObj.id;
  console.log(imgWrapper.picId);
  var imgNode = document.createElement("img");
  imgNode.id = imgObj.id;
  imgNode.src = imgObj.url;
  imgNode.style.verticalAlign = "bottom";
  // imgNode.style.float="left";
  /**点击放大和缩小图片**/
  imgNode.onclick = function () {
    if (this.className == "showing") {
      this.className = "";
      this.parentNode.style.width = "100px";
    } else {
      this.className = "showing";
      this.parentNode.style.width = "100%";
    }
  };
  this.initImgNode(imgWrapper);
  imgWrapper.appendChild(imgNode);
  console.log("已生成节点，判断焦点并插入");

  if (this.lastEditRange) {
    console.log("有焦点");
    //是否父亲节点是跟节点
    try {
      // alert(this.lastSelection);
      // alert(this.lastSelection.anchorNode);
      console.log(this.lastSelection);
      console.log(this.lastSelection.anchorNode);
      var curNode = this.lastSelection.anchorNode;
      //当前节点就是编辑器节点
      if (/simple_editor/.test(curNode.className)) {
        console.log("当前节点直接插入");
        this.editor.appendChild(imgWrapper);
        this.insertEmptyNode();
        return;
      }
      var parentNode = curNode.parentNode;
      if (/simple_editor/.test(parentNode.className)) {
        //当前节点为编辑器节点的子节点
        console.log("父亲节点为编辑器节点");
        if (curNode.nextSibling) {
          parentNode.insertBefore(imgWrapper, curNode.nextSibling);
        } else {
          this.editor.appendChild(imgWrapper);
        }
      } else {
        console.log("父亲节点为编辑器内节点");
        // console.log(parentNode);
        var isIN = /simple_editor/.test(parentNode.className) >= 0 ? true : false;
        console.log("isIN");
        console.log(isIN);
        if (isIN) {
          if (parentNode.nextSibling) {
            parentNode.parentNode.insertBefore(imgWrapper, parentNode.nextSibling);
          } else {
            this.editor.appendChild(imgWrapper);
          }
        } else {
          this.editor.appendChild(imgWrapper);
        }
      }
    } catch (error) {
      console.log("++++++++++error++++++++++++");
      console.log(error);
      console.log("++++++++++error++++++++++++");
      this.editor.appendChild(imgWrapper);
    }

  } else {
    console.log("无焦点");
    this.editor.appendChild(imgWrapper);
  }
  this.insertEmptyNode();
};
/**
 * 初始化圖片元素節點
 * @type {[type]}
 */
vEditor.prototype.initImgNode = function (imgWrapper) {
  var delDom = document.createElement("span");
  delDom.className = "del-icon";
  delDom.textContent = "";
  var This = this;
  this.addEvent(delDom, "click", function (e) {
    imgWrapper.parentNode.removeChild(imgWrapper);
    //回調刪除圖片 通知客戶端
    This.instance.imgDelCall(imgWrapper.picId);
  });
  imgWrapper.appendChild(delDom);
  var scaleDom = document.createElement("span");
  scaleDom.className = "scale-icon";
  scaleDom.textContent = "";
  scaleDom.onclick = function () {
    if (this.nextSibling.className == "showing") {
      this.nextSibling.className = "";
      this.parentNode.style.width = "100px";
    } else {
      this.nextSibling.className = "showing";
      this.parentNode.style.width = "100%";
    }
  };
  imgWrapper.appendChild(scaleDom);
};
/**
 * 插入空节点并设置光标聚焦节点
 */
vEditor.prototype.insertEmptyNode = function () {
  console.log("insertEmptyNode");

  var newEmptyNode = document.createElement("div");
  newEmptyNode.className = "needsclick";
  newEmptyNode.innerHTML = ".";
  newEmptyNode.style.minHeight = "10px";
  this.editor.appendChild(newEmptyNode);
  //光标聚集到当前的空节点
  var selection = window.getSelection();
  var range = document.createRange();
  range.selectNodeContents(newEmptyNode);
  range.setStart(newEmptyNode, newEmptyNode.textContent.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * 光标所在位置插入文本
 */
vEditor.prototype.appendTextNode = function (newText) {
  //编辑框获取焦点
  this.editor.focus();
  // 获取选定对象
  var selection = window.getSelection();
  // 判断是否有最后光标对象存在
  if (this.lastEditRange) {
    // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
    selection.removeAllRanges();
    selection.addRange(this.lastEditRange);

    //========插入图片
    // 判断选定对象范围是编辑框还是文本节点
    if (selection.anchorNode.nodeName != "#text") {
      // console.log("非文本节点");
      //如果是编辑框范围。则创建表情文本节点进行插入
      var emojiText = document.createTextNode(emojiInput.textContent);
      var rageNode = selection.anchorNode;

      if (rageNode.childNodes.length > 0) {
        // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
        for (var i = 0; i < rageNode.childNodes.length; i++) {
          if (i == selection.anchorOffset) {
            rageNode.insertBefore(emojiText, rageNode.childNodes[i]);
          }
        }
      } else {
        // 否则直接插入一个表情元素
        this.editor.appendChild(emojiText);
      }
      // 创建新的光标对象
      var range = document.createRange();
      // 光标对象的范围界定为新建的表情节点
      range.selectNodeContents(emojiText);
      // 光标位置定位在表情节点的最大长度
      range.setStart(emojiText, emojiText.length);
      // 使光标开始和光标结束重叠
      range.collapse(true);
      // 清除选定对象的所有光标对象
      selection.removeAllRanges();
      // 插入新的光标对象
      selection.addRange(range);
    } else {
      // console.log("文本节点");
      // 如果是文本节点则先获取光标对象
      var range = selection.getRangeAt(0);
      // 获取光标对象的范围界定对象，一般就是textNode对象
      var textNode = range.startContainer;
      // 获取光标位置
      var rangeStartOffset = range.startOffset;
      // 文本节点在光标位置处插入新的表情内容
      textNode.insertData(rangeStartOffset, emojiInput.textContent);
      // 光标移动到到原来的位置加上新内容的长度
      range.setStart(textNode, rangeStartOffset + emojiInput.textContent.length);
      // 光标开始和光标结束重叠
      range.collapse(true);
      // 清除选定对象的所有光标对象
      selection.removeAllRanges();
      // 插入新的光标对象
      selection.addRange(range);
    }
    // 无论如何都要记录最后光标对象
    this.lastEditRange = selection.getRangeAt(0);
    //=============end
  } else {
    // console.log("no lastEditRange");
  }
};

/**
 * 元素添加事件
 * @param  {[type]}   obj 要添加事件的对象
 * @param  {[type]}   ev  事件名字
 * @param  {Function} fn  事件处理函数
 */
vEditor.prototype.addEvent = function (obj, ev, fn) {
  if (obj.attachEvent) {
    //针对IE浏览器
    obj.attachEvent("on" + ev, fn);
  } else {
    //针对FF与chrome
    obj.addEventListener(ev, fn, false);
  }
};

/**
 * 清除文本前后的空格
 * @param  {[type]} str 要处理的文本
 */
vEditor.prototype.trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 * 光标移动到输入框的最后
 * @return {[type]} [description]
 */
vEditor.prototype.moveRangeToEnd = function () {
  var obj = this.editor;
  if (window.getSelection) { //ie11 10 9 ff safari
    obj.focus(); //解决ff不获取焦点无法定位问题
    var range = window.getSelection(); //创建range
    range.selectAllChildren(obj); //range 选择obj下所有子内容
    range.collapseToEnd(); //光标移至最后
  } else if (document.selection) { //ie10 9 8 7 6 5
    var range = document.selection.createRange(); //创建选择对象
    //var range = document.body.createTextRange();
    range.moveToElementText(obj); //range定位到obj
    range.collapse(false); //光标移至最后
    range.select();
  }
};


export default vEditor;
