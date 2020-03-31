<template>
  <section class="container">
    <m-header title="动态信息"></m-header>
    <div class="box_wrapper">
      <ul class="desc_list">
        <li v-for="(item,index) in newsList" :key="index">
          <template v-if="item.module=='帖子'">
            <p class="desc"><em class="icon_desc"></em>{{item.behaviorCN}}了 {{item.module}}</p>
            <nuxt-link :to="{path:'/tieba/'+item.node}">
              <p class="tit">{{item.order}}</p>
            </nuxt-link>
            <p class="time">{{item.createTime | dateFormat}}</p>
          </template>
          <template v-if="item.module=='文章'">
            <p class="desc"><em class="icon_desc"></em>{{item.behaviorCN}}了 {{item.module}}</p>
            <nuxt-link :to="{path:'/article/'+item.node}">
              <p class="tit">{{item.order}}</p>
            </nuxt-link>
            <p class="time">{{item.createTime | dateFormat}}</p>
          </template>
          <template v-if="item.module=='专题'">
            <p class="desc"><em class="icon_desc"></em>{{item.behaviorCN}}了 {{item.module}}</p>
            <nuxt-link :to="{path:'/subjects/'+item.node}">
              <p class="tit">{{item.order}}</p>
            </nuxt-link>
            <p class="time">{{item.createTime | dateFormat}}</p>
          </template>
        </li>
      </ul>
    </div>
    <m-page :loading="loading" :title="loading?'加载中...':loadTxt" @loadFn="getUserDynamicList" v-if="!isReachEnd"></m-page>
    <empty v-if="!loading && newsList.length==0" :isFullScreen="true"></empty>
    <m-bottom v-if="isReachEnd && newsList.length>0"></m-bottom>
  </section>
</template>

<script>
  import {
    commonMixin
  } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import empty from "~/components/empty.vue";
  import userService from "~/services/userService.js";
  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
    },
    data() {
      return {
        pid: 0,
        newsList: [],
        loading: false,
        loadTxt: "查看更多",
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    created() {
      this.pid = this.$route.params.id;
      this.getUserDynamicList();
    },
    methods: {
      getUserDynamicList() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let data = {
          page: this.currentPage + 1,
          size: this.pageSize,
          userId: _this.pid
        };
        data.module = this.GET_PERMISSION_SEARCH();

        userService.getDynamicListByUserId(data)
          .then((res) => {
            _this.loading = false;
            if (res.status == 200 && res.data) {
              _this.newsList = _this.newsList.concat(res.data);
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
        title: "动态信息",
      };
    }
  };

</script>

<style lang="less" scoped>
  .desc_list {
    padding-left: 18px;

    li {
      border-bottom: 1px solid #EFEFEF;
      line-height: 21px;
      padding: 15px 0;
    }

    li:last-child {
      border-bottom: 0;
    }

    p {
      padding-top: 12px;
      font-size: 12px;
    }

    .tit {
      font-size: 15px;
      color: #282828;
      font-weight: bold;
    }

    .time {
      color: #999;
    }

    .icon_desc {
      display: inline-block;
      width: 10px;
      height: 13px;
      background: url(../../../assets/images/icon_post@2x.png) no-repeat;
      background-size: cover;
      margin: 1px 8px 0 -18px;
    }
  }

</style>
