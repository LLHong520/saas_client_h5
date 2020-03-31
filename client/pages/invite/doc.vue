<template>
  <section class="container">
    <m-header title="社区医院邀请" :back_on="false"></m-header>

    <div class="box_wrapper invitation" v-if="msgInfo && msgInfo.commpanyId">
      <img :src="comtyInfo.comtyLogo">
      <h3>{{ comtyInfo.comtyName }}</h3>
      <p v-html="msgDetails"></p>

      <!-- 按钮 -->
      <p v-if="resultState == 2" class="agree" @click="submit(1)">同意</p>
      <p v-if="resultState == 2" class="refuse" @click="submit(0)">拒绝</p>

      <p v-if="resultState != 2" class="agree disabled">{{ resultState == 1 ? "已同意" : "已拒绝" }}</p>
    </div>

    <empty v-else :isFullScreen="true"></empty>
  </section>
</template>

<script>
  import header from "~/components/header.vue";
  import empty from "~/components/empty.vue";
  import { commonMixin, comtyIdValid } from "~/mixins";
  import doctorService from "~/services/doctorService.js";

  export default {
    mixins: [commonMixin],
    components: {
      mHeader: header,
      empty
    },
    async asyncData({ route, redirect, store, query}) {
      // 获取社区信息
      let comtyInfo = await comtyIdValid.getComtyInfo({ redirect, store, query });

      // 获取邀请函信息
      let msgInfo = {};
      let resultState = 2;

      console.log("####doc invite");
      console.log("####doc invite is_login: " + store.getters.isLogin);

      if (store.getters.isLogin) {
        let doctorID = store.state.userInfo.parentUserId;// 医生id // 5d156b626d46b20008e9d521
        let clinicId = query.clinicId;// 5d0b665226c24500081f23ca
        console.log("####doc invite doctorID: " + doctorID);
        console.log("####doc invite clinicId: " + clinicId);

        let msg = await doctorService.getStationMsg({
          msgTitle: "社区医院邀请",
          userId: doctorID,
          commpanyId: clinicId
        });

        console.log("####doc invite msg: " + JSON.stringify(msg));
        if (msg.status == 200 && msg.data) {
          msgInfo = msg.data;
        }

        // 检查是否已经操作
        let res = await doctorService.findClinicDoctorByQuery({
          clinicId: clinicId,
          doctorId: doctorID
        });

        console.log("####doc invite res: " + JSON.stringify(res));
        if (res.status == 200 && res.data) {
          resultState = res.data.doctorStatus;
        }
      }

      return {
        comtyInfo,
        msgInfo,
        resultState,
      };
    },
    data() {
      return {
        comtyInfo: {},
        msgInfo: {},
        resultState: 2, // 0：已拒绝 1：已加入 2：待加入
      };
    },
    computed: {
      msgDetails() {
        if (this.msgInfo && this.msgInfo.text) {
          return this.msgInfo.text;//.replace(/\[/g, "<i>[").replace(/\]/g, "]</i>")
        } else {
          return "";
        }
      }
    },
    methods: {
      submit(type) {
        if (this.resultState != 2) { return; }

        doctorService.updateClinicDoctor({
          clinicId: this.msgInfo.commpanyId,
          doctorId: this.$store.state.userInfo.parentUserId,
          doctorStatus: type,
        }).then( res => {
          if (res.status == 200) {
            this.resultState = type;
          }
        });
      }
    },
    head() {
      return {
        title: "社区医院邀请"
      };
    }
  };

</script>

<style lang="less" scoped>
  @import "~assets/css/config.less";

  .invitation {
    .flex-center();
    flex-direction: column;
    padding: 30px 30px 40px;
    background: #fff;
    text-align: center;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    h3 {
      margin-top: 10px;
      font-size: @h4;
      font-weight: bold;
    }
    p {
      margin-top: 10px;
      color: @color6;
      font-size: 12px;
      /deep/ i {
        margin: 0 3px;
        color: #6FB0FD;
      }
    }
    .agree, .refuse {
      width: 150px;
      height: 38px;
      line-height: 38px;
      font-size: @h4;
      border-radius: 3px;
    }
    .agree {
      margin-top: 40px;
      color: #fff;
      background: @activeC;
    }

    .refuse {
      color: @activeC;
    }

    .disabled {
      color: #fff;
      background: #CFCFCF;
    }
  }
</style>
