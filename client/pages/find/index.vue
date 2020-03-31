<template>
  <section class="container">
    <m-header title="发现" :back_on="false"></m-header>
    <div v-for="(item, index) in onlineList" :key="index" class="find-box">
      <h3 class="title">{{ item.name }}</h3>
      <ul class="find_list">
        <!-- 已上线 -->
        <li v-for="(cItem) in item.children" :key="cItem.posType">
          <a href="javascript:;"  @click="jumpUrl(cItem)">
            <img :src="cItem.icon"/>
            <p>{{ cItem.label }}</p>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import sysService from "~/services/sysService.js";
  import articleService from "~/services/articleService.js";
  import header from "~/components/header.vue";
  import { commonMixin, comtyIdValid } from "~/mixins";

  export default {
    layout: "layout_nav",
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header
    },
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("", { route, redirect, store });

      let appsConfigArr = store.state.permission_list;

      let keyRes = await sysService.getChannelKey({key:"channelNum_" + route.query.comtyId});// 获取产品体验
      let roomRes = await articleService.getCommunityConfig({ key: "consulting_room" });// 获取咨询室
      let setAppOnline = function (posType, params = "") {
        appsConfigArr = appsConfigArr.map( item => {
          if (item.posType == posType) {
            item.isOnline = true;
            item.path += params;
          }
          return item;
        });
      };

      if (keyRes.status == 200 && keyRes.data) {
        setAppOnline(10, keyRes.data);
      }

      if (roomRes.status == 200 && roomRes.data && roomRes.data.value) {
        setAppOnline(9);
      }

      setAppOnline = null;
      return {
        comtyInfo,
        PAGE_APP_OBJ,
        appsConfigArr
      };
    },
    data() {
      return {
        appsConfigArr: []
      };
    },
    computed: {
      onlineList() {
        let arr = [];
        let map = {
          "0": "内容",
          "1": "活动  ",
          "2": "医生服务",
          "3": "其他",
          // "4": "推广",
        };

        Object.values(map).forEach( (item, index) => {
          arr.push({
            type: index,
            name: item,
            children: this.appsConfigArr.filter( a => {
              // 筛选开启应用、非调查问卷
              return a.appType == index && a.pagePermission && a.isOnline;
            })
          });
        });

        arr = arr.filter( a => { return a.children.length > 0; });
        return arr;
      },
    },
    mounted(){
      $("body").eq(0).css({"background-color":"#fff","height":"100%"});
    },
    methods: {
      jumpUrl(item) {
        if (!item.isOnline) {
          this.$toast.tip("敬请期待新功能");
          return;
        }

        if(item.path.indexOf("http")>=0){
          window.location.href = item.path;
        }else{
          this.$router.push({
            path: item.path
          });
        }
      },
    },
    destroyed(){
      $("body").eq(0).css({"background-color":"#F2F5F8","height":"100%"});
    },
    head() {
      return {
        title: "发现",
      };
    }
  };

</script>
<style lang="less" scoped>
  .container {
    // position: fixed;
    width: 100%;
    height: 100%;
    min-height: 600px;
    left: 0;
    top: 0;
    background-color: #fff;
  }

  .find-box {
    & + .find-box {
      .title {
        border-top: 1px solid #EFEFEF;
      }
    }
  }

  .title {
    margin: 0 15px;
    margin-bottom: 15px;
    padding-top: 18px;
    font-size: 15px;
    font-weight: bold;
  }

  .find_list {
    /*padding-top: 10px;*/
    overflow: auto;
  }

  .find_list li {
    float: left;
    width: 25%;
    text-align: center;
    line-height: 20px;
    margin-bottom: 20px;

    p {
      margin-top: -5px;
    }

    a {
      display: block;
      font-size: 12px;
      color: #282828;
      position: relative;
    }

    img {
      display: block;
      width: 48px;
      height: 48px;
      margin: 4px auto 12px;
      border-radius: 50%;
      box-shadow: 0px 4px 8px 0px rgba(0,144,255,0.26);
    }

    em.icon_unopen {
      display: block;
      width: 57px;
      height: 24px;
      background: url(../../assets/images/tag_expect@2x.png) no-repeat;
      background-size: 57px 24px;
      position: absolute;
      left: 50%;
      top: 1px;
      margin-left: -12px;
    }
  }

</style>
