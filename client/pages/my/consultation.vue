<template>
  <section class="container">
    <m-header title="关于社区"></m-header>
    <div class="introduce_card">
      <div class="community_logo">
        <!--<img v-if="comtyInfo.type == 1" src="~/assets/images/bg_bbs_company@2x.png" width="48" height="48" alt="" />
        <img v-else-if="comtyInfo.type == 2" src="~/assets/images/me_bg_bbs_facility@2x.png" width="48" height="48" alt="" />
        <img v-else src="~/assets/images/me_bg_bbs_hospital@2x.png" width="48" height="48" alt="" />-->
        <img :src="comtyInfo.comtyLogo" width="48" height="48" alt="" />
      </div>
      <dl>
        <dt>{{comtyInfo.comtyName || "社区名称"}}</dt>
        <dd>{{comtyInfo.introduction}}</dd>
      </dl>
      <div class="user_list">
        <div class="faces">
          <span>
            <a v-for="(item,index) in userList" :key="index" v-if="index < 3">
              <img :src="GET_IMG_URL(item.headPicUrl,'u')" width="60" height="60" alt="">
            </a>
          </span>
          <span>
            <a v-for="(item,index) in doctorImgs" :key="index" v-if="index < 3">
              <img :src="GET_IMG_URL(item,'doc')" width="60" height="60" alt=""></a>
            </span>
        </div>
        <p><span class="blue">{{userNum}}</span>人已加入 | <span class="blue">{{doctorNum}}</span>位医生已入驻</p>
      </div>
    </div>
  </section>
</template>

<script>
  import { commonMixin,comtyIdValid,asyncDataMixin} from "~/mixins";
  import communityService from "~/services/communityService.js";
  import homeService from "~/services/homeService.js";
  import header from "~/components/header.vue";
  export default {
    mixins: [commonMixin,comtyIdValid,asyncDataMixin],
    components: {
      mHeader: header
    },
    data() {
      return {
        comtyInfo: {
          comtyName:"",
          introduction:"",
        },
        doctorNum: 0,
        userNum: 0,
        doctorList: [],
        recoDoctorList: [],
        userList: []
      };
    },
    async asyncData({ route, store, redirect, query }){
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });
      /*if (route.query && route.query.comtyId){
        store.commit("SET_COMTYID", route.query.comtyId);
      }
      await store.dispatch("update_comtyInfo");
      let comtyInfo = store.state.comtyInfo;
      if(!comtyInfo || comtyInfo.status != 1){
        return redirect("/notFound",{
          statusCode:504,
          message:"社区内容准备中...",
          showHeader:false
        });
      }*/
      return {
        comtyInfo
      };
    },
    computed: {
      doctorImgs() {
        let docImgs = [];
        this.recoDoctorList.map((item) => {
          docImgs.push(item.faceimage);
        });
        if (docImgs.length < 3) {
          let needFullNum = 3 - docImgs.length;
          let tarI = needFullNum >= this.doctorList.length? this.doctorList.length:needFullNum;
          for (let index = 0; index < tarI; index++) {
            docImgs.push(this.doctorList[index].headPicUrl);
          }
        }
        return docImgs;
      }
    },
    mounted() {
      this.getDoctorList();
      this.getCommunityUserCount();
      this.getUserList();
      this.getDocPosSet();
    },
    methods: {
      getDocPosSet() {
        let queryParams = {};
        homeService.getDocPosSet(queryParams)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              let doctorList = [];
              res.data.map((item) => {
                if (item.doctorId != "") {
                  doctorList.push(item);
                }
              });
              this.recoDoctorList = doctorList;
            }
          }));
      },
      getCommunityUserCount(){
        let queryParams = {};
        communityService.getCommunityUserCount(queryParams)
          .then(((res)=>{
            if(res.status==200&&res.data){
              this.userNum=res.data;
            }
          }));
      },
      getCommunityInstro() { //社区简介
        communityService.getCommunityInstro({})
          .then((res) => {
            if (res.status == 200) {
              this.comtyInfo = res.data;
            }
          });
      },
      getDoctorList() {
        //入驻医生列表
        let queryParams = {
          page: 1,
          size: 10,
        };
        communityService.enrolledDoctorInfo(queryParams)
          .then((res) => {
            if (res.status == 200) {
              this.doctorNum = res.total;
              this.doctorList = res.data||[];
            }
          });
      },
      getUserList() {
        //入驻用户列表
        let queryParams = {
          communityId: this.VX_comtyId,
          page: 1,
          size: 10,
        };
        communityService.getUserList(queryParams)
          .then((res) => {
            if (res.status == 200) {
              this.userList = res.data;
            }
          });
      }
    },
    head() {
      return {
        title: "关于社区",
      };
    }
  };

</script>

<style lang="less" scoped>
  .introduce_card {
    padding-top: 20px;
    background-color: #fff;
    text-align: center;
    padding-bottom: 40px;

    .community_logo {
      height: 48px;

      img {
        display: block;
        width: 48px;
        height: 48px;
        border-radius: 48px;
        margin: 0 auto;
      }
    }

    dl {
      font-size: 14px;
      line-height: 20px;
      color: #2D2D2D;
      padding: 10px 38px 0;
    }

    dt {
      font-size: 15px;
      font-weight: bold;
    }

    dd {
      padding-top: 20px;
    }

    .user_list {
      text-align: center;
      font-size: 13px;
      color: #999;

      .blue {
        color: #4B9BC5;
      }

      .faces {
        text-align: center;
        padding-top: 30px;
      }

      span {
        display: inline-block;

        a {
          width: 24px;
          height: 24px;
          display: inline-block;
          margin-left: -5px;

          img {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 24px;
            background-color: #f8f8f8;
            border: 1px solid #fff;
          }
        }
      }
    }
  }

  .btn_box {
    padding: 40px 0;
    background-color: #fff;

    a {
      display: block;
      width: 110px;
      height: 40px;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background-color: #2688FC;
      margin: 0 auto;
    }
  }

</style>
