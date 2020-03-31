<template>
  <section class="result">
    <section class="result-header">
      <section class="line">
        <p>您的牙齿存在一定程度的畸形，</p>
      </section>
      <section class="line">
        <p>可能会出现的影响：</p>
      </section>
    </section>
    <ul class="result-list">
      <li v-for="(v,k) in resultList" :key="k">{{v}}</li>
    </ul>
    <section class="result-advise">
      建议到医院确诊，进一步了解并消除潜在的牙周风险。
    </section>
  </section>
</template>

<script>

  export default {
    name: "testResult1",
    components: {},
    props: {},
    mixins: [],
    directives: {},
    filters: {},
    data() {
      return {
        resultList:[
          "1.咀嚼效率低下，营养摄取量减少。",
          "2.牙周损伤、牙齿过早的松动脱落等疾患。",
          "3.口腔功能，如上下前牙无法咬合造成发音异常，后牙锁颌影响咀嚼功能，严重的下颌前突造成吞咽异常，下颌严重后缩则影响呼吸功能。",
          "4.口腔健康：不能自洁，菌斑结石堆积，引起龋病及牙龈牙周的炎症。"
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
  .result{
    padding-bottom: 21px;
    .result-header{
      margin-bottom: 17px;
      .line{
        margin-top: 2px;
        &:first-child{
          margin-top: 0;
        }
      }
      p{
        display: inline-block;
        font-size:18px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:24px;
        background:rgba(51,51,51,1);
      }
    }
    .result-list{
      font-size:12px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:16px;
      li{
        margin-bottom: 10px;
      }
    }
    .result-advise{
      color: #333333;
      font-size: 12px;
      font-weight: bold;
      line-height: 16px;
    }
  }
</style>
