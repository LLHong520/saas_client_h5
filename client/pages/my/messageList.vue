<template>
  <section class="container">
    <m-header title="我的消息"></m-header>
    <div class="box_wrapper">
      <ul class="mesList">
        <li v-for="(item,index) in mesList" :key="index" @click="setReaded(item.id)">
          <!-- <nuxt-link :to="{path:'?comtyId='+VX_comtyId+'/messageDetail/?businessId='+item.businessId}"> -->
           <nuxt-link :to="{path: '/messageDetail/'+item.replyId,query:{comtyId:VX_comtyId}}">
            <em class="unread"  v-if="!item.readStatus"></em>
            <div class="author">
              <div class="img"><img :src="GET_IMG_URL(item.drDoctorPhoto,'u')" alt=""></div>
              <span class="blue">{{item.senderNickName}}</span>&nbsp;{{getTypeText(item.commentsType)}}
            </div>
            <p class="tit">{{item.msgTitle}}</p>
            <p class="time">{{item.postDate}}</p>
          </nuxt-link>
        </li>
      </ul>
      <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getMessageList" v-if="!isReachEnd"></m-page>
    </div>
    <m-bottom v-if="isReachEnd"></m-bottom>
    <empty v-if="!loading&&mesList.length==0" :isFullScreen="true"></empty>
  </section>
</template>

<script>
import { commonMixin,comtyIdValid} from "~/mixins";
import userService from "~/services/userService.js";
import header from "~/components/header.vue";
import bottom from "~/components/bottom.vue";
import page from "~/components/page.vue";
import empty from "~/components/empty.vue";
export default {
  mixins: [commonMixin,comtyIdValid],
  components: {
    mHeader:header,
    mBottom:bottom,
    mPage:page,
    empty:empty,
  },
  middleware:["checkLogin"],
  async asyncData({route, store, redirect, query}){
    // 检查应用是否开放
    let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

    return {
      PAGE_APP_OBJ,
    };
  },
  data(){
    return {
      mesList:[],
      loading:false,
      isReachEnd:false,
      currentPage:0,
      pageCount:2,
      pageSize:10,
    };
  },
  mounted(){
    this.getMessageList();
  },
  methods:{
    getMessageList(){
      console.log("加载");
      if(this.loading) return;
      this.loading = true;
      let _this=this;
      let data={
        page:_this.currentPage+1,
        size:_this.pageSize,
      };
      userService.getMessageList(data)
        .then((res)=>{
          _this.loading = false;
          if(res.status==200){
            _this.mesList = _this.mesList.concat(res.data);
            _this.currentPage=_this.currentPage+1;
            _this.pageCount=Math.ceil(res.total/_this.pageSize);
            if(_this.currentPage+1>_this.pageCount){
              _this.isReachEnd=true;
            }else{
              _this.isReachEnd=false;
            }
          }
        }).catch(()=>{
          _this.loading = false;
        });
    },
    getTypeText(commentsType){
      let text = "";
      switch (commentsType) {
        case "91":
          text = "评论了你的帖子";
          break;
        case "92":
          text = "回复了你在该帖子下的评论";
          break;

        default:
          break;
      }
      return text;
    },
    setReaded(msgId){
      userService.setMessageReaded({
        msgId:msgId,
        readStatus:true,
        showType:0,
      })
        .then(((res)=>{
          if(res.status==200){
            this.isReaded=1;
          }
        }));
    }
  },
  head(){
    return {
      title: "我的消息",
    };
  }
};
</script>

<style lang="less" scoped>
.mesList{
  padding-left: 19px;
  margin-right: -15px;
  position: relative;
  line-height: 22px;
  li{
    border-bottom: 1px solid #EFEFEF;
    padding-left: 8px;
  }
  li:last-child{
    border-bottom: 0;
  }
  a{
    color: #282828;
    position: relative;
    padding: 15px 35px 15px 0;
    display: block;
  }
  .unread{
    position: absolute;
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background:#EB1C1D;
    right: 15px;
    top: 25px;
  }
  .author{
    font-size: 12px;
    .blue{
      color: #2688FC;
    }
  }
  .img{
    width: 22px;
    height: 22px;
    margin-right: 8px;
    margin-left: -30px;
    position: relative;
    float:left;
    background-color: #f8f8f8;
    border-radius: 22px;
    img{
      background-color: #f8f8f8;
      border-radius: 22px;
      width: 22px;
      height: 22px;
    }
  }
  .tit{
    font-size: 15px;
    font-weight: bold;
    padding-top: 10px;
  }
  .time{
    color: #999;
    font-size: 12px;
    padding-top: 10px;
  }
}
</style>
