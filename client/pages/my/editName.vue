<template>
  <section class="container">
    <m-header title="修改昵称"></m-header>
    <div class="ipt_wrapper">
      <input type="text" class="ipt_nickName" v-model="nickName" placeholder="请输入昵称">
      <em v-show="nickName" class="delete" @click="nickName=''"></em>
    </div>
    <div class="btn_box">
      <a href="javascript:;" class="btn_ok" @click="updateMyinfo">{{updeateing? "保存中...":"保存"}}</a>
    </div>
  </section>
</template>

<script>
  import tools from "~/utils/tools.js";
  import {
    commonMixin
  } from "~/mixins";
  import header from "~/components/header.vue";
  import userService from "~/services/userService.js";
  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header
    },
    middleware: ["checkLogin"],
    data() {
      return {
        nickName: "",
        placeholder: "",
        updeateing: false,
      };
    },
    created() {
      this.nickName = this.VX_userInfo.nickName;
      this.placeholder = this.VX_userInfo.nickName;
    },
    methods: {
      async updateMyinfo() {
        if (this.updeateing) return;
        let nickName = tools.trim(this.nickName);
        let regExt = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (tools.isEmpty(nickName)) {
          this.$toast.tip("昵称不允许为空~");
          return;
        }
        if (!regExt.test(nickName)) {
          this.$toast.tip("昵称只能包含中文、数字、字母、下划线~");
          return;
        }
        if (nickName.length > 10) {
          this.$toast.tip("昵称只允许输入10个字哦~");
          return;
        }

        let isNickValided = await userService.checkNikeName({
          nikeName: nickName
        })
          .then((res) => {
            if (res.status == 200) {
              return !res.data;
            } else {
              return false;
            }
          });
        if (!isNickValided) {
          this.$toast.tip("该昵称已存在~");
          return;
        }
        this.updeateing = true;
        let data = {
          nickName: nickName,
        };
        userService.updateMyinfo(data)
          .then(((res) => {
            this.updeateing = false;
            if (res.status == 200) {
              this.$toast.tip("修改成功");
              this.$store.dispatch("update_userinfo", this.VX_token);
              this.router_back();
            }
          }))
          .catch(() => {
            this.updeateing = false;
          });
      },
    },
    head() {
      return {
        title: "修改昵称",
      };
    }
  };

</script>

<style lang="less" scoped>
  .ipt_wrapper {
    position: relative;

    .delete {
      display: block;
      width: 19px;
      height: 19px;
      background: url(../../assets/images/btn_delete_s@2x.png) no-repeat;
      background-size: cover;
      position: absolute;
      right: 15px;
      top: 17px;
    }
  }

  .ipt_nickName {
    box-sizing: border-box;
    background-color: #fff;
    border: 0;
    height: 53px;
    padding: 15px;
    padding-right: 45px;
    width: 100%;
    line-height: 23px;
    font-size: 15px;
    color: #999;
  }

  .btn_box {
    padding: 10px;
  }

  .btn_ok {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background-color: #2688FC;
    display: block;
    border-radius: 4px;
  }

</style>
