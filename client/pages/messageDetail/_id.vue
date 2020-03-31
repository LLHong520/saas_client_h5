<template>
  <section class="container" :class="{'isFixed': replyIsShow}">
    <m-header title="消息详情"></m-header>
    <!-- 帖子详情 -->
    <div class="article_box box_wrapper">
      <!-- 发布文章的用户 -->
      <div class="author_box">
        <a hover-class="none" :href="postInfo.wxLink">
          <div class="img">
            <img :src="GET_IMG_URL(postInfo.userPhoto,'u')" alt="">
          </div>
          <dl>
            <dt>{{postInfo.userName}}</dt>
            <dd>{{postInfo.createTime}}</dd>
          </dl>
        </a>
      </div>
      <!-- 发布文章的用户 -->

      <!-- 文章内容 -->
      <div class="article_cont" >
        <div>{{postInfo.title}}</div>
      </div>
      <!-- 文章内容 end-->
    </div>

    <!-- 新消息回复列表 -->
    <div class="point_box new_message_box">
      <div class="tab_cont">
        <div class="point_list">
          <ul>
            <li v-for="(replyItem, index) in relativeReplyList" :key="index">
              <div class="img">
                <img v-if="replyItem.userPhoto" :src="replyItem.userPhoto" width="40" height="40" alt="" />
                <img v-else src="../../assets/images/default/bg_head@2x.png" alt="">
              </div>
              <div class="info">
                <dl>
                  <dt>
                    <span>
                      <span class="name">{{replyItem.userName}}</span>
                      <span class="author_type" v-if="replyItem.userType == 1||replyItem.userType == 3">   ·   <span class="blue">医生</span></span>
                      <span class="author_type" v-if="replyItem.userType == 2">   ·   <span class="orange">圈主</span></span>
                      <span class="author_type" v-if="replyItem.userId==postInfo.userId">   ·   <span class="orange">楼主</span></span>
                    </span>
                    <!-- <span class="fr icon_delete" @click="deleteReply(replyItem.id, index)"></span> -->
                  </dt>
                </dl>
                <div class="reply_card">
                  <div class="reply_txt">
                    <span>{{replyItem.content}}</span>
                    <span v-if="replyItem.postReply">
                      <span> //</span>
                      <span>
                        <a hover-class="none" class="blue" :href="replyItem.postReply.wxLink">@{{replyItem.postReply.userName}}</a>
                      </span>
                      <span>{{replyItem.postReply.content}}</span>
                    </span>
                  </div>
                  <div class="reply_time">
                    <span>
                      {{replyItem.createTime}}
                      <span class="blue" v-if="index == relativeReplyList.length - 1" @click="showReply(replyItem)">  ·  回复</span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 新消息回复列表 end-->

    <!-- 评论列表 -->
    <div class="point_box">
      <div class="tab_cont">
        <div class="tab_title">
          <span>历史评论</span>
        </div>
        <div class="point_list">
          <ul>
            <li v-for="(replyItem, index) in replyInfo" :key="index">
              <div class="img">
                <img v-if="replyItem.userPhoto" :src="replyItem.userPhoto" width="40" height="40" alt="" />
                <img v-else src="../../assets/images/default/bg_head@2x.png" alt="">
              </div>
              <div class="info">
                <dl>
                  <dt>
                    <span>
                      <span class="name">{{replyItem.userName}}</span>
                      <span class="author_type" v-if="replyItem.userType == 1||replyItem.userType == 3">  ·  <span class="blue">医生</span></span>
                      <span class="author_type" v-if="replyItem.userType == 2">  ·  <span class="orange">圈主</span></span>
                      <span class="author_type" v-if="replyItem.userId==postInfo.userId">  ·  <span class="orange">楼主</span></span>
                    </span>
                    <!-- <span class="fr icon_delete" @click="deleteReply(replyItem.id, index)"></span> -->
                  </dt>
                </dl>
                <div class="reply_card">
                  <div class="reply_txt">
                    <span>{{replyItem.content}}</span>
                    <span v-if="replyItem.postReply">
                      <span> //</span>
                      <!-- <span class="blue">@{{replyItem.postReply.userName}}：</span> -->
                      <span>
                        <a hover-class="none" class="blue" :href="replyItem.postReply.wxLink">@{{replyItem.postReply.userName}}</a>
                      </span>
                      <span>{{replyItem.postReply.content}}</span>
                    </span>
                  </div>
                  <div class="reply_time">
                    <span>{{replyItem.createTime}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 评论列表 end-->

    <div class="shadow" v-if="replyIsShow" @click="replyIsShow=false"></div>
    <div v-if="replyIsShow" class="reply_wrapper">
      <!-- <div class="reply_area">
        <div class="reply_box" v-if="replyIsShow">
          <div class="reply_cont">
            <textarea
              v-model="content"
              :placeholder="replyName!=''? '@' + replyName:''"
              :cursor-spacing="78"
              :fixed="true"
              :show-confirm-bar="false"
              :focus="replyIsShow"
              maxlength="100"
            ></textarea>
            <p class="word_limit">{{"（" + content.length + "/100）"}}</p>
          </div>
          <div class="btn_reply vMiddle">
            <form @submit="showReplyBox" :report-submit="true">
              <button :class="{ 'disabled': replyDisabled }" class="_span" form-type="submit" :plain="true">发送</button>
            </form>-->
            <!-- <span @click="showReplyBox" :class="{ 'disabled': replyDisabled }">发送</span> -->
          <!-- </div>
        </div>
      </div> -->
      <div class="reply_area">
        <!-- <input type="text" class="ipt_reply" @click="showReply" placeholder="发表评论…" v-if="!replyIsShow"> -->
        <div class="reply_box" v-if="replyIsShow">
          <div class="reply_cont">
            <textarea v-model="content" :placeholder="replyName!=''? '@' + replyName:''" maxlength="1000"></textarea>
            <p class="word_limit">{{"（" + content.length + "/1000）"}}</p>
          </div>
          <div class="btn_reply vMiddle">
            <a href="javascript:;" :class="{ disabled: isSubmit }" @click="showReplyBox">{{ isSubmit ? "发送中" : "发送"}}</a>
          </div>
        </div>
      </div>
    </div>


    <!--&lt;!&ndash; 数据为空 &ndash;&gt;
    <empty v-if="isEmpty" :isFullScreen="true"></empty>
    &lt;!&ndash; /数据为空 &ndash;&gt;
    &lt;!&ndash; 数据为空 &ndash;&gt;
    <m-bottom v-if="isReachEnd && replyInfo.length > 0"></m-bottom>-->

    <page-loading
      :loading="loading"
      :end="isReachEnd"
      :isFullScreen="false"
      :empty="replyInfo.length == 0"
      @loadFn="renderMsgPostReplys"
    ></page-loading>

    <!-- 确认弹框 -->
    <!-- <m-confirm
      :isShow="delReplyConfirm.isShow"
      title="删除评论"
      content="是否确定删除评论"
      @confirmFn="confirmDelReply"
      @cancelFn="cancelDelReply"
    >
    </m-confirm> -->
    <!-- 确认弹框 end-->
  </section>
</template>

<script>
  import tools from "@/utils/index.js";
  import userService from "@/services/userService.js";
  import postBarService from "@/services/postBarService.js";
  import {
    commonMixin,
    wxTemplateMsgMixin,
  } from "@/mixins";

  import bottom from "@/components/bottom.vue";
  import empty from "@/components/empty.vue";
  import confirm from "@/components/confirm.vue";
  import pageLoading from "@/components/pageLoading";
  import header from "~/components/header.vue";

  // import wxParse from "mpvue-wxparse";

  export default {
    head(){
      return {
        title: "消息详情",
      };
    },
    mixins: [commonMixin,wxTemplateMsgMixin],
    async asyncData({route, store, redirect, query}){
      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

      return {
        PAGE_APP_OBJ,
      };
    },
    data() {
      return {
        isSubmit: false,
        businessId: "",

        postInfo: {},
        relativeReplyList: [],
        replyInfo: [],

        relativeReplySize: 1000,
        relativeReplyPage: 1,

        replyData: "",
        replyIsShow: false,
        content: "",
        replyName: "",
        replyParentId: "",
        postsId: "",
        pathShare: "",

        loading: false,
        currentPage: 0,
        pageCount: 1,
        pageSize: 10,
      };
    },
    components: {
      mHeader:header,
      mBottom: bottom,
      empty: empty,
      mConfirm: confirm,
      pageLoading,
      // wxParse,
    },

    computed: {
      replyDisabled() {
        return tools.isEmpty(this.content);
      },
      isEmpty() {
        return !this.loading && JSON.stringify(this.postInfo) == "{}";
      },
      isReachEnd() {
        return this.currentPage >= this.pageCount;
      }
      /*realUserCenterLink(){
        //医生跳转医生主页 用户跳转用户主页
        let userId = this.postInfo.userId;
        let link = ["0", "2"].indexOf(this.postInfo.userType) >= 0 ? `/pages/user_others/main?id=${userId}` : `/pages/doctor/info/main?id=${userId}`;
        return link;
      },*/
    },
    mounted() {
      this.init();
    },
    onShow() {
      if (this.$store.state.tabParams.length != 0) {
        // 重置data
        Object.assign(this.$data, this.$options.data());

        // 刷新列表
        this.init();
      }
    },

    onReachBottom() {
      if(!this.isReachEnd && !this.loading) {
        this.renderMsgPostReplys();
      }
    },

    methods: {
      init() {
        this.businessId = this.$route.params.id;

        if (this.businessId == "undefined") {
          return;
        }

        this.renderMsgPost();
        this.renderRelativeReply();
        this.renderMsgPostReplys();
      },
      realUserCenterLink(data){
        //医生跳转医生主页 用户跳转用户主页
        let userId = data.userId;
        let comtyId = data.communityId;
        let link = ["0", "2"].indexOf(data.userType) >= 0
          ? `/users/${userId}/?comtyId=${comtyId}`
          : `/doctors/${userId}/?comtyId=${comtyId}`;

        data.wxLink = link;
        return data;
      },
      replyLink(arr) {
        // 评论回复，用户主页链接
        if (!arr || arr.length == 0) { return []; }
        return arr.map( item => {
          if (item.postReply) {
            item.postReply = this.realUserCenterLink(item.postReply);
          }
          return item;
        });
      },
      showReply(data) {
        this.CHECK_LOGIN();
        this.replyData = data;
        this.replyIsShow = true;
        this.replyName = data.userName || "";
        this.replyParentId = data.id;
        this.postsId = data.postsId;
        this.content = "";
        this.pathShare = `pages/tieba/detail/main?postsId=${this.postsId}&comtyId=${this.VX_comtyId}`;
      },

      //发送评论回复
      // showReplyBox(e) {
      //   //存储用户触发的推送消息id
      //   this.CHECK_LOGIN();
      //   this.saveFormIdByUserId({formId:e.mp.detail.formId});
      //   let content = tools.trim(this.content);
      //   if (tools.isEmpty(content)) {
      //     wx.showToast({
      //       title: "评论不能为空",
      //       icon: "none"
      //     });
      //     return;
      //   };
      //   if (content.length > 100) {
      //     wx.showToast({
      //       title: "内容不能超过100个字哦~",
      //       icon: "none"
      //     });
      //     return;
      //   };
      //   let data = {
      //     orgId: this.VX_orgId,
      //     postBarId: this.postInfo.postBarId,
      //     postsId: this.postsId,
      //     userId: this.VX_userInfo.id,
      //     userName: this.VX_userInfo.nickName,
      //     userPhoto: this.VX_userInfo.headPicUrl,
      //     replyParentId: this.replyParentId,
      //     content: content,
      //   };
      //   postBarService.addPostReply(data).then((res) => {
      //     if (res.status == 200) {
      //       this.replyIsShow = false;
      //       wx.showToast({
      //         title: "评论发表成功~"
      //       });

      //       if (res.data.postReply && res.data.postReply.createTime) {
      //         res.data.postReply.createTime = new Date(res.data.postReply.createTime).getTime();
      //       }

      //       // 发送站内消息
      //       postBarService.sendReplyMsg({
      //         beRepliedId: this.relativeReplyList[this.relativeReplyList.length - 1].userId,
      //         beRepliedPostsOwnerId: this.VX_userInfo.userId,
      //         postReply: res.data,
      //       });

      //       //微信模板消息
      //       let messageData = {
      //         "keyword1": {
      //           "value": res.data.postTitle //评论主题
      //         },
      //         "keyword2": {
      //           "value": this.replyData.content //评论内容
      //         },
      //         "keyword3": {
      //           "value": res.data.content//回复内容
      //         },
      //         "keyword4": {
      //           "value": res.data.userName//评论者
      //         },
      //         "keyword5": {
      //           "value": tools.dateFormat(new Date().getTime())
      //         }
      //       };

      //       this.sendWxMessage(messageData, {
      //         type: 1,
      //         toUserId: this.replyData.userId,
      //         pageUrl: this.pathShare,
      //       });

      //       this.renderRelativeReply();
      //     } else {
      //       wx.showToast({
      //         title: "评论发表失败~",
      //         icon: "none"
      //       });
      //     }
      //   });
      // },

      showReplyBox() {
        if (!this.CHECK_LOGIN()) {
          return;
        }

        if(this.isSubmit) { return; }

        let content = tools.trim(this.content);

        if (tools.isEmpty(content)) {
          this.$toast.tip("请输入回复内容~");
          return;
        }
        if (content.length > 1000) {
          this.$toast.tip("内容不能超过1000个字哦~");
          return;
        }

        this.isSubmit = true;
        postBarService.addPostReply({
          orgId: this.VX_orgId,
          postBarId: this.postInfo.postBarId,
          postsId: this.postsId,
          userId: this.VX_userInfo.id,
          userName: this.VX_userInfo.nickName,
          userPhoto: this.VX_userInfo.headPicUrl,
          replyParentId: this.replyParentId,
          content: content,
        }).then((res) => {
          this.dataPvUvcollect({
            businessType: "post",
            collectType: "cmty_h5_posts_comment",
            businessId: this.postsId,
            userId: this.VX_userInfo.id,
          });
          if (res.status == 200) {
            this.replyIsShow = false;
            this.$toast.tip("评论发表成功~");
            this.renderRelativeReply();

            postBarService.sendReplyMsg({
              beRepliedId: this.replyData.userId,
              beRepliedPostsOwnerId: this.postInfo.userId,
              postReply: res.data,
            });
          } else {
            this.$toast.tip("评论发表失败~");
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },

      renderMsgPost() {
        let data = {
          businessId: this.businessId,
        };

        userService.getMyMessageDetailPosts(data).then((res) => {
          if(res.status == 200) {
            res.data.createTime = res.data.createTime.slice(0, res.data.createTime.length - 3);
            this.postInfo = this.realUserCenterLink(res.data);
          };
        });
      },

      renderRelativeReply() {
        let data = {
          businessId: this.businessId,
          page: this.relativeReplyPage,
          size: this.relativeReplySize,
        };

        userService.getMyMessageDetailPostsReply(data).then((res) => {
          if(res.status == 200) {
            res.data = res.data.map((item) =>{
              item.createTime = tools.dateFormat(item.createTime);
              return item;
            });
            this.relativeReplyList = this.replyLink(res.data);
          };
        }).catch(() => {
        });
      },

      renderMsgPostReplys() {
        if(this.loading) return;
        this.loading = true;

        let data = {
          businessId: this.businessId,
          page: this.currentPage + 1,
          size: this.pageSize,
        };

        userService.getMyMessageDetailReplys(data).then((res) => {
          this.loading = false;
          if(res.status == 200){
            res.data = res.data.map((item) =>{
              item.createTime = tools.dateFormat(item.createTime);
              return item;
            });
            this.replyInfo = this.replyInfo.concat(this.replyLink(res.data));
            this.currentPage = this.currentPage + 1;
            this.pageCount = Math.ceil(res.total / this.pageSize) || this.currentPage;
          }
        }).finally(() => {
          this.loading = false;
        });
      },
    },
  };

</script>

<style lang="less" scoped>
  .show_n_lines(@num) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    line-clamp: @num;
    -webkit-box-orient: vertical;
  }

  /deep/.header h2 {
    padding: 0 75px;
  }

  .blank50 {
    height: 50px;
  }

  .blank103 {
    height: 103px;
  }

  .shadow {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 997;
  }

  .icon_delete {
    display: block;
    width: 14px;
    height: 15px;
    background: url("../../assets/images/btn_icon_delect@2x.png") no-repeat;
    background-size: 100% 100%;
  }

  .reply_wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    max-width: 760px;
    background-color: #fff;
    color: #2688FC;
    box-shadow: 0 0 8px #f2f2f2;
    z-index: 998;

    .post_operate {
      padding: 12px 15px 11px 15px;
      font-size: 12px;
      color: #999;

      label,
      .operate_item {
        float: left;
        margin-top: 3px;
        line-height: 22px;
      }

      .operate_item {
        padding: 0 14px;
        border: 1px solid #EFF2F7;
        border-radius: 24px;
        margin-right: 5px;
        background-color: #F6F8FB;
        white-space: nowrap;
        font-size: 12px;
        color: #282828;
        box-sizing: border-box;
      }
      .operate_item_del {
        color: #999999;
      }

      .btn_edit {
        display: block;
        float: right;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        box-sizing: border-box;
        border: 1px solid #EFF2F7;
        background: #F6F8FB url(~@/assets/images/toolbar_icon_edit@2x.png) no-repeat center center;
        background-size: 13px 13px;
      }
    }

    .reply_area {
      padding: 7px 15px;
      border-top: 1px solid #EFEFEF;

      .ipt_reply {
        box-sizing: border-box;
        border: 1px solid #EFEFEF;
        background-color: #F6F8FB;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        width: 100%;
        border-radius: 20px;
      }

      .reply_box {
        display: flex;

        .reply_cont {
          flex: 1;
          width: 0;
          box-sizing: border-box;
          border: 1px solid #EFEFEF;
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 13px;
          color: #282828;

          textarea {
            width: 100%;
            border: 0;
            height: 54px;
            line-height: 18px;
            color: #282828;
            border-radius: 6px;
          }

          .word_limit {
            text-align: right;
            color: #999;
            font-size: 12px;
          }
        }


        .btn_reply {
          ._span {
            display: block;
            color: #2688FC;
            padding: 0 18px;
            line-height: 90px;
            background-color: #fff;
            border: none;
            font-size: 14px;
          }
          a {
            display: block;
            color: #2688FC;
            padding: 0 18px;
            line-height: 90px;
            &.disabled {
              color: #999;
            }
          }
        }
      }
    }
  }

  .article_box {
    padding: 15px;
  }

  .article_tit {
    font-size: 20px;
    color: #2D2D2D;
    line-height: 28px;
  }

  .author_box {
    padding: 12px 0;

    a {
      display: flex;

      .img {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        margin-right: 8px;

        /deep/ img {
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 40px;
          background-color: #f2f2f2;
        }
      }

      dl {
        flex: 1;
        box-flex: 1;
        font-size: 12px;
        color: #999;
        line-height: 20px;
      }

      dt {
        color: #6FB0FD;
      }
    }
  }

  .article_cont {
    font-size: 20px;
    color: #2D2D2D;
    line-height: 28px;
    padding: 8px 0;

    /deep/ img {
      max-width: 100%;
      margin: 0 auto;
      display: block;
    }
  }

  .article_desc {
    font-size: 12px;
    color: #999;
    line-height: 17px;
    padding-top: 12px;

    .blue {
      color: #6FB0FD;
    }
  }

  .article_marks {
    padding-top: 20px;
  }

  .article_marks span {
    display: inline-block;
    padding: 0 8px;
    border: 1px solid #EFF2F7;
    border-radius: 24px;
    margin-right: 10px;
    line-height: 24px;
    background-color: #F6F8FB;
    white-space: nowrap;
    font-size: 12px;
  }

  .point_box_expert {
    background-color: #FAFCFF;
    margin-top: 10px;
    padding: 0 15px 15px;

    .point_hd {
      line-height: 34px;
      font-size: 16px;
      color: #282828;
      padding-top: 15px;
    }

    .icon_point {
      display: inline-block;
      width: 34px;
      height: 34px;
      background: url(../../assets/images/post_icon_expert@2x.png) no-repeat;
      background-size: cover;
      margin-right: 8px;
      position: relative;
      top: -2px;
      vertical-align: middle;
    }

    .point_cont {
      font-size: 14px;
      color: #2D2D2D;
      line-height: 22px;
      padding-top: 15px;
    }

    .author_bar {
      line-height: 22px;
      font-size: 12px;
      color: #999;
      padding-top: 15px;

      .img {
        width: 22px;
        height: 22px;
        border-radius: 22px;
        margin-right: 8px;
        float: left;
      }

      img {
        background-color: #f2f2f2;
        width: 22px;
        height: 22px;
        border-radius: 22px;
        display: block;
      }

      .name {
        float: left;
      }

      .time {
        float: right;
      }
    }
  }

  .point_box {
    background-color: #fff;

    .tab_title {
      padding: 17px 0 2px 15px;
      span {
        font-size: 14px;
        color: #282828;
        line-height: 20px;
      }
    }

    .tab_box ul {
      display: flex;
      padding: 0 15px;
      border-bottom: 1px solid #EFEFEF;

      li {
        flex: 1;
        box-flex: 1;
        font-size: 15px;
        height: 51px;
        line-height: 46px;
        text-align: center;
      }

      .current {
        background: url(../../assets/images/current_line.gif) no-repeat center 46px;
        font-weight: bold;
      }
    }

    .point_list {
      li {
        display: flex;
      }

      .img {
        // width: 55px;
        // height: 55px;
        border-radius: 40px;
        margin-right: 10px;
        padding: 15px 0 0 15px;

        img {
          display: block;
          background-color: #f2f2f2;
          width: 40px;
          height: 40px;
          border-radius: 40px;
        }
      }

      .info {
        flex: 1;
        box-flex: 1;
        width: 0;
        padding: 15px 15px 15px 0;
        border-bottom: 1px solid #F3F4F5;
      }

      li:last-child .info {
        border-bottom: 0;
      }

      dl {
        line-height: 20px;
        font-size: 12px;
        color: #999;
      }

      .name {
        font-size: 13px;
        color: #666;
      }

      .author_type {
        font-size: 11px;
      }

      .blue {
        color: #2688FC;
      }

      .orange {
        color: #FFBA00;
      }

      dd em {
        color: #CFCFCF;
        font-style: normal;
      }

      .point_txt {
        font-size: 14px;
        color: #282828;
        line-height: 22px;
        padding-top: 4px;
      }

      .reply_card {
        // padding: 12px;
        // background-color: #F6F8FB;
        // border: 1px solid #EFEFEF;
        border-radius: 6px;
        font-size: 16px;
        line-height: 22px;
        margin: 9px 0 11px 0;
        color: #282828;
      }

      .reply_desc {
        color: #666;
      }

      .reply_txt {
        color: #282828;
        span {
          word-break: break-all;
          a {
            display: inline-block;
          }
        }
      }

      .reply_time {
        font-size: 12px;
      }
    }
  }

  .new_message_box {
    background-color: #FAFCFF;
    border-top: 1px solid #EFEFEF;
    border-bottom: 1px solid #EFEFEF;
    .point_list {
      .info {
        border: none;
      }
    }
  }

</style>
