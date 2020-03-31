<template>
  <section class="container">
    <m-header :border_on="false"></m-header>
    <h3 class="tit">哪项活动更加吸引您？</h3>
    <div class="list">
      <li v-for="(item,index) in surveyArr" :key="index" :class="{checked:sel===index}" @click="change(index)">
        {{item.name}}
      </li>
    </div>
    <div class="login_btn">
      <a href="javascript:;" @click="goToUser" class="btn_login" :class="{disabled:sel===-1}" >进入首页</a>
    </div>
    <div class="skip">
      <nuxt-link replace @click="cancel" :to="{path:'/'}">跳过</nuxt-link>
    </div>
  </section>
</template>

<script>
import {commonMixin} from "~/mixins";
import header from "~/components/header.vue";
import userService from "~/services/userService.js";

export default {
  mixins: [commonMixin],
  components: {
    mHeader:header
  },
  data(){
    return {
      surveyArr:[
        {
          key:0,
          name:"阅读健康资讯、文章"
        },
        {
          key:1,
          name:"和其他患者进行交流"
        },
        {
          key:2,
          name:"代替家人了解相关疾病"
        },
      ],
      sel:-1,
      checked:false,
      isSurveyByUser:false,
    };
  },
  methods:{
    goToUser(){
      if(!this.checked) return false;
      let result = this.surveyArr[this.sel];
      this.isSurveyByUser = true;
      userService.userSurvey({
        surveyKey:result.key,
        surveyResult:result.name,
      }).then((res)=>{
        this.$router.push({
          path:"/"
        });
      });
    },
    change(i){
      this.sel=i;
      this.checked=true;
    },
    cancel(){
      userService.userSurvey({
        surveyKey:3,
        surveyResult:"直接进入首页",
      }).then((res)=>{});
    },
    goToRefer(){
      console.log(this.$route.query);
      let referer = this.$route.query.referer;
      if(referer){
        this.$router.replace({
          path: decodeURIComponent(referer)
        });
      }else{
        this.$router.replace({
          path: "/my"
        });
      }
    }
  },
  beforeDestroy(){
    if(!this.isSurveyByUser){
      userService.userSurvey({
        surveyKey:4,
        surveyResult:"未做任何操作",
      }).then((res)=>{});
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

.list{
  padding-left: 37px;
  padding-top: 26px;
  li{
    padding-left: 31px;
    line-height: 49px;
    font-size: 15px;
    background: url(../../assets/images/btn_rb_normal@2x.png) no-repeat left center;
    background-size:20px 20px;
  }
  li.checked{
    background-image: url(../../assets/images/btn_chb_selected2@2x.png);
  }
}

.skip{
  position:fixed;
  width: 100%;
  text-align: center;
  color: #999;
  left: 0;
  bottom: 30px;
  font-size: 13px;
  a{color: #CFCFCF;}
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

