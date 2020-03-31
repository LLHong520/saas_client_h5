<template>
  <section class="container">
    <m-header title="我的帖子"></m-header>
    <!-- 相关帖子列表 -->
    <div class="box_wrapper">
      <ul class="postList">
        <li v-for="(item,index) in postList" :key="index">
          <nuxt-link :to="{path:'/tieba/'+item.id}">
            <div class="author_bar">
              {{item.time.split(' ')[0]}}
            </div>
            <div class="post_tit">{{item.title}}</div>
            <div class="post_footer">
              <div class="marks">
                <span v-for="(mark,index) in item.tags" :key="index">{{mark.name}}</span>
              </div>
              <div class="replyNum">{{item.replyNum}}评论</div>
            </div>
          </nuxt-link>
        </li>
      </ul>
      <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getUserPostList" v-if="!isReachEnd"></m-page>
    </div>
    <empty v-if="!loading&&postList.length==0" :isFullScreen="true"></empty>
    <m-bottom v-if="isReachEnd&&postList.length>0"></m-bottom>
    <!-- 相关帖子列表 -->
  </section>
</template>

<script>
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import empty from "~/components/empty.vue";
  import {
    commonMixin,
    comtyIdValid
  } from "~/mixins";
  import userService from "~/services/userService.js";
  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
    },
    middleware: ["checkLogin"],
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

      return {
        comtyInfo,
        PAGE_APP_OBJ,
      };
    },
    data() {
      return {
        postList: [],
        loading: false,
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    mounted() {
      this.getUserPostList();
    },
    methods: {
      getUserPostList() {
        console.log("加载");
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let data = {
          userId: _this.VX_userInfo.id,
          page: _this.currentPage + 1,
          size: _this.pageSize,
          userType:"myInfo"
        };
        userService.getUserPostList(data)
          .then((res) => {
            _this.loading = false;
            if (res.status == 200 && res.data) {
              _this.postList = _this.postList.concat(res.data);
              _this.currentPage = _this.currentPage + 1;
              _this.pageCount = Math.ceil(res.total / _this.pageSize);
              if (_this.currentPage + 1 > _this.pageCount) {
                _this.isReachEnd = true;
              } else {
                _this.isReachEnd = false;
              }
            }
          }).catch(() => {
            _this.loading = false;
          });

      }
    },
    head() {
      return {
        title: "我的帖子",
      };
    }
  };

</script>

<style scoped>
  @import "~/assets/css/list.css";
  .postList .post_footer .marks{
    width: auto;
    flex: inherit;
  }
</style>
