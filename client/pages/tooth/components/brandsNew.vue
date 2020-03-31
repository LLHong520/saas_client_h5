<template>
  <section class="brands">
    <section class="brands-header">
      <section class="brands-title">本问卷由新浪健康提供</section>
      <section class="brands-desc">新浪健康·全国领先品质医疗咨询平台，旨在打造国内无距离医疗平台，解决用户就医难，就医远，就医贵，就医迷茫等问题，实现技术价值最大化，为用户打造一个最合适的就医平台。</section>
    </section>
    <section class="brands-list">
      <section class="brand-item" v-for="(v,k) in brandList" :key="k">
        <img :src="v.img" alt="" :style="{ width: v.width}">
        <p class="title">{{v.title}}</p>
        <p class="name">{{v.name}}</p>
      </section>
    </section>
  </section>
</template>

<script>
  import test_high_doctor_level from "../images/test_high_doctor_level@2x.png";
  import test_hospital_is_good from "../images/test_hospital_is_good@2x.png";
  import test_advanced_icon from "../images/test_advanced_icon@2x.png";
  import test_aesthetics_icon from "../images/test_aesthetics_icon@2x.png";
  import test_certification_icon from "../images/test_certification_icon@2x.png";

  export default {
    name: "brandsNew",
    components: {},
    props: {},
    mixins: [],
    directives: {},
    filters: {},
    data() {
      return {
        brandList:[
          {
            img:test_high_doctor_level,
            title:"效果稳定",
            name:"医生水平高",
          },
          {
            img:test_hospital_is_good,
            title:"治疗舒适",
            name:"医院环境好",
          },
          {
            img:test_advanced_icon,
            title:"设备先进",
            name:"不先进不入驻",
          },
          {
            img:test_aesthetics_icon,
            title:"科学&美感",
            name:"美学科学结合",
          },
          {
            img:test_certification_icon,
            title:"平台认证",
            name:"就医安全保障",
            width:"32px"
          }
        ]
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style scoped lang="less">
  .brands{
    width: 100%;
    box-sizing: border-box;
    padding: 14px 0px;
    position: relative;
    .brands-list{
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      padding: 0 11px;
      .brand-item{
        width: 87px;
        height: 87px;
        padding: 9px 0;
        border-radius: 50%;
        border:2px solid rgba(220,220,220,1);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-left: 10px;
        &:first-child{
          margin-left: 0;
        }
        img{
          width: 34px;
          margin-bottom: 4px;
          vertical-align: middle;
        }
        .title{
          font-size:12px;
          font-weight:500;
          color:rgba(102,102,102,1);
          line-height:19px;
        }
        .name{
          font-size:8px;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:11px;
        }
      }
    }
    .brands-header{
      margin-bottom: 13px;
      .brands-title{
        font-size:15px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:19px;
        text-align: center;
        margin-bottom: 12px;
      }
      .brands-desc{
        font-size:12px;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:18px;
        text-align: justify;
      }
    }
  }
  @media screen and (max-width: 374px){
    .brands{
      .brands-list{
        .brand-item{
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
