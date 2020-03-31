import Vue from "vue";

Vue.directive("iwen-gesture", {
  bind: function (el, binding, vnode) {
    // let startX, startY, moveEndX, moveEndY, X, Y;
    // let startX, moveEndX, X;
    let startY, moveEndY,Y;

    el.addEventListener("touchstart", function(e) {
      // startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    });

    el.addEventListener("touchend", function(e) {
      // moveEndX = e.changedTouches[0].pageX;
      moveEndY = e.changedTouches[0].pageY;

      // X = moveEndX - startX;
      Y = moveEndY - startY;

      if (Math.abs(Y) < 2) {
        binding.value("none");
        return;
      }

      /*if ( X > 0 && Math.abs(X) > Math.abs(Y)) {
        binding.value("right");
      }else if ( X < 0 && Math.abs(X) > Math.abs(Y)) {
        binding.value("left");
      }else */

      if ( Y > 0 ) {
        binding.value("down");
      }else if ( Y < 0 ) {
        binding.value("up");
      }else{
        binding.value("none");
      }
    });

  },
  unbind: function(el, binding, vnode) {
    $(el).unbind("touchstart");
    $(el).unbind("touchend");
  }
});
