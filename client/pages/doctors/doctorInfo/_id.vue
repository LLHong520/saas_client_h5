<template>
  <section class="container">
    <m-header :title="hackDoctorName + '详细介绍'"></m-header>
    <div class="doc_banner"><img src="~/assets/images/bg_doctor_big@2x.png" width="100%" alt=""></div>
    <div class="box_wrapper">
      <div class="doc_card">
        <div class="doc_img"><img :src="GET_IMG_URL(doctorInfo.faceimage,'doc')" alt=""></div>
        <dl>
          <dt>{{doctorInfo.name}} {{doctorInfo.title}}</dt>
          <dd>{{doctorInfo.departName}} {{doctorInfo.hospitalName}}</dd>
          <dd class="goodat">擅长领域：{{doctorInfo.goodAt}}</dd>
        </dl>
      </div>
      <div class="info_item" v-if="doctorInfo.introduction!=''">
        <h3>个人简介</h3>
        <div class="info_txt">{{doctorInfo.introduction}}</div>
      </div>
      <div v-if="doctorInstroInfo.education.length>0||doctorInstroInfo.work.length>0" class="info_item">
        <h3>专业经历</h3>
        <div class="info_txt">
          <dl v-if="doctorInstroInfo.education.length>0">
            <dt>教育经历</dt>
            <dd v-for="(item,index) in doctorInstroInfo.education" :key="index">
              {{item.beginTime | pageDateFormat}} 到 {{item.endTime||"至今" | pageDateFormat}}——{{item.text}} {{item.qualification}}
            </dd>
          </dl>
          <dl v-if="doctorInstroInfo.work&&doctorInstroInfo.work.length>0">
            <dt>工作经历</dt>
            <dd v-for="(item,index) in doctorInstroInfo.work" :key="index">
              {{item.beginTime | pageDateFormat}} 到 {{item.endTime||"至今" | pageDateFormat}} {{item.text}} {{item.title}}
            </dd>
          </dl>
        </div>
      </div>
      <div
      v-if="doctorInstroInfo.awardsList.length>0||doctorInstroInfo.achievmentList.length>0||doctorInstroInfo.publishWorkList.length>0"
      class="info_item">
        <h3>个人成就</h3>
        <div class="info_txt">
          <dl  v-if="doctorInfo.honor!=''">
            <dt>荣誉头衔</dt>
            <dd>{{doctorInfo.honor}}</dd>
          </dl>
          <dl v-if="doctorInstroInfo.awardsList.length>0">
            <dt>获得奖项</dt>
            <dd v-for="(item,index) in doctorInstroInfo.awardsList" :key="index">
              {{item.data | pageDateFormat}}——{{item.text}}
            </dd>
          </dl>
          <dl  v-if="doctorInstroInfo.achievmentList.length>0">
            <dt>科研成果</dt>
            <dd v-for="(item,index) in doctorInstroInfo.achievmentList" :key="index">
              {{item.data | pageDateFormat}}——{{item.text}}
            </dd>
          </dl>
          <dl  v-if="doctorInstroInfo.publishWorkList.length>0">
            <dt>发表作品</dt>
            <dd v-for="(item,index) in doctorInstroInfo.publishWorkList" :key="index">
              {{item.data | pageDateFormat}}——{{item.text}}
            </dd>
          </dl>
        </div>
      </div>
      <div v-if="doctorInstroInfo.persionHonorList.length>0" class="info_item">
        <h3>个人荣誉</h3>
        <ul class="honor_list">
          <li v-for="(item,index) in doctorInstroInfo.persionHonorList" :key="index">
            <div class="img_box"><img @click="previewImgHandler(index)" :src="GET_IMG_URL(item.data[0])" alt=""></div>
            <div class="tit vMiddle">{{item.text}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 图片预览层 -->
    <transition enter-active-class='animated slideInUp' leave-active-class='animated slideOutDown' mode='out-in'>
      <div class="blackpre" v-show="is_perview">
        <div class="bal_head">
          <a class="green_back" href="javascript:;" @click="hidePreview">
            返回</a>
          <h2>预览</h2>
          <a class="seven_del"></a>
        </div>
        <div class="black_img" @click="hidePreview">
          <img :src="previewImg.url" />
        </div>
      </div>
    </transition>
    <!-- /图片预览层 -->
  </section>
</template>

<script>
  import { commonMixin, hackMixin } from "~/mixins";
  import header from "~/components/header.vue";
  import doctorService from "~/services/doctorService.js";
  export default {
    components: {
      mHeader: header
    },
    mixins: [commonMixin, hackMixin],
    asyncData({ route }) {
      return {
        pid: route.params.id
      };
    },
    data() {
      return {
        pid: 0,
        previewIndex: -1,
        previewImg: {
          url:""
        },
        is_perview: false,
        doctorInstroInfo: {
          persionHonorList: [],
          publishWorkList: [],
          awardsList: [],
          education: [],
          work: [],
          achievmentList: [],
          name: "",
          departName: "",
          hospitalName: "",
          title: "",
          goodAt: "",
          honorTitle: "",
          introduction: "",
          experience: [],
          faceImg: ""
        },
        doctorInfo: {
          goodAt: "",
          honor: "",
          name: "",
          hospitalName: "",
          title: "",
          faceimage: "",
          introduction: "",
          departName: ""
        }
      };
    },
    created() {
      this.pid = this.$route.params.id;
      this.docIntro();
    },
    mounted(){
      this.dataPvUvcollect({
        businessType:"doctor",
        collectType: "cmty_h5_doc_introduction",
        businessId: this.pid
      });
    },
    methods: {
      previewImgHandler(index){
        this.previewImg = {
          url:this.doctorInstroInfo.persionHonorList[index].data[0]
        };
        this.is_perview = true;
      },
      hidePreview(){
        this.is_perview = false;
      },
      getEduDate(dateStr,i){
        let dateArr = dateStr.replace(/ /g,"").split("到");
        return dateArr[i];
      },
      loadDocInfo() {
        let _this = this;
        let data = {
          docId: _this.pid
        };
        doctorService.docInfo(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              _this.doctorInfo = res.data;
            } else {
              _this.doctorInfo = {
                faceimage: "...",
                name: "...",
                title: "...",
                hospitalName: "...",
                departName: "...",
                goodAt: "...",
                honorTitle: "...",
              };
            }
          }));
      },
      docIntro() {
        let _this = this;
        let data = {
          docId: _this.pid
        };
        doctorService.docIntro(data)
          .then(((res) => {
            if (res.status == 200 && res.data) {
              _this.doctorInfo = res.data.docInfo;
              _this.doctorInstroInfo = res.data;
            }
          }));
      },
    },
    filters:{
      //时间戳转换为时间 yy-mm-dd ss
      pageDateFormat(val) {
        if (val == "" || val == 0 || val == null || val == undefined)
          return "";
        if (isNaN(parseInt(val))) return val;
        let timeMinSeconds = parseInt(val);

        function fix(num) {
          return num >= 10 ?
            num :
            "0" + num;
        }

        var date = new Date(timeMinSeconds);
        var year = date.getFullYear();
        var month = fix(date.getMonth() + 1);
        var day = fix(date.getDate());
        return year + "." + month + "." + day;
      }
    },
    head() {
      return {
        title: this.hackDoctorName + "介绍",
      };
    }
  };

