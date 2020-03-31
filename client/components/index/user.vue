<template>
    <div class="box_wrapper user_wrapper mt10">
      <p class="tit"><span class="blue">{{userNum}}</span>位用户在交流分享<span class="postsCount" v-if="postsCount>0">{{postsCount}}个帖子</span></p>
      <ul v-if="userList.length>0" class="userList clearfix">
        <li v-for="(item,index) in userList" :key="index">
          <nuxt-link v-if="item" :to="{path:'/users/'+item.id}">
            <em class="icon_first" v-if="index===0"></em>
            <em class="icon_second" v-if="index===1"></em>
            <em class="icon_third" v-if="index===2"></em>
            <img  v-lazy="GET_IMG_URL(item.headPicUrl,'u')" width="60" height="60" alt="">
          </nuxt-link>
        </li>
      </ul>
    </div>
</template>

<script>
import {commonMixin} from "~/mixins";
import communityService from "~/services/communityService.js";
export default {
  mixins:[commonMixin],
  components: {},
  props:{
    postsCount:{
      type:Number,
      default:0
    }
  },
  data(){
    return {
      userList:[],
      userNum:0,
    };
  },
  created(){
    this.getUserList();
    this.getCommunityUserCount();
  },
  methods:{
    getCommunityUserCount(){
      let queryParams = {};
      communityService.getCommunityUserCount(queryParams)
        .then(((res)=>{
          if(res.status==200&&res.data){
            this.userNum=res.data;
          }
        }));
    },
    getUserList(){
      let queryParams = {
        page:1,
        size:10,
      };
      communityService.getUserList(queryParams)
        .then(((res)=>{
          if(res.status==200&&res.data){
            this.userList=res.data;
          }
        }));
    }
  }
};
</script>
<style lang="less" scoped>
// @import "~/assets/css/list.css";
.box_wrapper{
  overflow: hidden;
}
.user_wrapper{
  padding-left: 15px;
  .tit{
    font-size: 15px;
    font-weight: bold;
    padding: 15px 0;
    line-height: 21px;
    .blue{color: #2688FC;}
    .postsCount{
      color: #999;
      float: right;
      font-weight: normal;
      font-size: 14px;
    }
  }
  .userList {
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    margin-right: -15px;
    position: relative;
    padding-bottom: 10px;
  }
  .userList li{
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    border:2px solid #2688FC;
    padding: 2px;
    display: inline-block;
    margin-right: 10px;
    img{
      display:block;
      width: 48px;
      height: 48px;
      border-radius: 48px;
    }
    .icon_first,.icon_second,.icon_third{
      display: block;
      width: 39px;
      height: 29px;
      background: url(~assets/images/icon_user_first@2x.png) no-repeat;
      background-size: cover;
      position:absolute;
      left: 50%;
      margin-left: -19px;
      bottom:-10px;
    }
    .icon_second{
      background-image: url(~assets/images/icon_user_second@2x.png);
    }
    .icon_third{
      background-image: url(~assets/images/icon_user_third@2x.png);
    }
  }
  .userList li:first-child{
    border-color:#FFBD00;
  }
}
</style>
