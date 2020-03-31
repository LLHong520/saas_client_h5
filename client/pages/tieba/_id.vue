<template>
  <section class="container">
    <m-header
      title=""
      :share_on="true"
      :isSuspension="true"
      readMoreLink="/tieba"
      @shareFn="onShare(false)"
      :class="{ isAdmin: isAdmin||isMyPost }"
    ></m-header>
    <a href="javascript:;" v-if="isAdmin || isMyPost" @click="removeConfirm" class="hd_delete" :class="{ fix: isHideHeader }">删除帖子</a>
    <!-- 帖子详情 -->
    <div class="article_box box_wrapper">
      <h3 class="article_tit">{{postInfo.title}}</h3>
      <div class="author_box">
        <nuxt-link :to="getRealUserCenterLink(postInfo.userId,postInfo.userType)">
          <div class="img">
            <img :src="GET_IMG_URL(postInfo.userPhoto,'u')" width="40" height="40" alt="" />
          </div>
          <dl>
            <dt>{{postInfo.userName}}</dt>
            <dd>{{postInfo.publishTime}}</dd>
          </dl>
        </nuxt-link>
      </div>
      <div class="article_cont">
        <richText :richHtml="postInfo.content" />
      </div>
      <div class="article_desc" v-if="adminUserActionInfo">圈主
        <nuxt-link :to="'/users/'+adminUserActionInfo.adminUserId">
          <span class="blue"> {{adminUserActionInfo.adminUserName}}</span>
        </nuxt-link>
        于
        {{adminUserActionInfo.updateTime}} 编辑了该贴
      </div>
      <div class="article_marks">
        <span v-for="(tag,index) in postInfo.postTagsList" :key="index">
          {{tag.name}}
        </span>
      </div>
    </div>
    <!-- 专家点评 -->
    <template v-if="expertReplyList.length > 0">
      <div v-for="(replyItem,index) in expertReplyList" :key="index" class="point_box_expert">
        <div class="point_hd">
          <em class="icon_point"></em>专家点评
        </div>
        <div class="point_bd">
          <div class="point_cont">
            {{replyItem.content}}
          </div>
          <div class="author_bar clearfix">
            <nuxt-link :to="'/doctors/'+replyItem.userId">
              <div class="img">
                <img :src="GET_IMG_URL(replyItem.userPhoto,'u')" width="40" height="40" alt="">
              </div>
              <span class="name">{{replyItem.userName}}</span>
            </nuxt-link>
            <span class="time">{{replyItem.createTime | dateFormat}}</span>
          </div>
        </div>
      </div>
      <!-- <div v-if="expertReplyList.length == 0" class="point_box_expert">
        <div class="point_hd" @click="showReply()">
          <em class="icon_point"></em>专家点评
        </div>
      </div> -->
    </template>

    <!-- 相关帖子 -->
    <relatedPost :postsId="postsId" :postBarId="postInfo.postBarId"></relatedPost>

    <!-- 评论列表 -->
    <div class="point_box mt10">
      <div class="tab_box">
        <ul>
          <li :class="{'current':replyType == 0}" @click="changeReplyType(0)">全部评论 {{postTotalNum}}</li>
          <li :class="{'current':replyType == 1}" @click="changeReplyType(1)">只看楼主</li>
          <!-- <li :class="{'current':replyType == 2}" @click="changeReplyType(2)">只看医生</li> -->
        </ul>
      </div>
      <div class="tab_cont">
        <div class="point_list">
          <ul>
            <li v-for="(replyItem,index) in postReplyList" :key="index">
              <div class="img">
                <nuxt-link :to="getRealUserCenterLink(replyItem.userId,replyItem.userType)">
                  <img :src="GET_IMG_URL(replyItem.userPhoto,'u')" width="40" height="40" alt="">
                </nuxt-link>
              </div>
              <div class="info">
                <dl>
                  <dt>
                    <template>
                      <span class="name">{{replyItem.userName}}</span>
                      <span class="author_type" v-if="replyItem.userType == 1||replyItem.userType == 3">·<span class="blue"> 医生</span></span>
                      <span class="author_type" v-if="replyItem.userType == 2">·<span class="orange"> 圈主</span></span>
                      <span class="author_type" v-if="replyItem.userId==postInfo.userId">·<span class="orange"> 楼主</span></span>
                    </template>
                    <template v-if="isAdmin">
                      <span class="fr icon_delete" @click="deleteReply(replyItem.id, index)"></span>
                    </template>
                  </dt>
                  <dd>{{replyItem.floor}}楼 <em class="gray">|</em> {{replyItem.createTime | dateFormat}}</dd>
                </dl>
                <div class="reply_card" v-if="replyItem.postReply">
                  <p class="reply_desc">回复{{replyItem.postReply.floor}}楼 <span class="blue">@{{replyItem.postReply.userName}}
                    </span>发表的</p>
                  <div class="reply_txt">{{replyItem.postReply.content}}</div>
                </div>
                <template>
                  <div v-if="replyItem.isDelete" class="point_txt">该评论已删除！</div>
                  <div v-else class="point_txt" @click="showReply('reply', replyItem)">{{replyItem.content}}</div>
                </template>
              </div>
            </li>
            <!-- <li>
              <div class="img"><img src="~/assets/images/bg_head@2x.png" width="40" height="40" alt=""></div>
              <div class="info">
                <dl>
                  <dt>
                    <span class="name">太田胃药</span>
                    <span class="author_type">·<span class="orange"> 圈主</span></span>
                  </dt>
                  <dd>2楼 <em class="gray">|</em> 2019-11-14 12:12</dd>
                </dl>
                <div class="point_txt">总是在鼻子上起痘痘,然后挤了就有痘印,我急忙擦了药哈哈。</div>
              </div>
            </li>
            <li>
              <div class="img"><img src="~/assets/images/bg_head@2x.png" width="40" height="40" alt=""></div>
              <div class="info">
                <dl>
                  <dt>
                    <span class="name">太田胃药</span>
                    <span class="author_type">·<span class="orange"> 圈主</span></span>
                  </dt>
                  <dd>3楼 <em class="gray">|</em> 2019-11-14 12:12</dd>
                </dl>
                <div class="reply_card">
                  <p class="reply_desc">回复2楼 <span class="blue">@小油腻 </span>发表的</p>
                  <div class="reply_txt">真的这样喔，谢谢你。总是在鼻子上起痘痘，然后挤了就有痘印，我急忙擦了药。</div>
                </div>
                <div class="point_txt">总是在鼻子上起痘痘,然后挤了就有痘印,我急忙擦了药哈哈。</div>
              </div>
            </li> -->
          </ul>
          <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getPostReplyInfo" v-if="!isReachEnd"></m-page>
        </div>
      </div>
    </div>
    <!-- 数据为空 -->
    <empty v-if="!loading && postReplyList.length==0"></empty>
    <!-- /数据为空 -->
    <!-- 数据为空 -->
    <m-bottom v-if="isReachEnd && postReplyList.length>0"></m-bottom>
    <div class="shadow" v-if="replyIsShow" @click="replyIsShow=false"></div>
    <div class="blank50" :class="{'blank103':isAdmin||isMyPost}"></div>
    <div class="reply_wrapper">
      <!-- <span href="javascript:;" @click="showReplyBox" class="master_name">
        评论
      </span> -->
      <!-- 圈主的操作 -->
      <div v-if="isAdmin||isMyPost" class="post_operate clearfix">
        <template v-if="isAdmin">
          <label>帖子操作：</label>
          <a href="javascript:;" @click="setPostTop()" class="operate_item">
            {{postInfo.isTop==0? "置顶":"已置顶"}}
          </a>
          <a href="javascript:;" @click="setPostRecommend()" class="operate_item">
            {{postInfo.isRecommend==0? "推荐":"已推荐"}}
          </a>
          <a href="javascript:;" @click="setPostEssence()" class="operate_item">
            {{postInfo.isEssence==0? "精华":"已精华"}}
          </a>
        </template>
        <nuxt-link :to="{path:'/tieba/edit/',query:{postsId:postsId,postBarId:this.postInfo.postBarId}}" class="btn_edit"></nuxt-link>
      </div>
      <!-- 圈主的操作 -->
      <!--  -->
      <!--  -->
      <div class="reply_area">
        <input type="text" class="ipt_reply" @click="showReply" placeholder="发表评论…" v-if="!replyIsShow">
        <div class="reply_box" v-if="replyIsShow">
          <div class="reply_cont">
            <textarea v-model="content" :placeholder="replyName!=''? '@' + replyName:''" maxlength="500"></textarea>
            <p class="word_limit">{{"（" + content.length + "/500）"}}</p>
          </div>
          <div class="btn_reply vMiddle">
            <a href="javascript:;" :class="{ disabled: isSubmit }" @click="showReplyBox">{{ isSubmit ? "发送中" : "发送"}}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 确认弹框 -->
    <m-confirm :isShow="deleteConfirm.isShow" title="删除帖子" content="是否确定删除本帖" @confirmFn="removePostById"
      @on-change-show="onChangeShow"></m-confirm>
    <m-confirm :isShow="delReplyConfirm.isShow" title="删除评论" content="是否确定删除评论" @confirmFn="confirmDelReply" @cancelFn="cancelDelReply"></m-confirm>
    <!-- 确认弹框 end-->

    <!-- 分享 -->
    <m-share :show.sync="isShare" :config="shareConfig"></m-share>
  </section>