</script>

<style lang="less" scoped>
  .box_wrapper {
    overflow: visible;
  }

  .doc_banner {
    background-color: #4EBDFE;
    img{
      display: block;
      width: 100%;
    }
  }

  .doc_card {
    text-align: center;
    font-size: 12px;
    color: #323232;
    line-height: 20px;
    padding: 0 25px 25px;

    dl {
      padding-top: 5px;
    }

    dt {
      font-size: 16px;
      font-weight: bold;
    }

    dt,
    dd {
      padding-top: 7px;
    }

    .doc_img,
    .doc_img img {
      width: 68px;
      height: 68px;
      border-radius: 68px;
      display: block;
    }

    .doc_img img {
      background-color: rgba(255, 255, 255, .1);
    }

    .doc_img {
      margin: -34px auto 0;
      border-radius: 0;
    }

    .goodat {
      color: #999;
    }
  }

  .info_item {
    border-top: 1px solid #EFEFEF;
    padding-bottom: 25px;

    h3 {
      font-size: 15px;
      color: #2688FC;
      line-height: 21px;
      padding: 24px 0 15px 0;
      font-weight: normal;
      text-align: center;
    }

    .info_txt {
      font-size: 13px;
      line-height: 24px;
      color: #424242;

      dl {
        padding-bottom: 25px;
      }

      dl:last-child {
        padding-bottom: 0;
      }

      dt {
        color: #999;
      }

      dd {
        color: #323232;
      }
    }

    .honor_list {
      li {
        display: flex;
        padding-bottom: 10px;
      }

      .img_box {
        width: 64px;
        height: 64px;
        border-radius: 4px;
        margin-right: 12px;
      }

      .img_box img {
        display: block;
        width: 64px;
        height: 64px;
        border-radius: 4px;
      }
    }
  }
  /*预览层*/
  .seven_del {
    // background: url(./images/del_icon.png) no-repeat;
    // background-size: 18px 20px;
    width: 18px;
    height: 20px;
    margin-top: 12px;
    margin-left: 45px;
    display: block;
  }
  .blackpre {
    background-color: #000;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .bal_head {
    background-color: #333;
    height: 44px;
    padding: 0 10px;
    display:flex;
  }

  .bal_head .green_back {
    width: 45px;
    color: #fff;
    line-height: 45px;
  }

  .bal_head h2 {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    box-flex: 1;
    flex: 1;
    color: #fff;
    line-height: 44px;
    text-align: center;
    font-weight: normal;
    font-size:14px;
  }

  .black_img {
    position: fixed;
    top: 45px;
    left: 0;
    bottom: 0;
    width: 100%; // height:100%;
    z-index: 11;
    /*display:table;*/
    overflow-y: auto;
  }

  .black_img span {
    display: block;
  }

  .black_img img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
</style>
