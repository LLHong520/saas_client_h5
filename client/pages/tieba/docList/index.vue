<template>
  <section class="container">
    <m-header title="医生委员会"></m-header>
    <div class="box_wrapper">
      <!-- 医生列表 -->
      <div class="doctor_list">
        <ul>
          <li v-for="(item,index) in expertUserList" :key="index">
            <a @click="preventDoctorLink(item, item.drUserId)">
              <div class="img"><img :src="GET_IMG_URL(item.drPhoto,'doc')" alt=""></div>
              <div class="info">
                <dl>
                  <dt><span class="name">{{item.drUserName}}</span>&nbsp;&nbsp;{{item.drTitle}}</dt>
                  <dd>{{item.hospital||""}}&nbsp;&nbsp;{{item.departName}}</dd>
                  <dd class="goodat singleLine">
                    <em class="icon_circle"></em>{{item.expertiseArea}}
                  </dd>
                </dl>
              </div>
            </a>
          </li>
        </ul>
        <m-page :loading="loading" :title="loading? '加载中...':'加载更多'" @loadFn="getPostBarExpertUserByPage" v-if="!isReachEnd"></m-page>
      </div>
      <!-- 医生列表end -->
      <m-bottom v-if="isReachEnd&&expertUserList.length>0"></m-bottom>
      <!-- 内容为空 -->
      <empty v-if="!loading&&expertUserList.length==0" :isFullScreen="true"></empty>
      <!-- 内容为空 -->
    </div>
  </section>
</template>

<script>
  import { commonMixin,comtyIdValid} from "~/mixins";
  import postBarService from "~/services/postBarService.js";
  import header from "~/components/header.vue";
  import bottom from "~/components/bottom.vue";
  import empty from "~/components/empty.vue";
  import page from "~/components/page.vue";

  export default {
    mixins: [commonMixin,comtyIdValid],
    components: {
      mHeader: header,
      mBottom: bottom,
      mPage: page,
      empty: empty,
    },
    async asyncData({ route, redirect,store,query}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 检查应用是否开放
      let PAGE_APP_OBJ = await commonMixin.methods.SET_PAGE_PERMISSION("2", { route, redirect, store });

      return {
        comtyInfo,
        PAGE_APP_OBJ
      };
    },
    data() {
      return {
        expertUserList: [],
        docNum: 0,
        loading: false,
        currentPage: 0,
        isReachEnd: false,
        pageCount: 2,
        pageSize: 10,
      };
    },
    created() {
      this.postBarId = this.$route.query.postBarId;
    },
    mounted() {
      this.getPostBarExpertUserByPage();
    },
    methods: {
      getPostBarExpertUserByPage() {
        if (this.loading) return;
        this.loading = true;
        let _this = this;
        postBarService.getPostBarExpertUserByPage({
          select_key:"createTime",
          select_direction:"asc",
          postBarId: this.postBarId,
          communityId: this.VX_commtyId,
          pageSize: _this.pageSize,
          pageNum: _this.currentPage + 1
        })
          .then((res) => {
            _this.loading = false;
            if (res.status == 200 && res.data) {
              _this.expertUserList = _this.expertUserList.concat(res.data);
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
      }
    },
    head() {
      return {
        title: "医生委员会",
      };
    }
  };

</script>
<style lang="less" scoped>
  .doctor_list {
    li {
      padding: 15px 0;
      border-bottom: 1px solid #EFEFEF;
    }

    li:last-child {
      border: 0;
    }

    a {
      display: flex;

    }

    .img {
      width: 48px;
      height: 48px;
      background-color: #f2f2f2;
      border-radius: 48px;
      margin-right: 10px;
    }

    .img img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 48px;
    }

    .info {
      flex: 1;
      box-flex: 1;
      width: 0;
      line-height: 22px;
      font-size: 12px;
      color: #666;

      dt {
        color: #282828;
      }

      .name {
        font-size: 16px;
        font-weight: 700;
      }

      .goodat {
        font-size: 11px;
        color: #999;

        .icon_circle {
          display: inline-block;
          width: 14px;
          height: 10px;
          background: url(../../../assets/images/icon_speciality@2x.png) no-repeat;
          background-size: 14px 10px;
          margin-right: 12px;
        }
      }
    }
  }

  .district_box {
    position: fixed;
    width: 100%;
    left: 0;
    top: 84px;
    background-color: #fff;
    z-index: 996;

    .myDistrict {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      font-size: 14px;
      color: #282828;
      background-color: #F6F8FB;
      display: flex;

      span {
        flex: 1;
        box-flex: 1;
        overflow: hidden;
      }

      .refresh {
        display: block;
        font-size: 12px;
        color: #999;
      }
    }

    .icon_distiric {
      display: inline-block;
      width: 12px;
      height: 14px;
      background: url(../../../assets/images/icon_location@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      top: -2px;
      margin-right: 5px;
    }

    .icon_refresh {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../assets/images/icon_refresh@2x.png) no-repeat;
      background-size: cover;
      position: relative;
      vertical-align: middle;
      top: -2px;
      margin-left: 8px;
    }

    .district_list {
      display: flex;
      max-height: 459px;
      overflow-y: auto;
    }

    .province {
      width: 83px;
      background-color: #EBF0F7;

      li {
        font-size: 14px;
        color: #282828;
        line-height: 51px;
        padding-left: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      li.active {
        background-color: #fff;
      }
    }

    .city {
      flex: 1;
      box-flex: 1;
      padding-left: 25px;
      width: 0;

      li {
        line-height: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 15px;
        font-size: 14px;
        border-bottom: 1px solid #EFEFEF;
      }

      li.active {
        color: #2688FC;
      }
    }
  }

</style>
