<template>
  <section class="container">
    <m-header :title="userInfo.nickName"></m-header>
    <div class="user_card">
      <div class="img"><img :src="GET_IMG_URL(userInfo.headPicUrl,'u')" alt=""></div>
      <div class="info">
        <span class="name">{{userInfo.nickName}}</span>
        <em class="male" v-if="userInfo.gender===1"></em>
        <em class="female" v-if="userInfo.gender===2"></em>
      </div>
    </div>

    <!-- 动态列表 -->
    <div class="box_wrapper mt10">
      <div class="common_hd">
        <h3>最新动态</h3>
        <nuxt-link class="toMore" :to="{path:'/users/newsList/'+userId}"></nuxt-link>
      </div>
      <div v-if="newsList.length > 0" class="news_list">
        <ul>
          <li v-for="(item,index) in newsList" :key="index" v-if="index<2">
            <nuxt-link v-if="item.module=='帖子'" :to="{path:'/tieba/'+item.node}">
              <em></em> {{item.behaviorCN}}了 {{item.module}} 《{{item.order}}》
            </nuxt-link>
            <nuxt-link v-if="item.module=='专题'" :to="{path:'/subjects/'+item.node}">
              <em></em> {{item.behaviorCN}}了 {{item.module}} 《{{item.order}}》
            </nuxt-link>
            <nuxt-link v-if="item.module=='文章'" :to="{path:'/article/'+item.node}">
              <em></em> {{item.behaviorCN}}了 {{item.module}} 《{{item.order}}》
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 动态列表 end-->

    <!-- 相关帖子列表 -->
    <div class="box_wrapper mt10">
      <div class="common_hd">
        <h3>帖子 {{postNum}}</h3>
      </div>
      <ul class="postList">
        <li v-for="(item,index) in postList" :key="index">
          <nuxt-link :to="{path:'/tieba/'+item.id}">
            <div class="author_bar">{{item.time.split(' ')[0]}}</div>
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
    <empty v-if="!loading&&postList.length==0"></empty>
    <m-bottom v-if="isReachEnd&&postList.length>0"></m-bottom>
    <!-- 相关帖子列表 -->
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import empty from "~/components/empty.vue";
  import userService from "~/services/userService.js";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
    },
    async asyncData({ route, redirect, store, query ,error}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

      // 获取用户信息
      let userInfo = {};
      let res = await userService.getUserinfo({ userId: route.params.id });

      if (res.status == 200 && res.data) {
        userInfo = res.data;
      } else {
        error({
          statusCode: 704,
          message: "用户不存在"
        });
        return;
      }

      return {
        comtyInfo,
        PAGE_APP_OBJ,
        userInfo
      };
    },
    data() {
      return {
        userId: 0,
        userInfo: {
          nickName: "--",
          headPicUrl: "",
          gender: 1,
        },
        newsList: [],
        postList: [],
        postNum: 0,
        loading: false,
        loadTxt: "查看更多",
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    created() {
      this.userId = this.$route.params.id;
      // this.getUserinfo();
      this.getUserDynamicList();
      this.getUserPostList();
    },
    methods: {
      /*getUserinfo() {
        let _this = this;
        let data = {
          userId: _this.userId
        };
        userService.getUserinfo(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              this.userInfo = res.data;
            } else {
              /!*this.$router.replace({
                path: "/notFound",
                query: {
                  statusCode: 404,
                  message: "用户不存在"
                }
              });*!/
              let link = `/notFound?statusCode=404&message=用户不存在&comtyId=${ this.VX_comtyId }`;
              window.location.replace(link);
              return;
            }
          }));
      },*/
      getUserPostList() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let data = {
          page: this.currentPage + 1,
          size: this.pageSize,
          userId: this.userId
        };
        userService.getUserPostList(data)
          .then((res) => {
            _this.loading = false;
            if (res.status == 200 && res.data) {
              _this.postNum = res.total;
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
            _this.isReachEnd = true;
          });
      },
      getUserDynamicList() {
        let _this = this;
        let data = {
          page: 1,
          size: 2,
          userId: _this.userId
        };
        data.module = this.GET_PERMISSION_SEARCH();

        userService.getDynamicListByUserId(data)
          .then(((res) => {
            if (res.status == 200) {
              this.newsList = res.data || [];
            }
          }));
      }
    },
    head() {
      return {
        title: this.userInfo.nickName,
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

  .user_card {
    display: flex;
    padding: 20px 15px;
    background-color: #fff;

    .img {
      width: 48px;
      height: 48px;
      margin-right: 10px;

      img {
        display: block;
        width: 48px;
        height: 48px;
        border-radius: 48px;
      }
    }

    .info {
      flex: 1;
      box-flex: 1;
      width: 0;
      font-size: 16px;
      color: #000;
      line-height: 48px;
    }

    .name {
      font-weight: bold;
    }

    em.male,
    em.female {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../assets/images/icon_lady@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      margin-left: 5px;
      top: -2px;
    }

    em.male {
      background-image: url(../../assets/images/icon_man@2x.png);
    }
  }

  .news_list {
    padding: 8px 0;

    li {
      padding-left: 18px;
      background: url(../../assets/images/icon_post@2x.png) no-repeat left center;
      background-size: 10px 13px;
      line-height: 35px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      a {
        color: #282828;
      }
    }
  }

</style>
