<template>
	<section class="container">
		<m-header title="编辑资料"></m-header>
		<div class="edit_form">
			<div class="edit_item face">
				<label for="">头像</label>
				<div class="edit_cont">
					<img :src="headPicBase64==''?GET_IMG_URL(userInfo.headPicUrl,'u'):headPicBase64" width="48" height="48" alt="">
					<input accept="image/*" ref="avaterInputer" type="file" @change="fileHandle" class="upimg">
				</div>
			</div>
			<div class="edit_item">
				<label for="">昵称</label>
				<div class="edit_cont">
					<div class="ipt_wrap">
						<span type="text" class="ipt_txt" @click="toEdit('name')">{{userInfo.nickName}}</span>
					</div>
				</div>
			</div>
			<div class="edit_item">
				<label for="">性别</label>
				<div class="edit_cont">
					<span v-if="parseInt(gender)===1">男</span>
					<span v-if="parseInt(gender)===2">女</span>
					<select name="" id="" v-model="gender" @change="updateMyinfo">
						<option value="1">男</option>
						<option value="2">女</option>
					</select>
				</div>
			</div>
		</div>

		<div class="edit_form mt10">
			<div class="edit_item">
				<label for=""><i :class="['icon',userInfo.phoneNum&&userInfo.phoneNum!=''?'phone-icon-active':'phone-icon']"></i>手机号</label>
				<div class="edit_cont">
					<div class="ipt_wrap" @click="toEdit('phone')"><span class="ipt_txt">{{userInfo.phoneNum}}</span></div>
				</div>
			</div>
			<div class="edit_item">
				<label for=""><i :class="['icon',checkBind('weixin')?'weixin-icon-active':'weixin-icon']"></i>微信</label>
				<div class="edit_cont otherLink">
					<a v-if="!checkBind('weixin')" href="javascript:;" @click="bindApp('weixin')">去绑定</a>
					<div v-else class="ipt_wrap" @click="unbindApp('weixin')">
						<span class="ipt_txt">{{userInfo.accountBinding.weixinNickName}}</span>
					</div>
				</div>
			</div>
			<div class="edit_item">
				<label for=""><i :class="['icon',checkBind('weibo')?'weibo-icon-active':'weibo-icon']"></i>微博</label>
				<div class="edit_cont otherLink">
					<a v-if="!checkBind('weibo')" href="javascript:;" @click="bindApp('weibo')">去绑定</a>
					<div v-else class="ipt_wrap" @click="unbindApp('weibo')">
						<span class="ipt_txt">{{userInfo.accountBinding.weiboNickName}}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="edit_form mt10 outLogin" v-if="VX_is_login" @click="logout">退出登录</div>

		<!-- dialog -->
		<editDialog v-model="dialogShow" :option="dialogOption" @confirm="onConfirm"></editDialog>

	</section>
</template>

<script>
let lrz = null;
if (process.client) {
  lrz = require("lrz");
}

import { LOGIN_URL } from "~/config";
import { commonMixin } from "~/mixins";
import header from "~/components/header.vue";
import userService from "~/services/userService.js";
import sysService from "~/services/sysService.js";
import editDialog from "./components/editDialog.vue";

