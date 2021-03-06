/**
 * 百度开源库： http://lbsyun.baidu.com/index.php?title=jspopular3.0/openlibrary
 *
 * 注：js经过修改，减少了百度marker的dom渲染提高了页面速度，
 * 但有个问题就是，会有内存溢出 和 事件没有回收，
 * 尽量限制5000个以内吧。
 * 来源： http://api.map.baidu.com/library/MarkerClusterer/1.2/docs/help.html
 *
 * 如果渲染大数据之类的，10万以内的，建议使用mapv
 * 地址：https://mapv.baidu.com/gallery.html
 * */

/* eslint-disable */
// require("./TextIconOverlay_min.js");
/* eslint-disable */
var BMapLib=window.BMapLib=BMapLib||{};(function(){var d,c=d=c||{version:"1.3.8"};(function(){c.guid="$BAIDU$";window[c.guid]=window[c.guid]||{};c.dom=c.dom||{};c.dom.g=function(f){if("string"==typeof f||f instanceof String){return document.getElementById(f)}else{if(f&&f.nodeName&&(f.nodeType==1||f.nodeType==9)){return f}}return null};c.g=c.G=c.dom.g;c.dom.getDocument=function(f){f=c.dom.g(f);return f.nodeType==9?f:f.ownerDocument||f.document};c.lang=c.lang||{};c.lang.isString=function(f){return"[object String]"==Object.prototype.toString.call(f)};c.isString=c.lang.isString;c.dom._g=function(f){if(c.lang.isString(f)){return document.getElementById(f)}return f};c._g=c.dom._g;c.browser=c.browser||{};if(/msie (\d+\.\d)/i.test(navigator.userAgent)){c.browser.ie=c.ie=document.documentMode||+RegExp["\x241"]}c.dom.getComputedStyle=function(g,f){g=c.dom._g(g);var i=c.dom.getDocument(g),h;if(i.defaultView&&i.defaultView.getComputedStyle){h=i.defaultView.getComputedStyle(g,null);if(h){return h[f]||h.getPropertyValue(f)}}return""};c.dom._styleFixer=c.dom._styleFixer||{};c.dom._styleFilter=c.dom._styleFilter||[];c.dom._styleFilter.filter=function(g,k,l){for(var f=0,j=c.dom._styleFilter,h;h=j[f];f++){if(h=h[l]){k=h(g,k)}}return k};c.string=c.string||{};c.string.toCamelCase=function(f){if(f.indexOf("-")<0&&f.indexOf("_")<0){return f}return f.replace(/[-_][^-_]/g,function(g){return g.charAt(1).toUpperCase()})};c.dom.getStyle=function(h,g){var j=c.dom;h=j.g(h);g=c.string.toCamelCase(g);var i=h.style[g]||(h.currentStyle?h.currentStyle[g]:"")||j.getComputedStyle(h,g);if(!i){var f=j._styleFixer[g];if(f){i=f.get?f.get(h):c.dom.getStyle(h,f)}}if(f=j._styleFilter){i=f.filter(g,i,"get")}return i};c.getStyle=c.dom.getStyle;if(/opera\/(\d+\.\d)/i.test(navigator.userAgent)){c.browser.opera=+RegExp["\x241"]}c.browser.isWebkit=/webkit/i.test(navigator.userAgent);c.browser.isGecko=/gecko/i.test(navigator.userAgent)&&!/like gecko/i.test(navigator.userAgent);c.browser.isStrict=document.compatMode=="CSS1Compat";c.dom.getPosition=function(f){f=c.dom.g(f);var o=c.dom.getDocument(f),i=c.browser,l=c.dom.getStyle,h=i.isGecko>0&&o.getBoxObjectFor&&l(f,"position")=="absolute"&&(f.style.top===""||f.style.left===""),m={left:0,top:0},k=(i.ie&&!i.isStrict)?o.body:o.documentElement,p,g;if(f==k){return m}if(f.getBoundingClientRect){g=f.getBoundingClientRect();m.left=Math.floor(g.left)+Math.max(o.documentElement.scrollLeft,o.body.scrollLeft);m.top=Math.floor(g.top)+Math.max(o.documentElement.scrollTop,o.body.scrollTop);m.left-=o.documentElement.clientLeft;m.top-=o.documentElement.clientTop;var n=o.body,q=parseInt(l(n,"borderLeftWidth")),j=parseInt(l(n,"borderTopWidth"));if(i.ie&&!i.isStrict){m.left-=isNaN(q)?2:q;m.top-=isNaN(j)?2:j}}else{p=f;do{m.left+=p.offsetLeft;m.top+=p.offsetTop;if(i.isWebkit>0&&l(p,"position")=="fixed"){m.left+=o.body.scrollLeft;m.top+=o.body.scrollTop;break}p=p.offsetParent}while(p&&p!=f);if(i.opera>0||(i.isWebkit>0&&l(f,"position")=="absolute")){m.top-=o.body.offsetTop}p=f.offsetParent;while(p&&p!=o.body){m.left-=p.scrollLeft;if(!i.opera||p.tagName!="TR"){m.top-=p.scrollTop}p=p.offsetParent}}return m};c.event=c.event||{};c.event._listeners=c.event._listeners||[];c.event.on=function(g,j,l){j=j.replace(/^on/i,"");g=c.dom._g(g);var k=function(n){l.call(g,n)},f=c.event._listeners,i=c.event._eventFilter,m,h=j;j=j.toLowerCase();if(i&&i[j]){m=i[j](g,j,k);h=m.type;k=m.listener}if(g.addEventListener){g.addEventListener(h,k,false)}else{if(g.attachEvent){g.attachEvent("on"+h,k)}}f[f.length]=[g,j,l,k,h];return g};c.on=c.event.on;(function(){var f=window[c.guid];c.lang.guid=function(){return"TANGRAM__"+(f._counter++).toString(36)};f._counter=f._counter||1})();window[c.guid]._instances=window[c.guid]._instances||{};c.lang.isFunction=function(f){return"[object Function]"==Object.prototype.toString.call(f)};c.lang.Class=function(f){this.guid=f||c.lang.guid();window[c.guid]._instances[this.guid]=this};window[c.guid]._instances=window[c.guid]._instances||{};c.lang.Class.prototype.dispose=function(){delete window[c.guid]._instances[this.guid];for(var f in this){if(!c.lang.isFunction(this[f])){delete this[f]}}this.disposed=true};c.lang.Class.prototype.toString=function(){return"[object "+(this._className||"Object")+"]"};c.lang.Event=function(f,g){this.type=f;this.returnValue=true;this.target=g||null;this.currentTarget=null};c.lang.Class.prototype.addEventListener=function(i,h,g){if(!c.lang.isFunction(h)){return}!this.__listeners&&(this.__listeners={});var f=this.__listeners,j;if(typeof g=="string"&&g){if(/[^\w\-]/.test(g)){throw ("nonstandard key:"+g)}else{h.hashCode=g;j=g}}i.indexOf("on")!=0&&(i="on"+i);typeof f[i]!="object"&&(f[i]={});j=j||c.lang.guid();h.hashCode=j;f[i][j]=h};c.lang.Class.prototype.removeEventListener=function(i,h){if(typeof h!="undefined"){if((c.lang.isFunction(h)&&!(h=h.hashCode))||(!c.lang.isString(h))){return}}!this.__listeners&&(this.__listeners={});i.indexOf("on")!=0&&(i="on"+i);var g=this.__listeners;if(!g[i]){return}if(typeof h!="undefined"){g[i][h]&&delete g[i][h]}else{for(var f in g[i]){delete g[i][f]}}};c.lang.Class.prototype.dispatchEvent=function(j,f){if(c.lang.isString(j)){j=new c.lang.Event(j)}!this.__listeners&&(this.__listeners={});f=f||{};for(var h in f){j[h]=f[h]}var h,g=this.__listeners,k=j.type;j.target=j.target||this;j.currentTarget=this;k.indexOf("on")!=0&&(k="on"+k);c.lang.isFunction(this[k])&&this[k].apply(this,arguments);if(typeof g[k]=="object"){for(h in g[k]){g[k][h].apply(this,arguments)}}return j.returnValue};c.lang.inherits=function(l,j,i){var h,k,f=l.prototype,g=new Function();g.prototype=j.prototype;k=l.prototype=new g();for(h in f){k[h]=f[h]}l.prototype.constructor=l;l.superClass=j.prototype;if("string"==typeof i){k._className=i}};c.inherits=c.lang.inherits})();var b="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m";var a="png";var e=BMapLib.TextIconOverlay=function(f,h,g){this._position=f;this._text=h;this._options=g||{};this._styles=this._options.styles||[];(!this._styles.length)&&this._setupDefaultStyles()};d.lang.inherits(e,BMap.Overlay,"TextIconOverlay");e.prototype._setupDefaultStyles=function(){var h=[53,56,66,78,90];for(var g=0,f;f=h[g];g++){this._styles.push({url:b+g+"."+a,size:new BMap.Size(f,f)})}};e.prototype.initialize=function(f){this._map=f;this._domElement=document.createElement("div");this._updateCss();this._updateText();this._updatePosition();this._bind();this._map.getPanes().markerMouseTarget.appendChild(this._domElement);return this._domElement};e.prototype.draw=function(){this._map&&this._updatePosition()};e.prototype.getText=function(){return this._text};e.prototype.setText=function(f){if(f&&(!this._text||(this._text.toString()!=f.toString()))){this._text=f;this._updateText();this._updateCss();this._updatePosition()}};e.prototype.getPosition=function(){return this._position};e.prototype.setPosition=function(f){if(f&&(!this._position||!this._position.equals(f))){this._position=f;this._updatePosition()}};e.prototype.getStyleByText=function(i,h){var g=parseInt(i);var f=parseInt(g/10);f=Math.max(0,f);f=Math.min(f,h.length-1);return h[f]};e.prototype._updateCss=function(){var f=this.getStyleByText(this._text,this._styles);this._domElement.style.cssText=this._buildCssText(f)};e.prototype._updateText=function(){if(this._domElement){this._domElement.innerHTML=this._text}};e.prototype._updatePosition=function(){if(this._domElement&&this._position){var f=this._domElement.style;var g=this._map.pointToOverlayPixel(this._position);g.x-=Math.ceil(parseInt(f.width)/2);g.y-=Math.ceil(parseInt(f.height)/2);f.left=g.x+"px";f.top=g.y+"px"}};e.prototype._buildCssText=function(g){var h=g.url;var n=g.size;var k=g.anchor;var j=g.offset;var l=g.textColor||"black";var f=g.textSize||10;var m=[];if(d.browser.ie<7){m.push('filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="'+h+'");')}else{m.push("background-image:url("+h+");");var i="0 0";(j instanceof BMap.Size)&&(i=j.width+"px "+j.height+"px");m.push("background-position:"+i+";")}if(n instanceof BMap.Size){if(k instanceof BMap.Size){if(k.height>0&&k.height<n.height){m.push("height:"+(n.height-k.height)+"px; padding-top:"+k.height+"px;")}if(k.width>0&&k.width<n.width){m.push("width:"+(n.width-k.width)+"px; padding-left:"+k.width+"px;")}}else{m.push("height:"+n.height+"px; line-height:"+n.height+"px;");m.push("width:"+n.width+"px; text-align:center;")}}m.push("cursor:pointer; color:"+l+"; position:absolute; font-size:"+f+"px; font-family:Arial,sans-serif; font-weight:bold");return m.join("")};e.prototype._bind=function(){if(!this._domElement){return}var g=this;var i=this._map;var f=d.lang.Event;function h(m,l){var k=m.srcElement||m.target;var j=m.clientX||m.pageX;var o=m.clientY||m.pageY;if(m&&l&&j&&o&&k){var n=d.dom.getPosition(i.getContainer());l.pixel=new BMap.Pixel(j-n.left,o-n.top);l.point=i.pixelToPoint(l.pixel)}return l}d.event.on(this._domElement,"mouseover",function(j){g.dispatchEvent(h(j,new f("onmouseover")))});d.event.on(this._domElement,"mouseout",function(j){g.dispatchEvent(h(j,new f("onmouseout")))});d.event.on(this._domElement,"click",function(j){g.dispatchEvent(h(j,new f("onclick")))})}})();


