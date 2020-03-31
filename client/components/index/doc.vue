<template>
  <div class="box_wrapper doc mt10">
    <div class="common_hd">
      <h3>{{ hackDoctorName }}推荐</h3>
      <nuxt-link :to="{path:'/doctors'}" :iw="`{desc:'医生推荐-查看全部',id:'docViewMore',ext:{path:'/doctors'}}`" class="toMore"><span>{{doctorNum}}位优秀{{ hackDoctorName }}加入</span></nuxt-link>
    </div>
    <!--<m-doctor v-if="doctorList.length>0" :doctorList="doctorList"></m-doctor>-->

    <div class="doctor" v-if="doctorList.length != 0">
      <ul>
        <li v-for="(item, index) in dataList1" :key="item.doctorId" :class="{ flex: doctorList.length > 2 }">
          <a @click="preventDoctorLink(item, item.doctorId)" :iw="`{desc:'医生推荐-${item.doctorName}',id:'docRecommend',ext:{id:'${item.doctorId}'}}`">
            <div class="img"><img v-lazy="item.faceimage" alt=""></div>
            <div class="content">
              <h3>{{ item.doctorName }}</h3>
              <p>{{ item.title }}</p>
              <p class="color6">{{ item.departName }}</p>
            </div>
          </a>
        </li>
      </ul>
      <ul v-if="dataList2.length != 0">
        <li v-for="(item, index) in dataList2" :key="item.doctorId">
          <a @click="preventDoctorLink(item, item.doctorId)" :iw="`{desc:'医生推荐-${item.doctorName}',id:'docRecommend',ext:{id:'${item.doctorId}'}}`">
            <div class="img"><img v-lazy="item.faceimage" alt=""></div>
            <div class="content">
              <h3><b>{{ item.doctorName }}</b> <span>{{ item.title }}</span></h3>
              <p class="color6">{{ item.departName }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { commonMixin, hackMixin } from "~/mixins";
  import doctor from "~/components/swiper_doctor.vue";
  import homeService from "~/services/homeService.js";
  import communityService from "~/services/communityService.js";
  export default {
    mixins: [commonMixin, hackMixin],
    components: {
      mDoctor: doctor,
    },
    data() {
      return {
        doctorList: [],
        doctorNum: 0,
      };
    },
    computed: {
      dataList1() {
        if (this.doctorList.length > 2) {
          return this.doctorList.slice(0, 1);
        } else {
          return this.doctorList;
        }
      },
      dataList2() {
        if (this.doctorList.length > 2) {
          return this.doctorList.slice(1, 3);
        } else {
          return [];
        }
      }
    },
    created() {
      this.getDocPosSet();
      this.enrolledDoctorInfo();
    },
    methods: {
      getDocPosSet() {
        homeService.getDocPosSet({})
          .then(((res) => {
            if (res.status == 200 && res.data) {
              let doctorList = [];
              res.data.map((item) => {
                if (item.doctorId && item.doctorId != "") {
                  doctorList.push(item);
                }
              });
              this.doctorList = doctorList;
            }
          }));
      },
      enrolledDoctorInfo() {
        //入驻医生列表
        let queryParams = {
          page: 1,
          size: 10,
        };
        communityService.enrolledDoctorInfo(queryParams)
          .then((res) => {
            if (res.status == 200 && res.total) {
              this.doctorNum = res.total;
            }
          });
      }
    }
  };

</script>
<style scoped>
  .blue {
    color: #2688FC;
    font-weight: 500;
  }

</style>