export default {
  mixins: [commonMixin],
  components: {
    mHeader: header,
    editDialog
  },
  middleware: ["checkLogin"],
  data() {
    return {
      gender: 0,
      headPicUrl: "",
      headPicBase64: "",
      userInfo: {},
      dialogShow: false,
      dialogOption: {}
    };
  },
  created() {
    if (this.VX_is_login) {
      this.userInfo = this.VX_userInfo;
      this.getUserinfo();
    }
  },
  methods: {
    fileHandle() {
      let inputDOM = this.$refs.avaterInputer;
      // 通过DOM取文件数据
      if (inputDOM.files.length === 0) return;
      let file = inputDOM.files[0];
      let size = (file.size / 1024 / 1024).toFixed(2);
      if (size > 5) {
        this.$toast.tip("请选择小于5M的图片哦~");
        return;
      }
      let This = this;
      //插件压缩
      lrz(file, {
        quality: 0.3,
        width: 800
      })
        .then(function(rst) {
          inputDOM.value = "";
          console.log(rst);
          This.headPicBase64 = rst.base64;
          This.uploadAvater({
            name: file.name,
            blob: rst.file
          });
        })
        .catch(function(err) {
          // 处理失败会执行
          This.$toast.tip("压缩失败，请重新选择图片");
          return;
        })
        .always(function() {
          // 不管是成功失败，都会执行
          This.initing_page = false;
        });
    },
    uploadAvater(params) {
      var fd = new FormData();
      let This = this;
      console.log(params.blob);
      fd.append("file", params.blob);
      sysService
        .uploadImg(fd)
        .then(res => {
          return res;
        })
        .then(res => {
          if (res.status == 200) {
            This.updateMyHeadPic(res.data);
          }
        });
    },
    doUpload(data, fileParams) {
      let params = data.param;
      params.file = fileParams.blob;
      console.log(params.OSSAccessKeyId);
      let url = data.url;
      var fd = new FormData();
      fd.append("OSSAccessKeyId", params.OSSAccessKeyId);
      fd.append("Signature", params.Signature);
      fd.append("key", params.key);
      fd.append("policy", params.policy);
      console.log(fd);
      // return;
      sysService
        .uploadToAliyun({
          fd: params,
          url
        })
        .then(res => {
          console.log(res);
        });
    },
    async getUserinfo() {
      let res = await this.$store.dispatch("update_userinfo", this.VX_token);

      if (res.status == 200) {
        this.userInfo = res.data;
        this.gender = this.userInfo.gender;
      }
      /*let data = {
        token: this.VX_token
      };
      userService.getmyinfo(data).then(res => {
        if (res.status == 200) {
          this.userInfo = res.data;
          this.gender = this.userInfo.gender;
          this.$store.commit("SET_USERINFO", res.data);
        }
      });*/
    },
    updateMyHeadPic(params) {
      let data = {
        headPicId: params.id,
        headPicUrl: params.url
      };
      userService.updateMyinfo(data).then(res => {
        if (res.status == 200) {
          this.$toast.tip("修改成功");
          this.$store.dispatch("update_userinfo", this.VX_token);
        }
      });
    },
    updateMyinfo() {
      let data = {
        gender: this.gender
      };
      userService.updateMyinfo(data).then(res => {
        if (res.status == 200) {
          this.$toast.tip("修改成功");
          this.$store.dispatch("update_userinfo", this.VX_token);
        }
      });
    },
    toEdit(type) {
      let map = {
        phone: "/my/editPhone",
        name: "/my/editName"
      };

      this.$router.push(map[type]);
    },
    bindApp(type) {
      let url = "";

      // 绑定：需要新旧用户id
      // 保存旧用户token
      if (this.VX_token) {
        localStorage.setItem("phoneToken", this.VX_token);
      }

      if (type == "weixin") {
        let referer = this.$route.query.referer;
        let link =
					LOGIN_URL +
					"/auth/h5Login?cmtyId=" +
					this.$store.state.comtyId;

        if (referer) {
          link += "&referer=" + encodeURIComponent(referer);
        }

        window.location.href = link;
      } else {
        let refer = encodeURIComponent(
          this.APP_URL + "/callback?referer=" + this.$route.fullPath
        );
        url =
					"https://health.sina.cn/" +
					"userAuth/weibo/login?callBackUrl=" +
					refer;
        window.location.href = url;
      }
    },
    unbindApp(type) {
      let text = type == "weibo" ? "微博" : "微信";
      this.dialogOption = {
        type: type,
        content: `是否解除${text}绑定？`
      };
      this.dialogShow = true;
    },
    onConfirm() {
      let type = this.dialogOption.type;
      let map = {
        weixin: "微信",
        weibo: "微博"
      };

      userService
        .unBindThirdUser({ unbindType: type })
        .then(res => {
          if (res.status == 200) {
            this.$toast.tip(`解绑${map[type]}成功！`);
            this.$store.dispatch("update_userinfo", this.VX_token);
          } else {
            this.$toast.tip(`解绑${map[type]}失败！`);
          }
        })
        .finally(() => {
          this.dialogShow = false;
        });
    },
    checkBind(type) {
      if (this.VX_userInfo && this.VX_userInfo.accountBinding) {
        let third = this.VX_userInfo.accountBinding;
        return type == "weibo" ? third.weiboUid : third.wexinUnionId;
      } else {
        return false;
      }
    },
    logout() {
      this.$store.dispatch("user_logout");

      // 在微博客户端下会自动登录，退出后还是会重复自动登录，所以不能直接replace
      if (this.$platformInfo.os.isWeibo) {
        this.$router.push({
          path: "/",
          query: {
            comtyId: this.$route.query.comtyId
          }
        });
      } else {
        this.router_replace({ path: "/" });
      }
    }
  },
  head() {
    return {
      title: "编辑资料"
    };
  }
};
</script>

<style lang="less" scoped>
.edit_form {
	padding-left: 15px;
	background-color: #fff;
}
.edit_item {
	display: flex;
	line-height: 37px;
	height: 54px;
	padding: 8px 10px 8px 0;
	position: relative;
	& + .edit_item {
		border-top: 1px solid #efefef;
	}
	.icon {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-size: cover;
		position: relative;
		top: 8px;
		left: -3px;
	}
	.phone-icon {
		background-image: url("../../assets/images/bound_icon_phone_pre@2x(1).png");
	}
	.weixin-icon {
		background-image: url("../../assets/images/bound_icon_wechat@2x.png");
	}
	.weibo-icon {
		background-image: url("../../assets/images/bound_icon_weibo@2x.png");
	}
	.phone-icon-active {
		background-image: url("../../assets/images/bound_icon_phone_pre@2x.png");
	}
	.weixin-icon-active {
		background-image: url("../../assets/images/bound_icon_wechat_pre@2x.png");
	}
	.weibo-icon-active {
		background-image: url("../../assets/images/bound_icon_weibo_pre@2x.png");
	}
}
.edit_item label {
	display: block;
	width: 100px;
	font-size: 15px;
	color: #282828;
}
.edit_item.face {
	line-height: 48px;
	height: 65px;
}
.edit_item .edit_cont {
	box-flex: 1;
	flex: 1;
	text-align: right;
	background: #fff url('../../assets/images/btn_enter@2x.png') no-repeat right
		center;
	background-size: 20px 20px;
	padding-right: 25px;
	position: relative;
	font-size: 15px;
	color: #999;
  .ipt_wrap {
    height: 100%;
  }
	&.otherLink {
		padding-right: 0;
		background: #fff;
		a {
			padding: 3px 10px;
			color: #2688fc;
			font-size: 14px;
			border: 1px solid #2688fc;
			border-radius: 4px;
		}
	}
	select {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
		left: 0;
		top: 0;
	}
	.upimg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		opacity: 0;
	}
	img {
		width: 48px;
		height: 48px;
		display: block;
		border-radius: 48px;
		float: right;
		background-color: #f8f8f8;
	}
}
.ipt_txt {
	width: 100%;
	box-sizing: border-box;
	border: 0;
	text-align: right;
	color: #999;
}
.outLogin {
	padding: 15px;
	color: #999;
	font-size: 15px;
	text-align: center;
}
</style>