var BMapLib = window.BMapLib = BMapLib || {};
(function() {
  var b = function(m, l, j) {
    l = d(l);
    var n = m.pointToPixel(l.getNorthEast());
    var i = m.pointToPixel(l.getSouthWest());
    n.x += j;
    n.y -= j;
    i.x -= j;
    i.y += j;
    var h = m.pixelToPoint(n);
    var k = m.pixelToPoint(i);
    return new BMap.Bounds(k, h);
  };
  var d = function(i) {
    var k = f(i.getNorthEast().lng, -180, 180);
    var h = f(i.getSouthWest().lng, -180, 180);
    var j = f(i.getNorthEast().lat, -74, 74);
    var l = f(i.getSouthWest().lat, -74, 74);
    return new BMap.Bounds(new BMap.Point(h, l), new BMap.Point(k, j));
  };
  var f = function(j, k, h) {
    k && (j = Math.max(j, k));
    h && (j = Math.min(j, h));
    return j;
  };
  var a = function(h) {
    return "[object Array]" === Object.prototype.toString.call(h);
  };
  var c = function(l, n) {
    var j = -1;
    if (a(n)) {
      if (n.indexOf) {
        j = n.indexOf(l);
      } else {
        for (var k = 0, h; h = n[k]; k++) {
          if (h === l) {
            j = k;
            break;
          }
        }
      }
    }
    return j;
  };
  var e = BMapLib.MarkerClusterer = function(l, h) {
    if (!l) {
      return;
    }
    this._map = l;
    this._markers = [];
    this._clusters = [];
    var k = h || {};
    this._gridSize = k.gridSize || 60;
    this._maxZoom = k.maxZoom || 18;
    this._minClusterSize = k.minClusterSize || 2;
    this._isAverageCenter = false;
    if (k.isAverageCenter != undefined) {
      this._isAverageCenter = k.isAverageCenter;
    }
    this._styles = k.styles || [];
    var j = this;
    this._map.addEventListener("zoomend", function() {
      j._redraw();
    });
    this._map.addEventListener("moveend", function() {
      j._redraw();
    });
    var i = k.markers;
    a(i) && this.addMarkers(i);
  };
  e.prototype.addMarkers = function(k) {
    for (var j = 0, h = k.length; j < h; j++) {
      this._pushMarkerTo(k[j]);
    }
    this._createClusters();
  };
  e.prototype._pushMarkerTo = function(h) {
    var i = c(h, this._markers);
    if (i === -1) {
      h.isInCluster = false;
      this._markers.push(h);
    }
  };
  e.prototype.addMarker = function(h) {
    this._pushMarkerTo(h);
    this._createClusters();
  };
  e.prototype._createClusters = function() {
    var j = this._map.getBounds();
    var l = b(this._map, j, this._gridSize);
    var count = 0;
    console.time("timeData");
    for (var k = 0, h; h = this._markers[k]; k++) {
      if (!h.isInCluster && l.containsPoint(h.getPosition())) {

        count++;
        this._addToClosestCluster(h);
      }
    }

    var len = this._markers.length;
    for (var i = 0; i < len; i++) {
      if(this._clusters[i]){
        this._clusters[i].render();
      }
    }
    console.log(count);
    console.timeEnd("timeData");
  };
  e.prototype._addToClosestCluster = function(l) {
    var p = 4000000;
    var n = null;
    var k = l.getPosition();
    for (var m = 0, j; j = this._clusters[m]; m++) {
      var h = j.getCenter();
      if (h) {
        var o = this._map.getDistance(h, l.getPosition());
        if (o < p) {
          p = o;
          n = j;
        }
      }
    }
    if (n && n.isMarkerInClusterBounds(l)) {
      n.addMarker(l);
    } else {
      var j = new g(this);
      j.addMarker(l);
      this._clusters.push(j);
    }
  };
  e.prototype._clearLastClusters = function() {
    for (var j = 0, h; h = this._clusters[j]; j++) {
      h.remove();
    }
    this._clusters = [];
    this._removeMarkersFromCluster();
  };
  e.prototype._removeMarkersFromCluster = function() {
    for (var j = 0, h; h = this._markers[j]; j++) {
      h.isInCluster = false;
    }
  };
  e.prototype._removeMarkersFromMap = function() {
    for (var j = 0, h; h = this._markers[j]; j++) {
      h.isInCluster = false;
      this._map.removeOverlay(h);
    }
  };
  e.prototype._removeMarker = function(h) {
    var i = c(h, this._markers);
    if (i === -1) {
      return false;
    }
    this._map.removeOverlay(h);
    this._markers.splice(i, 1);
    return true;
  };
  e.prototype.removeMarker = function(h) {
    var i = this._removeMarker(h);
    if (i) {
      this._clearLastClusters();
      this._createClusters();
    }
    return i;
  };
  e.prototype.removeMarkers = function(l) {
    var k = false;
    for (var h = 0; h < l.length; h++) {
      var j = this._removeMarker(l[h]);
      k = k || j;
    }
    if (k) {
      this._clearLastClusters();
      this._createClusters();
    }
    return k;
  };
  e.prototype.clearMarkers = function() {
    this._clearLastClusters();
    this._removeMarkersFromMap();
    this._markers = [];
  };
  e.prototype._redraw = function() {
    this._clearLastClusters();
    this._createClusters();
  };
  e.prototype.getGridSize = function() {
    return this._gridSize;
  };
  e.prototype.setGridSize = function(h) {
    this._gridSize = h;
    this._redraw();
  };
  e.prototype.getMaxZoom = function() {
    return this._maxZoom;
  };
  e.prototype.setMaxZoom = function(h) {
    this._maxZoom = h;
    this._redraw();
  };
  e.prototype.getStyles = function() {
    return this._styles;
  };
  e.prototype.setStyles = function(h) {
    this._styles = h;
    this._redraw();
  };
  e.prototype.getMinClusterSize = function() {
    return this._minClusterSize;
  };
  e.prototype.setMinClusterSize = function(h) {
    this._minClusterSize = h;
    this._redraw();
  };
  e.prototype.isAverageCenter = function() {
    return this._isAverageCenter;
  };
  e.prototype.getMap = function() {
    return this._map;
  };
  e.prototype.getMarkers = function() {
    return this._markers;
  };
  e.prototype.getClustersCount = function() {
    var k = 0;
    for (var j = 0, h; h = this._clusters[j]; j++) {
      h.isReal() && k++;
    }
    return k;
  };

  function g(h) {
    this._markerClusterer = h;
    this._map = h.getMap();
    this._minClusterSize = h.getMinClusterSize();
    this._isAverageCenter = h.isAverageCenter();
    this._center = null;
    this._markers = [];
    this._gridBounds = null;
    this._isReal = false;
    this._clusterMarker = new BMapLib.TextIconOverlay(this._center, this._markers.length, { styles: this._markerClusterer.getStyles() });
  }

  g.prototype.addMarker = function(k) {
    if (this.isMarkerInCluster(k)) {
      return false;
    }
    if (!this._center) {
      this._center = k.getPosition();
      this.updateGridBounds();
    } else {
      if (this._isAverageCenter) {
        var j = this._markers.length + 1;
        var o = (this._center.lat * (j - 1) + k.getPosition().lat) / j;
        var m = (this._center.lng * (j - 1) + k.getPosition().lng) / j;
        this._center = new BMap.Point(m, o);
        this.updateGridBounds();
      }
    }
    k.isInCluster = true;
    this._markers.push(k);
    var h = this._markers.length;
    if (h < this._minClusterSize) {
      this._map.addOverlay(k);
      return true;
    } else {
      if (h === this._minClusterSize) {
        for (var n = 0; n < h; n++) {
          this._markers[n].getMap() && this._map.removeOverlay(this._markers[n]);
        }
      }
    }
    // this._map.addOverlay(this._clusterMarker);
    // this._isReal = true;
    // this.updateClusterMarker();
    return true;
  };
  g.prototype.isMarkerInCluster = function(j) {
    if (this._markers.indexOf) {
      return this._markers.indexOf(j) != -1;
    } else {
      for (var k = 0, h; h = this._markers[k]; k++) {
        if (h === j) {
          return true;
        }
      }
    }
    return false;
  };
  g.prototype.isMarkerInClusterBounds = function(h) {
    return this._gridBounds.containsPoint(h.getPosition());
  };
  g.prototype.isReal = function(h) {
    return this._isReal;
  };
  g.prototype.updateGridBounds = function() {
    var h = new BMap.Bounds(this._center, this._center);
    this._gridBounds = b(this._map, h, this._markerClusterer.getGridSize());
  };
  g.prototype.updateClusterMarker = function() {
    if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
      this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
      for (var l = 0, j; j = this._markers[l]; l++) {
        this._map.addOverlay(j);
      }
      return;
    }
    if (this._markers.length < this._minClusterSize) {
      this._clusterMarker.hide();
      return;
    }
    this._clusterMarker.setPosition(this._center);
    this._clusterMarker.setText(this._markers.length);
    var k = this._map;
    var h = this.getBounds();
    this._clusterMarker.addEventListener("click", function(i) {
      k.setViewport(h);
    });
  };
  g.prototype.remove = function() {
    for (var j = 0, h; h = this._markers[j]; j++) {
      this._markers[j].getMap() && this._map.removeOverlay(this._markers[j]);
    }
    this._map.removeOverlay(this._clusterMarker);
    this._markers.length = 0;
    delete this._markers;
  };
  g.prototype.getBounds = function() {
    var k = new BMap.Bounds(this._center, this._center);
    for (var j = 0, h; h = this._markers[j]; j++) {
      k.extend(h.getPosition());
    }
    return k;
  };
  g.prototype.getCenter = function() {
    return this._center;
  };
  g.prototype.render = function(){
    var len = this._markers.length;

    if (len < this._minClusterSize) {
      for (var i = 0; i < len; i++) {
        this._map.addOverlay(this._markers[i]);
      }
    } else {
      this._map.addOverlay(this._clusterMarker);
      this._isReal = true;
      this.updateClusterMarker();
    }
  }
})();
