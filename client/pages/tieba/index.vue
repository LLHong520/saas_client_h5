<template>
  <section class="container">
    <m-header :title="PAGE_APP_OBJ.label" :back_on="false"></m-header>
    <!-- 圈主 -->
    <div class="master" v-if="adminUserByList.length>0">
      <div class="img"><img src="~/assets/images/post_icon_host@2x.png" width="22px" height="22px" alt=""></div>
      <span class="gray">圈主：</span>
      <nuxt-link v-for="(item,index) in adminUserByList" :key="index" class="master_name" :to="{path:'/users/'+item.userId}">
        {{item.userName}}
      </nuxt-link>
    </div>
    <!-- 圈主end -->

    <!-- 用户列表 -->
    <user :postsCount="postsCount"></user>
    <!-- 用户列表end -->

    <!-- 医生委员会 -->
    <div class="box_wrapper mt10" v-if="expertUserList.length>0">
      <div class="common_hd">
        <h3>医生委员会</h3>
        <nuxt-link class="toMore" :to="{path:'/tieba/docList?postBarId='+postBarId}"></nuxt-link>
      </div>
      <div class="docList">
        <ul>
          <li v-for="(item,index) in expertUserList" :key="index">
            <a @click="preventDoctorLink(item, item.drUserId)">
              <div class="img"><img :src="GET_IMG_URL(item.drPhoto,'doc')" alt=""></div>
              <dl>
                <dt>{{item.drUserName}}</dt>
                <dd>{{item.drTitle}}</dd>
              </dl>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 医生委员会end -->

    <div class="post_box">
      <div class="post_tab">
        <ul>
          <li @click="changeTab(0)" :class="{active:tabIndex===0}">全部</li>
          <li @click="changeTab(1)" :class="{active:tabIndex===1}">推荐</li>
          <li @click="changeTab(2)" :class="{active:tabIndex===2}">精华</li>
        </ul>
        <a v-if="postTagsByList.length>0" href="javascript:;" @click="toggleMarks" class="marks_open" :class="{current:marksIsShow}">标签<em></em></a>
      </div>
      <!-- 圈子标签列表 -->
      <div v-if="postTagsByList.length>0" class="marks_box animated fadeIn" v-show="marksIsShow">
        <span @click="chooseTag(index)" v-for="(item,index) in postTagsByList" :key="index" :class="{'active':item.isCheck}">
          {{item.name||""}}
        </span>
      </div>
      <!-- /圈子标签列表 -->
      <ul class="postList">
        <!-- 置顶帖子列表 topPostsList-->
        <li v-show="tabIndex == 0" class="toped" v-for="(item,index) in topPostsList" :key="index">
          <nuxt-link :to="{path:'/tieba/'+item.id}">
            <em class="top">置顶</em>{{item.title}}
          </nuxt-link>
        </li>
        <!-- /置顶帖子列表 -->
        <li v-for="(item) in postList" :key="item.key">
          <nuxt-link :to="{path:'/tieba/'+item.id}">
            <div class="author_bar">
              <span class="face"><img :src="GET_IMG_URL(item.userPhoto,'u')" alt=""></span>
              <span class="author_name">{{item.userName}}
                <span v-if="['1','2','3'].indexOf(item.userType)>=0" class="author_type">
                  <span v-if="item.userType == 2">· <em class="orange">圈主</em></span>
                  <span v-if="['1','3'].indexOf(item.userType)>=0">· <em class="blue">医生</em></span>
                </span>
              </span>
              <span class="time">{{item.publishTime}}</span>
            </div>
            <div class="post_tit">
              <em v-if="item.isRecommend==1" class="icon_recommond"></em>
              <em v-if="item.isEssence==1" class="icon_essence"></em>
              {{item.title}}
            </div>
            <div class="post_footer">
              <div class="cont">
                <!-- 标签 -->
                <div class="marks">
                  <span v-for="(tagItem) in item.postTagsList" :key="tagItem.key">{{tagItem.name | limit(8)}}</span>
                </div>
                <!-- 标签 -->
                <span class="replyNum">{{item.replyCount}}评论</span>
              </div>
              <span v-if="item.userType == 1" class="mark_doc">医</span>
            </div>
          </nuxt-link>
        </li>
        <!-- <li>
          <nuxt-link :to="{path:'/tieba/'+0}">
            <div class="author_bar">
              <span class="face"><img src="~/assets/images/bg_head@2x.png" alt=""></span>
              <span class="author_name">张三<span class="author_type"> · <em class="blue">医生</em></span></span>
              <span class="time">2小时前</span>
            </div>
            <div class="post_tit">
              <em class="icon_recommond"></em>
              <em class="icon_essence"></em>
              你会上厕所吗？上厕所的正确姿势在这里！</div>
            <div class="post_footer">
              <div class="cont">
                <div class="marks">
                  <span>大聪明</span><span>油炸小西米</span>
                </div>
                <span class="replyNum">5评论</span>
              </div>
              <span class="mark_doc">医</span>
            </div>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{path:'/tieba/'+0}">
            <div class="author_bar">
              <span class="face"><img src="~/assets/images/bg_head@2x.png" alt=""></span>
              <span class="author_name">张三</span>
              <span class="time">2小时前</span>
            </div>
            <div class="post_tit">你会上厕所吗？上厕所的正确姿势在这里！</div>
            <div class="post_footer">
              <div class="cont">
                <div class="marks">
                  <span>大聪明</span><span>油炸小西米</span>
                </div>
                <span class="replyNum">5评论</span>
              </div>
            </div>
          </nuxt-link>
        </li> -->
      </ul>
      <m-page :loading="loading" :title="loading?'加载中...':loadTxt" @loadFn="getPostBarPostlist" v-if="!isReachEnd"></m-page>
      <empty v-if="!loading&&postList.length==0"></empty>
      <m-bottom v-if="isReachEnd &&postList.length > 0"></m-bottom>

      <div class="btn_edit">
        <a v-if="!VX_is_login" href="javascript:;" @click.stop="CHECK_LOGIN()"></a>
        <nuxt-link v-else :to="{path:'/tieba/edit', query:{postBarId: postBarId}}"></nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
  import { commonMixin, comtyIdValid } from "~/mixins";
  import empty from "~/components/empty.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import postBarService from "~/services/postBarService.js";
  import header from "~/components/header.vue";
  import user from "~/components/index/user.vue";

  export default {
    watchQuery: true,
    mixins: [commonMixin, comtyIdValid],
    layout: "layout_nav",
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      user,
      empty,
    },
    async asyncData({ route, redirect, store, query, error }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

      let postBarList = await postBarService.getPostBarByList({
        communityId: route.query.comtyId
      }).then((res) => {
        if (res.status == 200 && res.data) {
          return res.data;
        } else {
          return [];
        }
      });

      let postBarId = postBarList.length > 0 ? postBarList[0].id : "";
      if (postBarId == "") {
        error({
          statusCode: 604,
          message: "该社区不存在圈子"
        });
      }
      return {
        comtyInfo,
        PAGE_APP_OBJ,
        postBarId,
        postBarInfo: postBarList[0]
      };
    },
    data() {
      return {
        postBarInfo: {},
        adminUserByList: [],
        postTagsByList: [],
        topPostsList: [],
        expertUserList: [],
        loading: false,
        isReachEnd: false,
        postList: [],
        loadTxt: "查看更多",
        postsCount: 0,
        postBarId: "",
        marksIsShow: false,
        tabIndex: 0,
        postQuery: {
          isTop: null,
          isEssence: null,
          isRecommend: null,
          postTags: [],
          pageIndex: 0,
          pageSize: 10,
        }
      };
    },
    created() {},
    mounted() {
      this.dataPvUvcollect({
        businessType: "post",
        collectType: "cmty_h5_postbar_index",
        businessId: this.postBarId
      });
      postBarService.getPostBarByList({
        communityId: this.$route.query.comtyId
      });
      this.getPostBarInfo();
      this.getPostAdminUserByList();
      this.getPostTagsByList();
      this.getTopPostsList();
      this.getPostsCount();
      this.getPostBarExpertUserByPage();
      this.getPostBarPostlist();
    },
    methods: {
      getPostBarInfo() {
        postBarService.getPostBarInfo({
          postBarId: this.postBarId
        }).then(res => {
          if (res.status == 200) {
            this.postBarInfo = res.data || {};
          }
        });
      },
      getPostAdminUserByList() {
        postBarService.getPostAdminUserByList({
          postBarId: this.postBarId,
          communityId: this.comtyId,
        }).then(res => {
          if (res.status == 200) {
            this.adminUserByList = res.data || [];
          }
        });
      },
      getPostTagsByList() {
        postBarService.getPostTagsByList({
          postBarId: this.postBarId
        }).then(res => {
          if (res.status == 200 && res.data) {
            let array = [];
            res.data.map((item) => {
              array.push({
                ...item,
                isCheck: false
              });
            });
            this.postTagsByList = array;
          }
        });
      },
      getPostsCount() {
        postBarService.getPostsCount({
          postBarId: this.postBarId
        }).then(res => {
          if (res.status == 200) {
            this.postsCount = res.data || 0;
          }
        });
      },
      getTopPostsList() {
        postBarService.getTopPostsList({
          postBarId: this.postBarId,
          limit: 5
        }).then(res => {
          if (res.status == 200) {
            this.topPostsList = res.data || [];
          }
        });
      },
      getPostBarExpertUserByPage() {
        postBarService.getPostBarExpertUserByPage({
          select_key: "createTime",
          select_direction: "asc",
          postBarId: this.postBarId,
          communityId: this.VX_commtyId,
          pageSize: 3,
          pageNum: 1
        }).then(res => {
          if (res.status == 200) {
            this.expertUserList = res.data || [];
          }
        });
      },
      getPostBarPostlist() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let params = {
          postBarId: this.postBarId,
          isTop: this.postQuery.isTop,
          isRecommend: this.postQuery.isRecommend,
          isEssence: this.postQuery.isEssence,
          postTags: this.postQuery.postTags,
          pageNum: this.postQuery.pageIndex + 1,
          pageSize: this.postQuery.pageSize,
        };
        if (this.postQuery.postTags.length == 0) {
          delete params.postTags;
        }
        if (this.postQuery.isTop == 0) {
          delete params.isTop;
        }
        if (this.postQuery.isRecommend == 0) {
          delete params.isRecommend;
        }
        if (this.postQuery.isEssence == 0) {
          delete params.isEssence;
        }
        postBarService.getPostsByPage(params).then(res => {
          _this.loading = false;
          if (res.status == 200) {
            _this.postList = _this.postList.concat(res.data || []);
            _this.postQuery.pageIndex = _this.postQuery.pageIndex + 1;
            _this.pageCount = Math.ceil(res.total / _this.postQuery.pageSize);
            if (_this.postQuery.pageIndex + 1 > _this.pageCount) {
              _this.isReachEnd = true;
            } else {
              _this.isReachEnd = false;
            }
          }
        });
      },
      toggleMarks() {
        this.marksIsShow = !this.marksIsShow;
      },
      changeTab(index) {
        //切换tab
        this.tabIndex = index;
        if (index == 0) {
          this.postQuery.isTop = null;
          this.postQuery.isRecommend = null;
          this.postQuery.isEssence = null;
        } else if (index == 1) {
          this.postQuery.isTop = null;
          this.postQuery.isRecommend = 1;
          this.postQuery.isEssence = null;
        } else if (index == 2) {
          this.postQuery.isTop = null;
          this.postQuery.isRecommend = null;
          this.postQuery.isEssence = 1;
        }
        this.postQuery.pageIndex = 0;
        this.postList = [];
        this.getPostBarPostlist();
      },
      chooseTag(index) {
        this.postTagsByList[index].isCheck = !this.postTagsByList[index].isCheck;
        let checkedTags = [];
        this.postTagsByList.map((item) => {
          if (item.isCheck) {
            checkedTags.push(item.id);
          }
        });
        this.postQuery.postTags = checkedTags;
        this.postQuery.pageIndex = 0;
        this.postList = [];
        this.getPostBarPostlist();
      },
    },
    head() {
      return {
        title: `医疗交流圈_${this.postBarInfo.name}`,
        meta: [
          {
            name: "keywords",
            content: `论坛,交流,${this.postBarInfo.name}`
          },
          {
            hid: "description",
            name: "description",
            content: "专家团队,由大牌专家亲自领衔,专业团队帮您解答问题！专业团队协作,回复更快更全面。"
          }
        ],
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~/assets/css/list.css";
  .show_n_lines(@num) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
  }
  .master {
    line-height: 22px;
    padding: 15px;
    margin: 10px;
    border-radius: 6px;
    background-color: #fff;
    font-size: 14px;
    color: #999;

    .img {
      width: 22px;
      height: 22px;
      margin-right: 10px;
      float: left;
    }

    img {
      display: block;
      width: 22px;
      height: 22px;
      border-radius: 22px;
    }

    .master_name {
      color: #6FB0FD;
      margin: 0 5px;
    }
  }

  .post_box {
    margin-top: 10px;
    background-color: #fff;
  }

  .post_tab {
    height: 51px;
    border-bottom: 1px solid #EFEFEF;

    ul {
      float: left;
    }

    li {
      display: inline-block;
      font-size: 15px;
      font-weight: bold;
      padding: 0 15px;
      line-height: 48px;
    }

    li.active {
      background: url(../../assets/images/current_line.gif) no-repeat center bottom;
    }

    .marks_open {
      float: right;
      font-size: 14px;
      color: #999;
      display: block;
      line-height: 51px;
      margin-right: 15px;

      em {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: url(../../assets/images/btn_down@2x.png) no-repeat;
        background-size: cover;
        margin-left: 8px;
      }
    }

    .current em {
      transform-origin: center center;
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -o-transform: rotate(180deg);
      transition: transform 0.2s;
      -moz-transition: -moz-transform 0.2s;
      -moz-transition: -moz-transform 0.2s;
      -o-transition: -o-transform 0.2s;
      -ms-transition: -ms-transform 0.2s;
    }
  }

  .marks_box {
    padding: 5px 15px 0;
    height: 123px;
    overflow-y: scroll;
    box-shadow: 0 2px 4px rgba(20, 20, 20, .1);

    span {
      display: inline-block;
      padding: 0 8px;
      border: 1px solid #EFF2F7;
      border-radius: 24px;
      margin-right: 10px;
      margin-top: 10px;
      line-height: 24px;
      background-color: #F6F8FB;
      white-space: nowrap;
      font-size: 12px;

      &.active {
        color: #2688FC;
      }
    }
  }

  .postList {
    padding: 0 15px;

    li.toped {
      border-bottom: 1px solid #EFEFEF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      a {
        .show_n_lines(1);
        display: block;
        font-size: 13px;
        color: #282828;
      }

      em.top {
        display: inline-block;
        background-color: #2688FC;
        font-size: 12px;
        color: #fff;
        line-height: 18px;
        padding: 0 4px;
        border-radius: 3px;
        font-style: normal;
        margin-right: 8px;
      }
    }

    .author_type {
      font-size: 12px;

      em {
        font-style: normal;
      }

      .blue {
        color: #2688FC;
      }

      .orange {
        color: #FFBA00;
      }
    }

    .post_footer .marks {
      flex: unset;
      width: auto;
      float: left;
    }

    .post_footer .cont {
      flex: 1;
      box-flex: 1;
      width: 0;
    }

    .mark_doc {
      font-size: 12px;
      width: 18px;
      height: 18px;
      border-radius: 3px;
      border: 1px solid #2688FC;
      color: #2688FC;
      line-height: 16px;
      text-align: center;
      display: block;
      margin-top: 4px;
    }

    .icon_recommond,
    .icon_essence {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url(../../assets/images/post_tag_recomm@2x.png) no-repeat;
      background-size: cover;
      margin-right: 4px;
      position: relative;
      vertical-align: middle;
      top: -2px;
    }

    .icon_essence {
      background-image: url(../../assets/images/post_tag_sift@2x.png);
    }
  }

  .docList {
    border-top: 1px solid #EFEFEF;
    position: relative;
    margin: 0 -15px;
  }

  .docList ul {
    display: flex;
    padding: 15px;

    li {
      flex: 1;
      box-flex: 1;
      overflow: hidden;

      a {
        display: flex;
      }

      .img {
        width: 48px;
        height: 48px;
        border-radius: 48px;
        margin-right: 10px;
        background: #f2f5f8;
      }

      img {
        display: block;
        width: 48px;
        height: 48px;
        border-radius: 48px;
      }

      dl {
        flex: 1;
        box-flex: 1;
        font-size: 11px;
        color: #999;
        left: 22px;
        padding: 2px 0;
        overflow: hidden;
      }

      dt {
        font-size: 14px;
        color: #282828;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      dd {
        font-size: 14px;
        color: #282828;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .btn_edit {
    width: 74px;
    height: 74px;
    box-sizing: border-box;
    padding: 7px 12px 17px 12px;
    position: fixed;
    bottom: 60px;
    right: 0;
    background: url(~@/assets/images/post_btn_new@2x.png) no-repeat;
    background-size: cover;

    a {
      display: block;
      width: 50px;
      height: 50px;
    }
  }

</style>
