<template>
  <section class="container">
    <m-header :border_on="false"></m-header>
    <h3 class="tit">基本信息</h3>
    <div class="login_box">
      <div class="login_item">
        <label for="">昵称</label>
        <div class="ipt_wrapper">
          <input type="text" class="ipt_txt" placeholder="" v-model="nickName" @keyup="checked">
        </div>
      </div>
      <div class="login_item">

        <div class="ipt_wrapper">
          <label for="">性别</label>
          <div class="gender_box">
            <span class="female" :class="{selected:gender===1}" @click="selGender(1)">男</span>
            <span class="male" :class="{selected:gender===2}" @click="selGender(2)">女</span>
          </div>
        </div>

      </div>
    </div>
    <div class="login_btn">
      <a href="javascript:;" class="btn_login" :class="{disabled:isChecked===false}"  @click="updateMyinfo">确认</a>
    </div>
  </section>
</template>

<script>
import tools from "~/utils/tools.js";
import { commonMixin} from "~/mixins";
import header from "~/components/header.vue";
import userService from "~/services/userService.js";
export default {
  mixins: [commonMixin],
  components: {
    mHeader:header
  },
  data(){
    return {
      gender:0,
      nickName:"",
      isChecked:false,
    };
  },
  methods:{
    selGender(gender){
      this.gender=gender;
      this.checked();
    },
    checked(){
      let _this = this;
      if(_this.nickName==""){
        _this.isChecked=false;
      }else if(_this.gender==0){
        _this.isChecked=false;
      }else{
        _this.isChecked=true;
      }
    },
    async updateMyinfo(){
      if(this.isChecked==false) return;
      let nickName = tools.trim(this.nickName);
      let regExt = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      if(tools.isEmpty(nickName)){
        this.$toast.tip("昵称不允许为空~");
        return;
      }
      if(!regExt.test(nickName)){
        this.$toast.tip("昵称只能包含中文、数字、字母、下划线~");
        return;
      }
      if(nickName.length>10){
        this.$toast.tip("昵称只允许输入10个字哦~");
        return;
      }

      let isNickValided = await userService.checkNikeName({nikeName:nickName})
        .then((res)=>{
          if(res.status == 200){
            return !res.data;
          }else{
            return false;
          }
        });
      if(!isNickValided){
        this.$toast.tip("该昵称已存在~");
        return;
      }
      let _this = this;
      let data = {
        nickName: nickName,
        gender:  _this.gender,
      };
      userService.updateMyinfo(data)
        .then(((res)=>{
          if(res.status==200){
            this.$store.dispatch("update_userinfo",this.VX_token)
              .then(()=>{
                _this.$router.push({
                  path:"/questionnaire",
                  referer:this.$route.query.referer? this.$route.query.referer:""
                });
              });
          }else{
            this.$toast.tip(res.message);
          }
        }));
    }
  },
  head(){
    return {
      title: "登录设置",
    };
  }
};
</script>

<style lang="less" scoped>
.container{
  position:absolute;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: #fff;
  left: 0;
  top: 0;
}
.tit{
  font-size: 20px;
  color: #282828;
  padding: 26px 35px 0;
}
.login_box{
  padding: 0 35px;
  .login_item{
    padding-top: 30px;
    border-bottom: 1px solid #EFEFEF;
    label{
      font-size: 12px;
      color: #999;
      line-height: 17px;
    }
    .ipt_wrapper{
      display: flex;
    }
    .ipt_txt{
      flex: 1;
      box-flex: 1;
      overflow: hidden;
      font-size: 17px;
      color: #282828;
      line-height: 24px;
      padding: 4px 0;
      border:0;
    }
    .gender_box{
      flex:1;
      padding-left: 30px;
      .male,.female{
        display: inline-block;
        width: 56px;
        padding-top: 66px;
        text-align: center;
        font-size: 14px;
      }
      .male{
        background: url(../../assets/images/btn_lady@2x.png) no-repeat;
        background-size: 56px 56px;
        margin-right: 40px;
      }
      .male.selected{
        background-image: url(../../assets/images/btn_lady1@2x.png);
      }
      .female{
        background: url(../../assets/images/btn_man@2x.png) no-repeat;
        background-size: 56px 56px;
      }
      .female.selected{
        background-image: url(../../assets/images/btn_man1@2x.png);
      }
    }
  }
  .login_item:last-child{
      border:0;
    }
}
.login_btn{
  text-align: center;
  padding: 40px 35px 0;
  .btn_login{
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    background-color: #2688FC;
    color: #fff;
    border-radius: 20px;
  }
  .btn_login.disabled{
    background-color: #CFCFCF;
  }
}
</style>

