<template>
  <section class="container">
    <m-header
      :title="hackDoctorName + '主页'"
      :isSuspension="true"
      readMoreLink="/doctors"
    ></m-header>
    <!-- 医生card -->
    <div class="doc_card">
      <div class="doc_info">
        <div class="img"><img :src="GET_IMG_URL(doctorInfo.headPicUrl,'doc')" alt=""></div>
        <dl>
          <dt><span class="name">{{doctorInfo.customerName}}</span>&nbsp;&nbsp;{{doctorInfo.title}}</dt>
          <dd class="singleLine">{{doctorInfo.depName}}&nbsp;&nbsp;{{doctorInfo.hospital}}</dd>
        </dl>
        <div class="btn_detail">
          <nuxt-link :to="{path:'/doctors/doctorInfo/'+pid}">详细介绍</nuxt-link>
        </div>
      </div>
      <p class="goodat">擅长领域：{{doctorInfo.expertiseArea}}</p>
      <p class="honor">荣誉头衔：{{doctorInfo.honor||"荣誉头衔"}}</p>
      <div class="toDoctorPage">
        <a :href="'https://health.sina.cn/zt/doc/'+pid">前往{{ hackDoctorName }}互联网个人品牌诊室</a>
      </div>
    </div>
    <!-- 医生card end -->

    <!-- 动态列表 -->
    <div class="box_wrapper mt10" v-if="newsList.length>0">
      <div class="common_hd">
        <h3>最新动态</h3>
        <nuxt-link class="toMore" :to="{path:'/doctors/newsList/'+pid}"></nuxt-link>
      </div>
      <div class="news_list">
        <ul>
          <li v-for="(item,index) in newsList" :key="index">
            <nuxt-link v-if="item.module=='帖子'" :to="{path:'/tieba/'+item.node}">
              <em></em>{{item.behaviorCN}}了 {{item.module}} 《{{item.order}}》
            </nuxt-link>
            <nuxt-link v-if="item.module=='专题'" :to="{path:'/subjects/'+item.node}">
              <em></em>{{item.behaviorCN}}了 {{item.module}} 《{{item.order}}》
            </nuxt-link>
            <nuxt-link v-if="item.module=='文章'" :to="{path:'/article/'+item.node}">
              <em></em> {{item.behaviorCN}}了 {{item.module}} 《{{item.order}}》
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 动态列表 end-->

    <!-- 文章列表&&帖子列表 -->
    <div class="box_wrapper mt10">
      <div class="list_tab">
        <ul>
          <li @click="changeTab(0)" :class="{active:tabIndex===0}">文章&nbsp;{{articleNum}}</li>
          <li  v-if="GET_PAGE_PERMISSION_MODULE('2')" @click="changeTab(1)" :class="{active:tabIndex===1}">帖子&nbsp;{{postNum}}</li>
        </ul>
      </div>
      <div class="list_cont">
        <!-- 文章列表 -->
        <div class="list_item" v-show="tabIndex===0">
          <ul class="articleList">
            <li v-for="(item,index) in articleList" :key="index">
              <nuxt-link :to="{path:'/article/'+item.id}">
                <div class="info">
                  <dl>
                    <dt>{{item.title}}</dt>
                    <dd class="author_bar author_bar_flex">
                      <div class="marks" v-if="item.tags && item.tags.length>0">
                        <span v-for="(mark,index) in item.tags" v-if="index<2" :key="index">{{mark}}</span>
                      </div>
                      <span class="helpNum">{{item.helpNum}}鼓励</span>
                    </dd>
                  </dl>
                </div>
                <div class="img_box"><img :src="GET_IMG_URL(item.coverimg,'article')" alt=""></div>
              </nuxt-link>
            </li>
          </ul>
          <m-page :loading="articlePage.loading" :title="articlePage.loading? '加载中...':'加载更多'" @loadFn="getArticleList"
            v-if="!articlePage.isReachEnd"></m-page>
          <!-- 内容为空 -->
          <empty v-if="!articlePage.loading&&articleList.length==0"></empty>
          <!-- 内容为空 -->
          <m-bottom v-if="articlePage.isReachEnd&&articleList.length>0"></m-bottom>
        </div>
        <!-- 文章列表 end-->
        <!-- 帖子列表 -->
        <div class="list_item" v-show="tabIndex===1">
          <ul class="postList">
            <li v-for="(item,index) in postList" :key="index">
              <nuxt-link :to="{path:'/tieba/'+item.id}">
                <div class="author_bar">
                  <!-- <span class="face"><img :src="GET_IMG_URL(item.userPhoto,'u')" alt=""></span> -->
                  <span class="author_name">{{item.time.split(' ')[0]}}</span>
                  <!-- <span class="time">{{item.time.split(' ')[0]}}</span> -->
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
          <m-page :loading="postPage.loading" :title="postPage.loading? '加载中...':'加载更多'" @loadFn="getPostList" v-if="!postPage.isReachEnd"></m-page>
          <!-- 内容为空 -->
          <empty v-if="!postPage.loading&&postList.length==0"></empty>
          <!-- 内容为空 -->
          <m-bottom v-if="postPage.isReachEnd&&postList.length>0"></m-bottom>
        </div>
        <!-- 帖子列表 end -->
      </div>
    </div>
    <!-- 文章列表&&帖子列表 end -->
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid, hackMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import empty from "~/components/empty.vue";
  import doctorService from "~/services/doctorService.js";
  import userService from "~/services/userService.js";

  export default {
    mixins: [commonMixin, hackMixin],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
    },
    data() {
      return {
        tabIndex: 0,
        pid: 0,
        doctorInfo: {
          headPicUrl: "--",
          customerName: "--",
          title: "--",
          roomName: "--",
          depName: "--",
          expertiseArea: "--",
          honorTitle: "--",
        },
        newsList: [],
        articleList: [],
        postList: [],
        articleNum: "",
        postNum: "",
        articlePage: {
          currentPage: 0,
          isReachEnd: false,
          pageCount: 2,
          pageSize: 10,
        },
        postPage: {
          currentPage: 0,
          isReachEnd: false,
          pageCount: 2,
          pageSize: 10,
        }
      };
    },
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("", { route, redirect, store });

      // 获取医生信息
      let doctorInfo = {};
      let res = await doctorService.docInfo({ docId: route.params.id });

      let hackName = hackMixin.methods.checkHackComtyID(query);

      if (res.status == 200 && res.data) {
        doctorInfo = res.data;
      }else{
        return redirect({
          path:"/notFound",
          query:{
            statusCode:404,
            message: hackName + "不存在"
          }
        });
      }

      return {
        pid:route.params.id,
        doctorInfo,
        comtyInfo,
        PAGE_APP_OBJ,
        title: doctorInfo.customerName
      };

    },
    created() {
      this.loadDocInfo();
      this.getDynamicListByUserId();
      this.getArticleList();

      if (this.GET_PAGE_PERMISSION_MODULE("2")) {
        this.getPostList();
      }
    },
    mounted(){
      this.addUserOperationRecord({
        operationType:0,
        objType:3,
        objTitle:this.doctorInfo.customerName
      });
      this.dataPvUvcollect({
        businessType:"doctor",
        collectType: "cmty_h5_doc_index",
        businessId: this.pid
      });
    },
    methods: {
      loadDocInfo() {
        let _this = this;
        let data = {
          docId: _this.pid
        };
        doctorService.docInfo(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              _this.doctorInfo = res.data;
              console.log(res.data);
            } else {
              _this.$router.replace({
                path:"/notFound",
                query:{
                  statusCode:404,
                  message: _this.hackDoctorName + "不存在"
                }
              });
            }
          }));
      },
      getDynamicListByUserId() { //动态信息
        let data = {
          userId: this.pid,
          page: 1,
          size: 2,
        };
        data.module = this.GET_PERMISSION_SEARCH();

        userService.getDynamicListByUserId(data)
          .then(((res) => {
            if (res.status == 200) {
              this.newsList = res.data;
            }
          }));
      },
      getArticleList() { //他的文章列表
        if (this.articlePage.loading) return;
        this.articlePage.loading = true;
        let _this = this;
        let data = {
          docId: _this.pid,
          page: _this.articlePage.currentPage + 1,
          size: _this.articlePage.pageSize,
        };
        doctorService.docArticleList(data)
          .then((res) => {
            _this.articlePage.loading = false;
            if (res.status == 200 && res.data) {
              _this.articleNum = res.total;
              _this.articleList = _this.articleList.concat(res.data);
              _this.articlePage.currentPage = _this.articlePage.currentPage + 1;
              let total = res.total||0;
              _this.articlePage.pageCount = Math.ceil(total / _this.articlePage.pageSize);
              if (_this.articlePage.currentPage + 1 > _this.articlePage.pageCount) {
                _this.articlePage.isReachEnd = true;
              } else {
                _this.articlePage.isReachEnd = false;
              }
            }else{
              _this.articlePage.isReachEnd = true;
            }
          }).catch(() => {
            _this.articlePage.isReachEnd = true;
            _this.articlePage.loading = false;
          });
      },
      getPostList() {
        //他的帖子列表
        if (this.postPage.loading) return;
        this.postPage.loading = true;
        let _this = this;
        let data = {
          userId: _this.pid,
          page: _this.postPage.currentPage + 1,
          size: _this.postPage.pageSize,
        };
        userService.getUserPostList(data)
          .then((res) => {
            _this.postPage.loading = false;
            if (res.status == 200 && res.data) {
              _this.postNum = res.total;
              _this.postList = _this.postList.concat(res.data);
              _this.postPage.currentPage = _this.postPage.currentPage + 1;
              _this.postPage.pageCount = Math.ceil(res.total / _this.postPage.pageSize);
              if (_this.postPage.currentPage + 1 > _this.postPage.pageCount) {
                _this.postPage.isReachEnd = true;
              } else {
                _this.postPage.isReachEnd = false;
              }
            } else {
              _this.postPage.isReachEnd = true;
            }
          }).catch(() => {
            _this.postPage.loading = false;
          });
      },
      changeTab(index) { //切换tab
        this.tabIndex = index;
      }
    },
    head() {
      return {
        title: `${this.title}-${this.comtyInfo.comtyName}`,
        meta: [
          {
            name: "keywords",
            content: this.doctorInfo.hospital + "，"+ this.doctorInfo.customerName +"，" + this.doctorInfo.depName
          },
          {
            hid: "description",
            name: "description",
            content: `${this.doctorInfo.customerName}，${this.doctorInfo.hospital}，${this.doctorInfo.depName}，${this.doctorInfo.title}，${this.doctorInfo.honor}，${this.doctorInfo.expertiseArea}，找${this.doctorInfo.customerName}${ this.hackDoctorName }怎么样,好不好`
          }
        ],
        link: [
          {
            rel: "icon",
            type: "image/x-icon",
            href: this.doctorInfo.headPicUrl
          }
        ]
      };
    },
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";

  .doc_card {
    background-color: #fff;
    padding-top: 20px;

    .doc_info {
      display: flex;
      padding: 0 15px;

      .img {
        width: 48px;
        height: 48px;
        border-radius: 48px;
        background-color: #f2f2f2;
        margin-right: 11px;
      }

      .img img {
        display: block;
        width: 48px;
        height: 48px;
        border-radius: 48px;
      }

      dl {
        flex: 1;
        box-flex: 1;
        font-size: 12px;
        line-height: 20px;
        padding-top: 4px;
        width: 0;
      }

      dd {
        color: #666;
      }

      .name {
        font-size: 16px;
        font-weight: 700;
      }

      .btn_detail {
        margin-left: 30px;

        a {
          display: block;
          width: 72px;
          height: 30px;
          border: 1px solid #2688FC;
          font-size: 12px;
          color: #2688FC;
          text-align: center;
          line-height: 28px;
          border-radius: 15px;
        }
      }
    }

    .goodat,
    .honor {
      padding: 12px 15px 0;
      color: #999;
      line-height: 19px;
      font-size: 12px;
    }

    .toDoctorPage {
      line-height: 50px;
      padding: 0 15px;
      padding-right: 10px;
      border-top: 1px solid #EFEFEF;
      margin-top: 15px;

      a {
        display: block;
        font-size: 14px;
        color: #282828;
        padding-left: 32px;
        background: url(../../assets/images/btn_enter@2x.png) no-repeat right center, url(../../assets/images/doctor_icon_brand@2x.png) no-repeat left center;
        background-size: 20px 20px, 22px 22px;
      }
    }
  }

  .news_list {
    padding: 8px 0;
    a{
      color: #333;
    }

    li {
      padding-left: 18px;
      background: url(../../assets/images/icon_post@2x.png) no-repeat left center;
      background-size: 10px 13px;
      line-height: 35px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .articleList li .helpNum {
    float: left;
  }

</style>
