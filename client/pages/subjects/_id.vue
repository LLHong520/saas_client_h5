<template>
  <section class="container">
    <m-header
      :title="PAGE_APP_OBJ.label + '_专题详情'"
      :share_on="true"
      :isSuspension="true"
      readMoreLink="/subjects"
      @shareFn="onShare(false)"
    ></m-header>

    <!-- 专题封面&&标题 -->
    <div class="subject_banner">
      <img :src="GET_IMG_URL(subjectInfo.coverUrl)" width="100%" alt="">
      <div class="tit_shadow"></div>
      <p class="tit">{{subjectInfo.title}}</p>
    </div>
    <!-- 专题封面&&标题 end -->

    <div class="box_wrapper">
      <div class="subject_content" v-html="subjectInfo.introduce"></div>
      <!--专题内容-->
      <!-- 文章列表 -->
      <div class="list_wrapper" v-if="articleList.length>0">
        <ul class="articleList">
          <li v-for="(item,index) in articleList" :key="index">
            <nuxt-link :to="{path:'/article/'+item.id}">
              <div class="info">
                <dl>
                  <dt>{{item.title}}</dt>
                  <dd class="author_bar">
                    <span class="face"><img :src="GET_IMG_URL(item.headImg,'u')" alt=""></span>
                    <span class="author_name">{{item.auhorName}}</span>
                    <span class="helpNum">{{item.helpNum}}鼓励</span>
                  </dd>
                </dl>
              </div>
              <div class="img_box"><img :src="GET_IMG_URL(item.coverimg,'article')" alt=""></div>
            </nuxt-link>
          </li>
        </ul>
        <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="subjectArticleList" v-if="!isReachEnd"></m-page>
        <!-- <m-bottom title="没有更多了" :inline="true" v-if="isReachEnd"></m-bottom> -->
      </div>
      <!-- 文章列表end -->
    </div>

    <!-- 相关专题 -->
    <div class="box_wrapper mt10" v-if="subjectList.length>0">
      <div class="common_hd">
        <h3>相关专题</h3>
      </div>
      <div class="relativeSubject">
        <ul>
          <li v-for="(item,index) in subjectList" :key="index">
            <nuxt-link :to="{path:'/subjects/'+item.id}">
              <div class="img"><img :src="GET_IMG_URL(item.coverUrl)" alt=""></div>
              <p>{{item.title}}</p>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 相关专题 end -->

    <!-- 相关帖子列表 -->
    <div class="box_wrapper mt10" v-if="postList.length>0 && $store.getters.getCurrPermission('2')">
      <div class="common_hd">
        <h3>相关帖子</h3>
        <nuxt-link :to="{path:'/tieba'}" class="toMore"></nuxt-link>
      </div>
      <ul class="postList">
        <li v-for="(item,index) in postList" :key="index">
          <nuxt-link :to="{path:'/tieba/'+item.id}">
            <div class="author_bar">
              <span class="face"><img :src="GET_IMG_URL(item.userPhoto,'u')" alt=""></span>
              <span class="author_name">{{item.userName}}</span>
              <span class="time">{{item.publishTime}}</span>
            </div>
            <div class="post_tit">{{item.title}}</div>
            <div class="post_footer">
              <div class="marks">
                <span v-for="(mark,index) in item.postTags" :key="index">{{mark}}</span>
              </div>
              <div class="replyNum">{{item.replyNum}}评论</div>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
    <!-- 相关帖子列表 end-->
    <m-bottom></m-bottom>

    <!-- 分享 -->
    <m-share :show.sync="isShare" :config="shareConfig"></m-share>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import page from "~/components/page.vue";
  import bottom from "~/components/bottom.vue";
  import subjectService from "~/services/subjectService.js";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin],
    async asyncData({ route, redirect,store,query}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("1", { route, redirect, store });

      let data = {
        subjectId: route.params.id
      };
      let subjectInfoRes = await subjectService.subjectInfo(data);
      let subjectInfo = null;
      if(subjectInfoRes.status == 200 && subjectInfoRes.data){
        subjectInfo = subjectInfoRes.data;
      }else{
        return redirect("/notFound",{
          backNum:-2,
          statusCode:404,
          message:"专题已删除"
        });
      }


      return {
        pid: route.params.id,
        comtyInfo,
        PAGE_APP_OBJ,
        subjectInfo,
      };
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        pid: 0,
        subjectInfo: {
          title: "",
          content: "",
          banner: "",
        },
        authorInfo: {
          authorName: "",
          authorTitle: "",
          authorHospital: "",
          authorGoodAt: "",
          authorDepartName: ""
        },
        postList: [],
        articleList: [],
        subjectList: [],
        loading: false,
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      mShare: share
    },
    created() {
      // this.loadSubjectInfo();
      this.subjectPostList();
      this.subjectArticleList();
      this.relativeSubjects();
      this.onShare(true);
    },
    mounted() {
      this.addUserOperationRecord({
        operationType:0,
        objType:5,
        objTitle:this.subjectInfo.title
      });
      this.dataPvUvcollect({
        businessType:"subject",
        collectType: "sub_det_read",
        businessId: this.pid
      });
    },
    methods: {
      loadSubjectInfo() {
        let _this = this;
        let data = {
          subjectId: _this.pid
        };
        subjectService.subjectInfo(data)
          .then((res) => {
            if (res.status == 200 &&res.data) {
              _this.subjectInfo = res.data;
            }else{
              _this.$router.replace({
                path:"/notFound",
                query:{
                  backNum:-2,
                  statusCode:404,
                  message:"专题已删除"
                }
              });
            }
          });
      },
      subjectArticleList() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let data = {
          page: _this.currentPage + 1,
          size: _this.pageSize,
          subjectId: _this.pid
        };
        subjectService.subjectArticleList(data)
          .then((res) => {
            _this.loading = false;
            if (res.status == 200 && res.data) {
              _this.articleList = _this.articleList.concat(res.data);
              _this.currentPage = _this.currentPage + 1;
              _this.pageCount = Math.ceil(res.total / _this.pageSize);
              if (_this.currentPage + 1 > _this.pageCount) {
                _this.isReachEnd = true;
              } else {
                _this.isReachEnd = false;
              }
            } else {
              _this.isReachEnd = true;
            }
          }).catch(() => {
            _this.loading = false;
          });
      },
      subjectPostList() {
        let _this = this;
        let data = {
          page:1,
          size:10,
          subjectId: _this.pid
        };
        subjectService.subjectPostList(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              this.postList = res.data;
            }
          }));
      },
      relativeSubjects() {
        let _this = this;
        let data = {
          subjectId: _this.pid
        };
        subjectService.relativeSubjects(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              this.subjectList = res.data;
            }
          }));
      },
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }
        this.shareConfig = {
          id: this.pid,
          type: "subject",
          title: this.subjectInfo.title,
          content: this.subjectInfo.introduce,
          imgUrl: this.subjectInfo.coverUrl
        };
      }
    },
    head() {
      return {
        title: `${this.subjectInfo.title}_${this.subjectInfo.classifyName}_${this.comtyInfo.comtyName}`,
        meta: [
          {
            name: "keywords",
            content: this.subjectInfo.classifyName
          },
          {
            hid: "description",
            name: "description",
            content: this.subjectInfo.introduce
          }
        ],
      };
    }
  };

</script>

<style scoped>
  @import "~/assets/css/list.css";

  .subject_banner {
    position: relative;
  }

  .subject_banner img {
    display: block;
    min-height: 200px;
    background-color: #f8f8f8;
  }
  .subject_banner .tit_shadow{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    opacity:0.6999;
  }
  .subject_banner .tit {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 15px;
    font-size: 17px;
    color: #fff;
    line-height: 23px;
  }

  .subject_content {
    background-color: #fff;
    padding: 15px 0;
    border-bottom: 1px solid #EFEFEF;
    font-size: 14px;
    line-height: 24px;
    color: #000;
  }

</style>