</template>

<script>
  import tools from "~/utils/tools.js";
  import postBarService from "~/services/postBarService.js";
  import userService from "~/services/userService.js";
  import { commonMixin, comtyIdValid } from "~/mixins";
  import header from "~/components/header.vue";
  import richText from "~/components/rich_text.vue";
  import bottom from "~/components/bottom.vue";
  import page from "~/components/page.vue";
  import empty from "~/components/empty.vue";
  import confirm from "~/components/confirm.vue";
  import relatedPost from "./components/related_post";
  import share from "~/components/iwen/share.vue";

  export default {
    mixins: [commonMixin, comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
      richText: richText,
      mConfirm: confirm,
      mShare: share,
      relatedPost
    },
    data() {
      return {
        isShare: false,
        shareConfig: {},
        isSubmit: false,
        postsId: 0,
        postTotalNum: 0,
        postInfo: {},
        content: "",
        notContainIds: [],
        postReplyList: [],
        adminUserByList: [],
        expertReplyList: [],
        replyType: 0,
        replyIsShow: false,
        pageIndex: 0,
        pageSize: 15,
        pageCount: 1,
        loading: false,
        isReachEnd: false,
        deleteConfirm: {
          isShow: false,
        },

        isReply: false, //是否是对于当前评论的回复
        replyParentId: "",
        replyName: "", //回复当前评论的name
        delReplyConfirm: {
          isShow: false,
          id: "",
          deleteIndex: -1,
        },
        adminUserActionInfo: null,
        fromTypeInfoRes: {
          doctorId:null
        },
      };
    },
    async asyncData({ route, redirect, store, query }) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

      let data = {
        id: route.params.id
      };
      let postInfo = await postBarService.getPostsById(data).then(res => {
        if (res.status == 200 && res.data && res.data.status == 1) {
          return res.data;
        } else {
          return redirect({
            path: "/notFound",
            query: {
              statusCode: 404,
              message: "帖子已删除"
            }
          });
        }
      });
      //拿到帖子信息 去更新圈子信息
      store.commit("SET_COMTYID", postInfo.communityId);

      return {
        comtyInfo,
        PAGE_APP_OBJ,
        postInfo,
        title: postInfo.title
      };
    },
    created() {
      this.postsId = this.$route.params.id;
      this.getPostAdminUserByList(this.postInfo.postBarId);
      this.onShare(true);
    },
    computed: {
      isAdmin() {
        let is = false;
        let isDoc = false;
        if (this.VX_is_login) {
          let fromTypeInfoRes = this.fromTypeInfoRes;
          isDoc = fromTypeInfoRes.doctorId ? true : false;
        }
        if (!isDoc) {
          if (this.VX_is_login) {
            console.log(this.VX_is_login);
            console.log(this.VX_userInfo.id||"");
            let userId = this.VX_userInfo.id||"";
            let filterArr = this.adminUserByList.filter((item) => {
              return item.userId === userId;
            });
            is = filterArr.length > 0;
          }
        }
        console.log(is);

        // is = true;
        return is;
      },
      isMyPost() {
        let is = false;
        if (this.VX_is_login) {
          //判断用户身份 若为0，2则为圈主或普通用户 否则为医生
          let userId = ["0", "2"].indexOf(this.postInfo.userType) >= 0 ? this.VX_userInfo.id : this.VX_userInfo.parentUserId;
          let authorUserId = this.postInfo.userId;
          is = authorUserId === userId;
        }
        // is = true;
        return is;
      },
      isOtherAgent() {
        if (this.$platformInfo) {
          let os = this.$platformInfo.os;
          return os.isWx || os.isWeibo || os.isMp;
        } else {
          return false;
        }
      },
      isHideHeader() {
        return this.isOtherAgent || this.VX_isInApp;
      },
    },
    mounted() {
      let dataPvUvcollectParams = {
        businessType: "post",
        collectType: "cmty_h5_posts_read",
        businessId: this.postsId
      };
      this.dataPvUvcollect(dataPvUvcollectParams);
      this.getPostInfo();
      this.addUserOperationRecord({
        operationType:0,
        objType:2,
        objTitle:this.postInfo.title
      });
      this.getPostReplyCount();
      this.getExpertReplyList();
      this.getPostReplyInfo();
      this.getAdminUserActionById();
      if (this.VX_is_login) {
        userService.getUserFromType({
          userId: this.VX_userInfo.id||""
        }).then((res)=>{
          if(res.status == 200 &&res.data){
            this.fromTypeInfoRes = res.data;
          }
        });
      }
    },
    methods: {
      onShare(isInit = false) {
        if (!isInit) {
          this.isShare = true;
        }

        let data = this.postInfo;
        let imgUrl = "";

        if (data.imgIds && data.imgIds.length > 0) {
          imgUrl = this.GET_IMG_URL(data.imgIds[0]);
        }

        this.shareConfig = {
          id: this.postsId,
          type: "post",
          title: data.title,
          content: data.content.replace(/<\/?.+?>/g,"").substring(0,100),
          imgUrl: imgUrl
        };
      },
      getRealUserCenterLink(userId,userType){
        //医生跳转医生主页 用户跳转用户主页
        let link = ["0", "2"].indexOf(userType) >= 0 ? `/users/${userId}` : `/doctors/${userId}`;
        return link;
      },
      getExpertReplyList() {
        postBarService.getExpertReplyList({
          postsId: this.postsId,
        }).then(res => {
          if (res.status == 200 && res.data) {
            this.expertReplyList = res.data.length > 0 ? [res.data[0]] : [];
            let notContainIds = [];
            res.data.map((item) => {
              notContainIds.push(item.id);
            });
            this.notContainIds = notContainIds;
          }
        });
      },
      getAdminUserActionById() {
        postBarService.getAdminUserActionById({
          postsId: this.postsId,
        }).then(res => {
          if (res.status == 200 && res.data) {
            this.adminUserActionInfo = res.data;
          }
        });
      },
      onChangeShow(val) {
        this.deleteConfirm.isShow = val;
      },
      // onChangeShowReply(val) {
      //   this.delReplyConfirm.isShow = val;
      // },
      getPostAdminUserByList(postBarId) {
        postBarService.getPostAdminUserByList({
          postBarId: postBarId
        }).then(res => {
          if (res.status == 200) {
            this.adminUserByList = res.data || [];
          }
        });
      },
      deleteReply(id, index) {
        this.delReplyConfirm.id = id;
        this.delReplyConfirm.deleteIndex = index;
        this.delReplyConfirm.isShow = true;
      },
      cancelDelReply() {
        this.delReplyConfirm.isShow = false;
      },
      confirmDelReply() {
        let data = {
          id: this.delReplyConfirm.id,
          userId: this.VX_userInfo.id||"",
        };
        postBarService.removeByIdReply(data).then((res) => {
          this.delReplyConfirm.isShow = false;
          if (res.status == 200) {
            this.$toast.tip("评论删除成功");
            this.postReplyList[this.delReplyConfirm.deleteIndex].isDelete = true;
          };
        }).catch(() => {
          this.delReplyConfirm.isShow = false;
          this.$toast.tip("评论删除失败，请稍后重试！");
        });
      },
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
        if (content.length > 500) {
          this.$toast.tip("内容不能超过500个字哦~");
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
            this.$toast.tip("评论发表成功~");
            this.getPostReplyCount();
            this.content = "";
            this.postReplyList = this.postReplyList.reverse();
            let beRepliedItem = null;
            if (this.replyParentId != "") {
              beRepliedItem = this.postReplyList.filter((item) => {
                return item.id == this.replyParentId;
              })[0];
              res.data.postReply = beRepliedItem;
            }
            //如果当前tab是全部评论 插入新记录 不刷新
            if (this.replyType != 1) {
              this.postReplyList.push(res.data);
            }
            this.postReplyList = this.postReplyList.reverse();
            this.replyIsShow = false;
            //如果当前tab是只看楼主 切换到全部评论
            if (this.replyType == 1) {
              this.changeReplyType(0);
            }
            postBarService.sendReplyMsg({
              beRepliedId: beRepliedItem ? beRepliedItem.userId : "",
              beRepliedPostsOwnerId: this.postInfo.userId,
              postReply: res.data,
            });
            this.addUserOperationRecord({
              operationType:this.replyParentId?3:2,
              objType:2,
              objTitle:this.postInfo.title
            });
          } else {
            this.$toast.tip("评论发表失败~");
          }
        }).finally( () => {
          this.isSubmit = false;
        });
      },
      getPostInfo() {
        postBarService.getPostsById({
          id: this.postsId
        }).then(res => {
          if (res.status == 200 && res.data) {
            this.postInfo = res.data || {};
            this.getPostAdminUserByList(this.postInfo.postBarId);
          } else {
            this.$router.replace({
              path: "/notFound",
              query: {
                statusCode: 404,
                message: "帖子已删除",
                showHeader: false,
                backNum: -2,
              }
            });
            return;
          }
        });
      },
      setPostTop() {
        if (this.postInfo.isRecommend == 1 || this.postInfo.isEssence == 1) {
          let toastWord = this.postInfo.isRecommend == 1 ? "帖子已推荐" : "帖子已精华";
          this.$toast.tip(toastWord);
          return;
        }
        let isTop = this.postInfo.isTop == 0 ? 1 : 0;
        let tipText = isTop ? "已置顶" : "已取消置顶";
        postBarService.setTopById({
          id: this.postsId,
          isTop: isTop,
          userId: this.VX_userInfo.id,
        }).then(res => {
          if (res.status == 200) {
            this.postInfo.isTop = isTop;
            this.$toast.tip(tipText);
          }
        });
      },
      setPostRecommend() {
        if (this.postInfo.isTop == 1 || this.postInfo.isEssence == 1) {
          let toastWord = this.postInfo.isTop == 1 ? "帖子已置顶" : "帖子已精华";
          this.$toast.tip(toastWord);
          return;
        }
        let isRecommend = this.postInfo.isRecommend == 0 ? 1 : 0;
        let tipText = isRecommend ? "已推荐" : "已取消推荐";
        postBarService.setRecommendById({
          id: this.postsId,
          isRecommend: isRecommend,
          userId: this.VX_userInfo.id,
        }).then(res => {
          if (res.status == 200) {
            this.postInfo.isRecommend = isRecommend;
            this.$toast.tip(tipText);
          }
        });
      },
      setPostEssence() {
        if (this.postInfo.isTop == 1 || this.postInfo.isRecommend == 1) {
          let toastWord = this.postInfo.isTop == 1 ? "帖子已置顶" : "帖子已推荐";
          this.$toast.tip(toastWord);
          return;
        }
        let isEssence = this.postInfo.isEssence == 0 ? 1 : 0;
        let tipText = isEssence ? "已精华" : "已取消精华";
        postBarService.setEssenceById({
          id: this.postsId,
          isEssence: isEssence,
          userId: this.VX_userInfo.id,
        }).then(res => {
          if (res.status == 200) {
            this.postInfo.isEssence = isEssence;
            this.$toast.tip(tipText);
          }
        });
      },
      removeConfirm() {
        this.deleteConfirm.isShow = true;
      },
      removePostById() {
        this.deleteConfirm.isShow = false;
        postBarService.removeById({
          id: this.postsId,
          userId: this.VX_userInfo.id,
        }).then(res => {
          if (res.status == 200) {
            this.$router.replace({
              path: "/tieba"
            });
          }
        });
      },
      getPostReplyCount() {
        postBarService.getPostReplyCount({
          postsId: this.postsId
        }).then(res => {
          if (res.status == 200) {
            this.postTotalNum = res.data || 0;
          }
        });
      },
      changeReplyType(type) {
        this.replyType = type;
        this.pageIndex = 0;
        this.postReplyList = [];
        this.getPostReplyInfo();
      },
      getPostReplyInfo() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        let params = {
          select_key: "createTime",
          select_direction: "asc",
          postsId: this.postsId,
          pageNum: this.pageIndex + 1,
          pageSize: this.pageSize,
          userId: this.postInfo.userId,
          notContainIds: [],
          userType: 1,
        };
        if (this.replyType != 2) {
          delete params.userType;
        }
        if (this.replyType == 0 || this.replyType == 2) {
          delete params.userId;
        }
        postBarService.getPostReplyByPage(params).then(res => {
          _this.loading = false;
          if (res.status == 200) {
            res.data.map((item) => {
              item.isDelete = false;
            });
            _this.postReplyList = _this.postReplyList.concat(res.data);
            _this.pageIndex = _this.pageIndex + 1;
            _this.pageCount = Math.ceil(res.total / _this.pageSize);
            if (_this.pageIndex + 1 > _this.pageCount) {
              _this.isReachEnd = true;
            } else {
              _this.isReachEnd = false;
            }
          } else {
            _this.isReachEnd = false;
          }
        }).catch(() => {
          _this.loading = false;
        });
      },
      showReply(type, data) {
        this.CHECK_LOGIN();
        this.replyIsShow = true;
        if (type == "reply") {
          this.isReply = true;
          this.replyName = data.userName || "";
          this.replyParentId = data.id;
          this.content = "";
        } else {
          this.isReply = false;
          this.replyName = "";
          this.replyParentId = "";
          this.content = "";
        }
      }
    },
    head() {
      return {
        title: `${this.postInfo.title}_${this.comtyInfo.comtyName}`,
        meta: [
          {
            name: "keywords",
            content: (function(postInfo){
              let keywords = [];

              if (postInfo.postTagsList && postInfo.postTagsList.length != 0) {
                postInfo.postTagsList.map((item)=>{
                  keywords.push(item.name);
                });
              }

              return keywords;
            })(this.postInfo).join()
          },
          {
            hid: "description",
            name: "description",
            content: this.postInfo.content.replace(/<\/?.+?>/g,"").substring(0,20)
          }
        ],
      };
    }
  };

