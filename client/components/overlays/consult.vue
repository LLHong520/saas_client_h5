<template>
  <!-- 咨询室浮窗 -->
  <div class="consulting-room" v-if="isShow">
    <!--<i class="close"></i>-->
    <a href="/iframe?key=consulting_room"></a>
  </div>
</template>

<script>
  import articleService from "~/services/articleService.js";

  export default {
    name: "consult",
    data() {
      return {
        isShow: true,
        hasRoom: false, // 是否有配置咨询室
        notShowArr: [
          "find",
          "login",
          "tieba-edit",
          "iframe",
          "my",
        ]
      };
    },
    async created() {
      await this.getConsultRoom();
      this.checkShow();
    },
    methods: {
      async getConsultRoom() {
        // 获取是否配置咨询室
        await articleService.getCommunityConfig({
          key: "consulting_room"
        }).then( res => {
          if (res.status == 200 && res.data &&  res.data.value) {
            this.hasRoom = true;
          }
        });
      },
      checkShow() {
        if (this.notShowArr.indexOf(this.$route.name) > -1 || !this.hasRoom) {
          this.isShow = false;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .consulting-room {
    position: fixed;
    right: 0;
    bottom: 130px;
    z-index: 10;
    width: 76px;
    height: 82px;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      background: url(../../assets/images/btn_icon_cancel_pure@2x.png) no-repeat rgba(0, 0, 0, .5);
      background-size: 100%;
      border-radius: 100%;
    }
    a {
      display: block;
      width: 100%;
      height: 100%;
      background: url(../../assets/images/home_btn_consult.png) no-repeat;
      background-size: 100%;
    }
  }
</style>
