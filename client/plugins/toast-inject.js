function init() {
  var sTipHtml = (function () {
    var html = "<!--提示 start-->";
    html += "<div class=\"tips_mod\" style=\"display:none; z-index:10000;\">";
    html += "<div class=\"tips_txt tips_sty1\">";
    html += "<b></b><p></p><span></span>";
    html += "</div>";
    html += "</div>";
    html += "<!--提示 end-->";
    return html;
  })();

  var oTipDom = $(".tips_mod");
  if (oTipDom.length == 0) {
    $("body").eq(0).append(sTipHtml);
  }
}
const toast = {
  delay: 2000,
  tip: function (tit, msg) {
    init();
    var oTipDom = $(".tips_mod").eq(0);
    oTipDom.focus();
    if (this.timer) clearTimeout(this.timer);
    oTipDom.blur(function () {
      clearTimeout(this.timer);
      oTipDom.hide();
    });
    oTipDom.find("b").text(tit);
    oTipDom.find("p").text(msg);

    oTipDom.show();
    this.timer = setTimeout(function () {
      oTipDom.hide();
    }, this.delay);
  }
};

export default ({ app }, inject) => {
  // Set the function directly on the context.app object
  app.toast = (string,msg) => {
    toast.tip(string,msg);
  };
};