</script>

<style lang="less" scoped>
  /deep/.header h2 {
    padding: 0 75px;
  }

  .isAdmin {
    /deep/ .d-supernatant {
      .left, .right {
        bottom: 110px;
      }
    }
  }

  .hd_delete {
    position: fixed;
    right: 45px;
    top: 0;
    line-height: 44px;
    font-size: 14px;
    color: #999;
    z-index: 996;
    &.fix {
      right: 15px;
      line-height: 35px;
    }
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
      padding: 13px 15px 10px 15px;
      font-size: 12px;
      color: #999;
      line-height: 24px;

      label,
      .operate_item {
        float: left;
        margin-top: 3px;
      }

      .operate_item {
        padding: 0 14px;
        border: 1px solid #EFF2F7;
        border-radius: 24px;
        margin-right: 10px;
        line-height: 22px;
        background-color: #F6F8FB;
        white-space: nowrap;
        font-size: 12px;
        color: #282828;
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
        line-height: 18px;
        padding: 6px 14px;
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
    padding: 20px 15px;
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

        img {
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
    font-size: 16px;
    color: #424242;
    line-height: 27px;
    padding: 8px 0;

    img {
      max-width: 100%;
      display: block;
      margin: 0 atuo;
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
        width: 55px;
        height: 55px;
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
        word-break: break-all;
        word-wrap:break-word;
      }

      .reply_card {
        padding: 12px;
        background-color: #F6F8FB;
        border: 1px solid #EFEFEF;
        border-radius: 6px;
        font-size: 13px;
        line-height: 21px;
        margin: 15px 0 11px 0;
      }

      .reply_desc {
        color: #666;
      }

      .reply_txt {
        color: #282828;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

</style>
