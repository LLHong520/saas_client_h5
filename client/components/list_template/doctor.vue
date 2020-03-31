<template>
  <div class="doctor_list" v-if="list.length > 0">
    <ul>
      <li v-for="(item,index) in list" :key="index">
        <a @click="preventDoctorLink(item, item.customerId)">
          <div class="img"><img v-lazy="GET_IMG_URL(item.headPicUrl,'doc')" alt=""></div>
          <div class="info">
            <dl>
              <dt><span class="name">{{item.customerName}}</span>&nbsp;&nbsp;{{item.title}}</dt>
              <dd>{{item.depName}}&nbsp;&nbsp;{{item.hospital}}</dd>
              <dd class="doc_info_con"><span class="doc_info_name">问诊量</span><span class="doc_info_dtl"> {{item.serviceCount}}</span><span class="doc_info_name" style="margin-left: 15px">好评率</span><span class="doc_info_dtl"> {{item.applauseRate}}</span></dd>
              <dd class="goodat singleLine">擅长：{{item.expertiseArea}}</dd>
            </dl>
          </div>
        </a>
      </li>
    </ul>

  </div>
</template>

<script>
  import utils from "@/utils/index.js";
  import {commonMixin} from "~/mixins";

  export default {
    mixins: [commonMixin],
    props: {
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {};
    },
    created() {
    },
    methods: {
      dateFormat(time) {
        return utils.dateFormat(time, "YMD");
      }
    }
  };
</script>
<style lang="less" scoped>
  .doctor_list {
    li {
      padding: 15px 0;
      border-bottom: 1px solid #efefef;
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
      .doc_info_con {
        margin-top: 5px;
      }
      .doc_info_dtl {
        font-size: 11px;
        color: #2688fc;
        line-height: 16px;

      }
      .doc_info_name {
        font-size: 11px;
        font-weight: bold;
        color: #cfcfcf;

        line-height: 16px;
      }
      .goodat {
        font-size: 11px;
        color: #999;
        .icon_circle {
          display: inline-block;
          width: 14px;
          height: 10px;
          background: url(../../assets/images/icon_speciality@2x.png) no-repeat;
          background-size: 14px 10px;
          margin-right: 12px;
        }
      }
    }
  }
</style>
